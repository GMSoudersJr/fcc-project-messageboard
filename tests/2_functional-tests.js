/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
const chaiIterator = require('chai-iterator');

var assert = chai.assert;
var server = require('../server');
var mbTestThread = {text: "Testing 1, 2, 3", delete_password:"Testing 1, 2, 3"}
var mbReply = {text:"Testing 1, 2, 3", delete_password: "Testing 1, 2, 3"}
var testThread1,
    testThread2,
    testReply1,
    testReply2
chai.use(chaiHttp);
chai.use(chaiIterator);
chai.should();
chai.use(require('chai-things'))
chai.use(require('chai-datetime'));

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Post a thread to the message board /api/threads/:board', function(done){
        chai.request(server)
        .post('/api/threads/Testing')
        .send(mbTestThread)
        .end(function(err, res){//adding 11 threads to the test to make sure only ten are visible
          assert.equal(res.status, 200);
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.type, "text/html")
          assert.include(res.redirects[0], "/b/Testing")
          
          chai.request(server)
          .post('/api/threads/Testing')
          .send(mbTestThread)
          .end(function (err, res){
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            assert.include(res.redirects[0], "/b/Testing")
            
            chai.request(server)
            .post('/api/threads/Testing')
            .send(mbTestThread)
            .end(function (err, res){
              assert.equal(res.status, 200)
              assert.equal(res.type, "text/html")
              assert.include(res.redirects[0], "/b/Testing")
              
              chai.request(server)
              .post('/api/threads/Testing')
              .send(mbTestThread)
              .end(function (err, res){
                assert.equal(res.status, 200)
                assert.equal(res.type, "text/html")
                assert.include(res.redirects[0], "/b/Testing")
                
                chai.request(server)
                .post('/api/threads/Testing')
                .send(mbTestThread)
                .end(function (err, res){
                  assert.equal(res.status, 200)
                  assert.equal(res.type, "text/html")
                  assert.include(res.redirects[0], "/b/Testing")
                  
                  chai.request(server)
                  .post('/api/threads/Testing')
                  .send(mbTestThread)
                  .end(function (err, res){
                    assert.equal(res.status, 200)
                    assert.equal(res.type, "text/html")
                    assert.include(res.redirects[0], "/b/Testing")
                    
                    chai.request(server)
                    .post('/api/threads/Testing')
                    .send(mbTestThread)
                    .end(function (err, res){
                      assert.equal(res.status, 200)
                      assert.equal(res.type, "text/html")
                      assert.include(res.redirects[0], "/b/Testing")
                      
                      chai.request(server)
                      .post('/api/threads/Testing')
                      .send(mbTestThread)
                      .end(function (err, res){
                        assert.equal(res.status, 200)
                        assert.equal(res.type, "text/html")
                        assert.include(res.redirects[0], "/b/Testing")
                        
                        chai.request(server)
                        .post('/api/threads/Testing')
                        .send(mbTestThread)
                        .end(function (err, res){
                          assert.equal(res.status, 200)
                          assert.equal(res.type, "text/html")
                          assert.include(res.redirects[0], "/b/Testing")
                          
                          chai.request(server)
                          .post('/api/threads/Testing')
                          .send(mbTestThread)
                          .end(function (err, res){
                            assert.equal(res.status, 200)
                            assert.equal(res.type, "text/html")
                            assert.include(res.redirects[0], "/b/Testing")
                            
                            chai.request(server)
                            .post('/api/threads/Testing')
                            .send(mbTestThread)
                            .end(function (err, res){
                              assert.equal(res.status, 200)
                              assert.equal(res.type, "text/html")
                              assert.include(res.redirects[0], "/b/Testing")
                              done();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    
    suite('GET', function() {
      test('Get all the threads for a message board.  Only the most recent 10 threads are visible along with their 3 most recent replies /api/threads/:board', function(done){
        chai.request(server)
        .get('/api/threads/Testing')
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.isArray(res.body, 'the response should be an array')
          assert.isAtMost(res.body.length, 10, "there should only be a maximum of 10 threads visible")
          assert.isIterable(res.body, "this should be iterable")
          res.body.should.all.have.property('_id')
          res.body.should.all.have.property('text')
          res.body.should.all.have.property('created_on')
          res.body.should.all.have.property('bumped_on')
          res.body.should.all.have.property('replies')
          res.body.should.all.have.property('replycount')
          res.body.should.all.not.have.property('reported')
          res.body.should.all.not.have.property('delete_password')
          res.body.forEach(thread=>{
            assert.isIterable(thread.replies)
            assert.isAtMost(thread.replies.length, 3, "Thread " + thread._id + " has too many replies showing")
            assert.isString(thread.text)
            assert.equal(thread.created_on, thread.bumped_on, "Thread "+ thread._id + " should have the same 'created_on' and 'bumped_on' value")
          })
          testThread1={...res.body[0]}
          testThread2={...res.body[1]}
          done();
        })
      })
    });
    
    suite('DELETE', function() {
      test('delete a thread from the message board with correct password /api/threads/:board', function(done){
        chai.request(server)
        .delete('/api/threads/Testing')
        .send({thread_id: testThread1._id, delete_password: mbTestThread.delete_password})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.body, "success")
          done();
        })
      })
      
      test('delete a thread from the message board with the incorrect password should fail', function(done){
        chai.request(server)
        .delete('/api/threads/Testing')
        .send({thread_id: testThread2._id, delete_password: "wrong password"})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.body, "incorrect password")
          done()
        })
      })
      
    
    });
    
    suite('PUT', function() {
      
      test('put a thread on blast from the message board /api/threads/:board', function(done){
        chai.request(server)
        .put('/api/threads/Testing')
        .send({report_id: testThread2._id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.body, "success", "the first click should trigger a 'success' response")
          done();
        })
      })
      
      test('put a thread on blast, again', function(done){
        chai.request(server)
        .put('/api/threads/Testing')
        .send({report_id: testThread2._id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.body, "already reported", "The second click should trigger an 'already reported' response")
          done();
        }) 
      })
    });
  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('post replies to a thread and it should redirect to that thread /api/replies/:board', function(done){
        chai.request(server)
        .post('/api/replies/Testing')
        .send({thread_id: testThread2._id, text: mbReply.text, delete_password: mbReply.delete_password})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.type, "text/html")
          assert.include(res.redirects[0], "/b/Testing/"+testThread2._id)
          
          chai.request(server)
          .post('/api/replies/Testing')
          .send({thread_id: testThread2._id, text: mbReply.text, delete_password: mbReply.delete_password})
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            assert.include(res.redirects[0], "/b/Testing/"+testThread2._id)
            
            chai.request(server)
            .post('/api/replies/Testing')
            .send({thread_id: testThread2._id, text: mbReply.text, delete_password: mbReply.delete_password})
            .end(function(err, res){
              assert.equal(res.status, 200)
              assert.equal(res.type, "text/html")
              assert.include(res.redirects[0], "/b/Testing/"+testThread2._id)
              
              chai.request(server)
              .post('/api/replies/Testing')
              .send({thread_id: testThread2._id, text: mbReply.text, delete_password: mbReply.delete_password})
              .end(function(err, res){
                assert.equal(res.status, 200)
                assert.equal(res.type, "text/html")
                assert.include(res.redirects[0], "/b/Testing/"+testThread2._id)
                
                chai.request(server)
                .get('/api/threads/Testing')
                .end(function(err, res){
                  assert.equal(res.status, 200)
                  assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
                  assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
                  assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
                  res.body.forEach(el=>{
                    assert.isIterable(el.replies)
                    assert.isAtMost(el.replies.length, 3, "Thread " + el._id + " has too many replies showing")
                    assert.isString(el.text)
                  })
                  done();
                })
          
              })
            })
          })
        })
      })
    });
    
    suite('GET', function() {
      test('get a thread and all of its replies /api/replies/:board?thread_id={thread_id}', function(done){
        chai.request(server)
        .get('/api/replies/Testing')
        .query({thread_id: testThread2._id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.isObject(res.body)
          assert.property(res.body, '_id')
          assert.property(res.body, 'text')
          assert.property(res.body, 'created_on')
          assert.property(res.body, 'bumped_on')
          assert.notEqual(res.body.created_on, res.body.bumped_on)
          assert.property(res.body, 'replies')
          assert.property(res.body, 'replycount')
          res.body.should.not.have.property('reported')
          res.body.should.not.have.property('delete_password')
          assert.equal(res.body.replies.length, res.body.replycount)
          assert.isIterable(res.body.replies)
          res.body.replies.should.all.have.property('_id')
          res.body.replies.should.all.have.property('text')
          res.body.replies.should.all.have.property('created_on')
          res.body.replies.should.all.not.have.property('reported')
          res.body.replies.should.all.not.have.property('delete_password')
          res.body.replies.forEach(reply=>{
            assert.isString(reply.text)
          })
          testReply1={...res.body.replies[0]}
          testReply2={...res.body.replies[1]}
          done();
        })
      })
    });
    
    suite('PUT', function() {
      test('put a reply on blast for the first time /api/replies/:board', function(done){
        chai.request(server)
        .put('/api/replies/Testing')
        .send({thread_id: testThread2._id, reply_id: testReply1._id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.body, "success")
          done();
        })
      })
      
      test('put a reply on blast, again /api/replies/:board', function(done){
        chai.request(server)
        .put('/api/replies/Testing')
        .send({thread_id: testThread2._id, reply_id: testReply1._id})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.body, "already reported")
          done();
        })
      })
    });
    
    suite('DELETE', function() {
      test('delete a reply with the correct password/api/replies/:board}', function(done){
        chai.request(server)
        .delete('/api/replies/Testing')
        .send({
          thread_id: testThread2._id, reply_id: testReply1._id, delete_password: mbReply.delete_password
        })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.body, "success")
          
          chai.request(server)
          .get('/api/replies/Testing')
          .query({thread_id: testThread2._id})
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.equal(res.body.replies[0].text, "[deleted]")
            
            chai.request(server)
            .delete('/api/replies/Testing')
            .send({
              thread_id: testThread2._id, reply_id: testReply1._id, delete_password: mbReply.delete_password
            })
            .end(function(err, res){
              assert.equal(res.status, 200)
              assert.equal(res.body, "already deleted")
            done();
            })
          })
        })
      })
      
      test('delete a reply with an incorrect password should fail', function(done){
        chai.request(server)
        .delete('/api/replies/Testing')
        .send({thread_id: testThread2._id, reply_id: testReply1._id, delete_password: "incorrect"})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.header['x-frame-options'], "SAMEORIGIN", "only allow your site to be loading in an iFrame on your own pages")
          assert.equal(res.header['referrer-policy'], "same-origin", "Only allow your site to send the referrer for your own pages")
          assert.equal(res.header['x-dns-prefetch-control'], "off", "do not allow DNS prefetching")
          assert.equal(res.body, "incorrect password")
          done();
        })
      })
    });
    
  });
  
  suite('Clean it out', function(){
    test('get rid of all the threads /api/threads/:board', function(done){
      chai.request(server)
      .get('/api/threads/Testing')
      .end(function(err, res){
        assert.equal(res.status, 200)
        res.body.forEach(thread=>{
          chai.request(server)
          .delete('/api/threads/Testing')
          .send({thread_id: thread._id, delete_password: mbTestThread.delete_password})
          .end(function(err, res){
            assert.equal(res.status, 200)
          })
        })
        done();
      })
    })
  });
  
});
