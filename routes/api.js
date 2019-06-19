/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  app.use(function(req, res, next){
    console.log(req.method +' '+ req.path  + ' - ' + req.ip)
    next()
  })
  
  app.route('/api/threads/:board')
  
    .post(function(req, res){
      var board = req.params.board,
          text = req.body.text,
          delete_password = req.body.delete_password;
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {
        err?console.log(err):console.log("database connection successful for POST threads")
        var dbo = db.db("anonmessageboard")
        dbo.collection(board).insertOne(
          {
            text: text,
            created_on:  new Date(),
            bumped_on:  new Date(),
            reported: false,
            delete_password: delete_password,
            replies:[],
            replycount:0
          }
        )
        db.close()
      })
      res.redirect( '/b/' + board +'/' )
    })
  
    .get(function(req, res){
      var board = req.params.board
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {
        err?console.log(err):console.log("database connection successful for GET threads")
        var dbo=db.db("anonmessageboard")
        dbo.collection(board)
          .find()
          .limit(10)
          .project({reported:0, delete_password:0, replies:{$slice:-3}, 'replies.reported':0, 'replies.delete_password':0})
          .sort({bumped_on:-1})
          .toArray(function(err, result) {
          err?console.log(err):res.json(result)
          db.close();
        })
      })
    
    })
  
    .delete(function(req, res){
      var thread_id = req.body.thread_id,
          delete_password = req.body.delete_password,
          board;
      req.body.board?board=req.body.board:board=req.params.board
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {
        err?console.log(err):console.log("database connection successful DELETE threads")
        var dbo = db.db("anonmessageboard")
        dbo.collection(board).deleteOne(
        {
          $and:[{_id: ObjectId(thread_id)}, {delete_password: delete_password}]
        }, function(err, deleted) {
          err?console.log(err):deleted.deletedCount===0?res.json("incorrect password"):res.json("success")
          db.close();
        })
      })
      
    
    })
  
    .put(function(req, res){
      var report_id = ObjectId(req.body.report_id),
          board;
      req.body.board?board=req.body.board:board=req.params.board
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function (err, db) {
        err?console.log(err):console.log("database connection successful PUT threads")
        var dbo = db.db("anonmessageboard")
        dbo.collection(board).updateOne(
        {
          _id: report_id
        },{
          $set:{
            reported: true
          }
        }, function(err, reported) {
          err?console.log(err):console.log("a thread has been reported")
          reported.result.nModified===1?res.json("success"):res.json("already reported")
          db.close()
        })
      })      
    })
    
  app.route('/api/replies/:board')
  
    .post(function(req, res){
      var board=req.params.board,
          thread_id=req.body.thread_id,
          reply_text=req.body.text,
          reply_delete_password=req.body.delete_password
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {
      err?console.log(err):console.log("database connection successful for POST replies")
      var dbo=db.db("anonmessageboard")
      dbo.collection(board).updateOne(
        {
          _id:ObjectId(thread_id)
        }, {
          $set:{
            bumped_on: new Date()
          },
          $push:{
            replies: {
              _id: new ObjectId, 
              text:reply_text, 
              created_on:  new Date(), 
              delete_password:reply_delete_password, 
              reported: false
            }
          },
          $inc:{replycount:1}
        },{
          upsert: true
        }, function(err, updated){
        err?console.log(err):res.redirect( '/b/' + board + '/' + thread_id)
        db.close();
      })
      
    })
    
    })
  
    .get(function(req, res){
      var board = req.params.board,
          thread_id = ObjectId(req.query.thread_id)
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser:true}, function(err, db) {
        err?console.log(err):console.log("database connection successful GET replies")
        var dbo = db.db("anonmessageboard")
        dbo.collection(board)
          .find({_id:thread_id})
          .project({reported:0, delete_password:0, 'replies.reported':0, 'replies.delete_password':0})
          .toArray(function(err, result) {
            err?console.log(err):res.json(result[0])
            db.close();
          })
      })
    })
  
    .delete(function(req, res){
      var thread_id = ObjectId(req.body.thread_id),
          reply_id = ObjectId(req.body.reply_id),
          delete_password = req.body.delete_password,
          board;
      req.body.board?board=req.body.board:board=req.params.board
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {
        err?console.log(err):console.log("database connection successful DELETE replies")
        var dbo = db.db("anonmessageboard")
        dbo.collection(board).updateOne({_id: thread_id, 'replies._id': reply_id, delete_password:delete_password}, {$set:{'replies.$.text':"[deleted]"}}, function(err, updated) {
          err?console.log(err):updated.result.n===0?res.json("incorrect password"):updated.result.nModified===0?res.json("already deleted"):res.json("success")
          db.close();
        })
      })
    })
  
    .put(function(req, res){
      var board,
          thread_id = ObjectId(req.body.thread_id),
          reply_id = ObjectId(req.body.reply_id);
      req.body.board?board=req.body.board:board=req.params.board
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true}, function(err, db) {
        err?console.log(err):console.log("database connection successful PUT replies")
        var dbo = db.db("anonmessageboard")
        dbo.collection(board).updateOne({_id: thread_id, 'replies._id': reply_id}, {$set:{'replies.$.reported': true}}, function (err, reported) {
          err?console.log(err):reported.result.nModified===1?res.json("success"):res.json("already reported")
          db.close();
        })
      })
    })

};
