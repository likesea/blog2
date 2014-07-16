var ObjectID = require('mongodb').ObjectID;
<<<<<<< HEAD
var mongodb = require('mongodb').Db;
var settings = require('../settings');
=======
var Db = require('./db');
>>>>>>> prod
var markdown = require('markdown').markdown;
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
function Post (name,head,title,tags,post) {
	this.name = name;
	this.head = head;
	this.title =title;
  this.tags = tags;
	this.post = post;
	// body...
}
module.exports = Post;
Post.prototype.save = function(callback) {
	var date = new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth() + 1),
      	day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      	minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      	date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	};
	var post = {
		name:this.name,
		head:this.head,
		time:time,
		title:this.title,
		tags:this.tags,
		post:this.post,
		comments:[],
		reprint_info:{},
		pv:0
	};
<<<<<<< HEAD
	mongodb.connect(settings.url, function (err, db) {
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if (err) {
				db.close();
				return callback(err);
			};
			collection.insert(post,{
				safe:true
			},function(err){
				db.close();
=======
	// 
    pool.acquire(function(err,mongodb){
        async.waterfall([
            function(cb){
                mongodb.open(function(err,db) {
                    cb(err,db);
                });
            },
            function(db,cb){
                db.collection('posts',function(err,collection){
                    cb(err,collection);
                });
            },
            function(collection,cb){
                collection.insert(post,{safe:true},function(err){
                    cb(err);
                });
            }],
            function(err){
                pool.release(mongodb);
                callback(err);
            });
    });
};
Post.getTen = function(name, page, callback) {
  //�����ݿ�
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
				var query ={};
				if(name){
					query.name =name;
				}
				collection.count(query,function(err,total){
					cb(err,collection,query,total);					
				});
			},
			function(collection,query,total,cb){
				collection.find(query,{skip:(page-1)*10,limit:10})
					.sort({time:-1})
					.toArray(function(err,docs){
						cb(err,docs,total);
					});
			}],
			function(err,docs,total){
				pool.release(mongodb);
>>>>>>> prod
				if(err){
					callback(err);
				}
				docs.forEach(function(doc){
					doc.post = markdown.toHTML(doc.post);
				});
				callback(null,docs,total);
			});
<<<<<<< HEAD
		});
	});
	// body...
};
Post.getTen = function(name, page, callback) {
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
      var query = {};
      if (name) {
        query.name = name;
      }
      //使用 count 返回特定查询的文档数 total
      collection.count(query, function (err, total) {
        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
        collection.find(query, {
          skip: (page - 1)*10,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          db.close();
          if (err) {
            return callback(err);
          }
          //解析 markdown 为 html
          docs.forEach(function (doc) {
            doc.post = markdown.toHTML(doc.post);
          });  
          callback(null, docs, total);
=======
>>>>>>> prod
        });
    };
  
Post.getOne = function(_id,callback) {
<<<<<<< HEAD
	mongodb.connect(settings.url, function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				db.close();
				return callback(err);
			}
		
			collection.findOne({
				"_id":new ObjectID(_id)
			},function  (err,doc) {
				if(err){
				db.close();
					return callback(err);
				}
				if(doc){
					collection.update(
					{
						"_id":new ObjectID(_id)
  					},{
						$inc :{"pv":1}
					},
					function(err){
						db.close();
						if(err){
							return callback(err);
						}
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
				collection.findOne({"_id":new ObjectID(_id)},function(err,doc){
					cb(err,collection,doc);
				});
			},
			function(collection,doc,cb){
				if(doc){
					collection.update({"_id":new ObjectID(_id)},{$inc:{"pv":1}},
						function(err){
							cb(err,doc);
>>>>>>> prod
						});
				}
			}],
			function(err,doc){
				pool.release(mongodb);
				doc.post = markdown.toHTML(doc.post);
				doc.comments.forEach(function(comment){
					comment.content = markdown.toHTML(comment.content);
				});
				callback(err,doc);
			});
    });
};

//����ԭʼ�������µ����ݣ�markdown��ʽ��
Post.edit = function  (_id,callback) {
<<<<<<< HEAD
	mongodb.connect(settings.url, function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('posts',function  (err,collection) {
			if(err){
				db.close();
				return callback(err);
			}
			collection.findOne({
				"_id":new ObjectID(_id)
			},function  (err,doc) {
				db.close();
				if(err){
					return callback(err);
				}
				callback(null,doc);
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
				collection.findOne({"_id":new ObjectID(_id)},function(err,doc){
					cb(err,doc);
				});
			}],
			function(err,doc){
				pool.release(mongodb);
				callback(err,doc);
>>>>>>> prod
			});
    });
};

//����һƪ���¼��������Ϣ
Post.update = function(_id, post, callback) {
<<<<<<< HEAD
  //打开数据库
  	mongodb.connect(settings.url, function (err, db) {
=======
  //�����ݿ�
  pool.acquire(function (err, mongodb) {
  	mongodb.open(function (err, db) {
>>>>>>> prod
    	if (err) {
      		return callback(err);
    	}
    //��ȡ posts ����
    	db.collection('posts', function (err, collection) {
      		if (err) {
<<<<<<< HEAD
        		db.close();
=======
        		pool.release(mongodb);
>>>>>>> prod
        		return callback(err);
      		}
      //������������
      		collection.update({
				"_id":new ObjectID(_id)
      		}, {
        	$set: {post: post}
      	}, function (err) {
<<<<<<< HEAD
        	db.close();
=======
        	pool.release(mongodb);
>>>>>>> prod
        	if (err) {
        	  	return callback(err);
        	}
        	callback(null);
      });
    });
    });
  });
};
//ɾ��һƪ����
Post.remove = function(_id, callback) {
<<<<<<< HEAD
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
=======
  //�����ݿ�
  pool.acquire(function (err, mongodb) {
  mongodb.open(function (err, db) {
>>>>>>> prod
    if (err) {
      return callback(err);
    }
    //��ȡ posts ����
    db.collection('posts', function (err, collection) {
      if (err) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        return callback(err);
      }
      //��ѯҪɾ�����ĵ�
      collection.findOne({
		  "_id":new ObjectID(_id)
      }, function (err, doc) {
        if (err) {
<<<<<<< HEAD
          db.close();
=======
          pool.release(mongodb);
>>>>>>> prod
          return callback(err);
        }
        //����� reprint_from������������ת�����ģ��ȱ������� reprint_from
        var reprint_from = "";
        if (doc.reprint_info.reprint_from) {
          reprint_from = doc.reprint_info.reprint_from;
        }
        if (reprint_from != "") {
          //����ԭ���������ĵ��� reprint_to
          collection.update({
            "_id": reprint_from.postID
          }, {
            $pull: {
              "reprint_info.reprint_to": {
				"articleID":doc._id,  
                "name": doc.name,
                "day": doc.time.day,
                "title": doc.title
            }}
          }, function (err) {
            if (err) {
<<<<<<< HEAD
              db.close();
=======
              pool.release(mongodb);
>>>>>>> prod
              return callback(err);
            }
          });
        }

        //ɾ��ת�������������ڵ��ĵ�
        collection.remove({
			"_id":new ObjectID(_id)
        }, {
          w: 1
        }, function (err) {
<<<<<<< HEAD
          db.close();
=======
          pool.release(mongodb);
>>>>>>> prod
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      });
    });
    });
  });
};
//�����������´浵��Ϣ
Post.getArchive = function(callback) {
<<<<<<< HEAD
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
=======
  //�����ݿ�
  pool.acquire(function (err, mongodb) {
  mongodb.open(function (err, db) {
>>>>>>> prod
    if (err) {
      return callback(err);
    }
    //��ȡ posts ����
    db.collection('posts', function (err, collection) {
      if (err) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        return callback(err);
      }
      //����ֻ���� name��time��title ���Ե��ĵ���ɵĴ浵����
      collection.find({}, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
});
  });
};
Post.getTags = function(callback){
<<<<<<< HEAD
	mongodb.connect(settings.url, function (err, db) {
=======
    pool.acquire(function (err, mongodb) {
	mongodb.open(function(err,db){
>>>>>>> prod
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
<<<<<<< HEAD
				db.close();
				return close(err);
			}
			collection.distinct("tags",function(err,docs){
				db.close();
=======
				pool.release(mongodb);
				return close(err);
			}
			collection.distinct("tags",function(err,docs){
				pool.release(mongodb);
>>>>>>> prod
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
        });
		});
	});
};
Post.getTag = function(tag, callback) {
<<<<<<< HEAD
  mongodb.connect(settings.url, function (err, db) {
=======
    pool.acquire(function (err, mongodb) {
  mongodb.open(function (err, db) {
>>>>>>> prod
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        return callback(err);
      }
      //��ѯ���� tags �����ڰ��� tag ���ĵ�
      //������ֻ���� name��time��title ��ɵ�����
      collection.find({
        "tags": tag
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
});
};
Post.search = function(keyword, callback) {
<<<<<<< HEAD
  mongodb.connect(settings.url, function (err, db) {
=======
    pool.acquire(function (err, mongodb) {
  mongodb.open(function (err, db) {
>>>>>>> prod
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        return callback(err);
      }
      var pattern = new RegExp("^.*" + keyword + ".*$", "i");
      collection.find({
        "title": pattern
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        if (err) {
         return callback(err);
        }
        callback(null, docs);
      });
    });
});
  });
};
Post.reprint = function(reprint_from, reprint_to, callback) {
<<<<<<< HEAD
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //找到被转载的文章的原文档
      collection.findOne({
		  "_id":new ObjectID(reprint_from.postID)
      }, function (err, doc) {
        if (err) {
          db.close();
          return callback(err);
        }

        var date = new Date();
        var time = {
            date: date,
            year : date.getFullYear(),
            month : date.getFullYear() + "-" + (date.getMonth() + 1),
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        }

        delete doc._id;//注意要删掉原来的 _id

        doc.name = reprint_to.name;
        doc.head = reprint_to.head;
        doc.time = time;
        doc.title = (doc.title.search(/[转载]/) > -1) ? doc.title : "[转载]" + doc.title;
        doc.comments = [];
        doc.reprint_info = {"reprint_from": reprint_from};
        doc.pv = 0;
 //将转载生成的副本修改后存入数据库，并返回存储后的文档
        collection.insert(doc, {
          safe: true
        }, function (err, post) {
          if (err) {
            return callback(err);
          }
		//更新被转载的原文档的 reprint_info 内的 reprint_to
        collection.update({
          "_id": reprint_from.postID
        }, {
          $push: {
            "reprint_info.reprint_to": {
               "articleID":post[0]._id,
			  "name": doc.name,
              "day": time.day,
              "title": doc.title
          }}
        }, function (err) {
          if (err) {
            db.close();
            return callback(err);
          }
          db.close();
		  callback(err,post[0]);
			});
		  //之前未考虑异步而将关闭数据库放在这里，
		  //这将会导致update的回调函数抛出err错误
         // db.close();
		  //考虑异步调用，不适合放在这里
         // callback(err, post[0]);
        });
      });
    });
  });
=======
    pool.acquire(function (err, mongodb) {
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
				collection.findOne({"_id":new ObjectID(reprint_from.postID)},function(err,doc){
					cb(err,collection,doc);
				});
			},
			function(collection,doc,cb){
				var date = new Date();
				var time = {
					date: date,
					year : date.getFullYear(),
					month : date.getFullYear() + "-" + (date.getMonth() + 1),
					day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
					minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
					date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
				}
				delete doc._id;//ע��Ҫɾ��ԭ���� _id
				doc.name = reprint_to.name;
				doc.head = reprint_to.head;
				doc.time = time;
				doc.title = (doc.title.search(/[ת��]/) > -1) ? doc.title :"[post]"  + doc.title;
				doc.comments = [];
				doc.reprint_info = {"reprint_from": reprint_from};
				doc.pv = 0;
				collection.insert(doc,{safe:true},
						function(err,post){
							cb(err,collection,post[0]);
						});
			},
			function(collection,post,cb){
				collection.update({
				  "_id": reprint_from.postID
				}, {
				  $push: {
					"reprint_info.reprint_to": {
						"postID":post._id,
						"name": post.name,
						"day": post.time.day,
						"title": post.title
				  }}
				},
				function(err){
					cb(err,post);
				});
			}
			],
			function(err,post){
				pool.release(mongodb);
				callback(err,post);
				});
});
>>>>>>> prod
};

