<<<<<<< HEAD
var mongodb = require('mongodb').Db;
var settings = require('../settings');
=======
>>>>>>> prod
var ObjectID = require('mongodb').ObjectID;
var Db = require('./db');
var async = require('async');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name:"mongoPool",
    create: function(callback){
        var mongodb = Db();
        callback(null,mongodb);
    },
    destroy : function(mongodb){
        pool.release(mongodb);
    },
    max:100,
    min:5,
    idleTimeoutMillis: 30000,
    log:true
});
function Comment(articleId, comment) {
  this.articleId = articleId;
  this.comment = comment;
}

module.exports = Comment;

//存储一条留言信息
Comment.prototype.save = function(callback) {
  var articleId = this.articleId,
      comment = this.comment;
<<<<<<< HEAD
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //通过用户名、时间及标题查找文档，并把一条留言对象添加到该文档的 comments 数组里
      collection.update({
		  "_id" :new ObjectID(articleId)
      }, {
        $push: {"comments": comment}
      } , function (err) {
          db.close();
          if (err) {
            return callback(err);
          }
          callback(null);
      });   
    });
  });
=======
pool.acquire(function(err,mongodb){
  async.waterfall([
		  function(cb){
			  mongodb.open(function(err,db){
				  cb(err,db);
			  });
		  },
		  function(db,cb){
			  db.collection('posts',function(err,collection){
				  cb(err,collection);
			  });
		  },
		  function(collection,cb){
			  collection.update({
				  "_id":new ObjectID(articleId)
			  },{$push:{"comments":comment}},
			  function(err){
				  cb(err);
			  });
		  }],function(err){
			  pool.release(mongodb);
			  callback(err);
		  });
});
>>>>>>> prod
};
