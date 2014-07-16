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
  //´ò¿ªÊı¾İ¿â
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
  //æ‰“å¼€æ•°æ®åº“
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //è¯»å– posts é›†åˆ
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      var query = {};
      if (name) {
        query.name = name;
      }
      //ä½¿ç”¨ count è¿”å›ç‰¹å®šæŸ¥è¯¢çš„æ–‡æ¡£æ•° total
      collection.count(query, function (err, total) {
        //æ ¹æ® query å¯¹è±¡æŸ¥è¯¢ï¼Œå¹¶è·³è¿‡å‰ (page-1)*10 ä¸ªç»“æœï¼Œè¿”å›ä¹‹åçš„ 10 ä¸ªç»“æœ
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
          //è§£æ markdown ä¸º html
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

//·µ»ØÔ­Ê¼·¢±íÎÄÕÂµÄÄÚÈİ£¨markdown¸ñÊ½£©
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

//¸üĞÂÒ»ÆªÎÄÕÂ¼°ÆäÏà¹ØĞÅÏ¢
Post.update = function(_id, post, callback) {
<<<<<<< HEAD
  //æ‰“å¼€æ•°æ®åº“
  	mongodb.connect(settings.url, function (err, db) {
=======
  //´ò¿ªÊı¾İ¿â
  pool.acquire(function (err, mongodb) {
  	mongodb.open(function (err, db) {
>>>>>>> prod
    	if (err) {
      		return callback(err);
    	}
    //¶ÁÈ¡ posts ¼¯ºÏ
    	db.collection('posts', function (err, collection) {
      		if (err) {
<<<<<<< HEAD
        		db.close();
=======
        		pool.release(mongodb);
>>>>>>> prod
        		return callback(err);
      		}
      //¸üĞÂÎÄÕÂÄÚÈİ
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
//É¾³ıÒ»ÆªÎÄÕÂ
Post.remove = function(_id, callback) {
<<<<<<< HEAD
  //æ‰“å¼€æ•°æ®åº“
  mongodb.connect(settings.url, function (err, db) {
=======
  //´ò¿ªÊı¾İ¿â
  pool.acquire(function (err, mongodb) {
  mongodb.open(function (err, db) {
>>>>>>> prod
    if (err) {
      return callback(err);
    }
    //¶ÁÈ¡ posts ¼¯ºÏ
    db.collection('posts', function (err, collection) {
      if (err) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        return callback(err);
      }
      //²éÑ¯ÒªÉ¾³ıµÄÎÄµµ
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
        //Èç¹ûÓĞ reprint_from£¬¼´¸ÃÎÄÕÂÊÇ×ªÔØÀ´µÄ£¬ÏÈ±£´æÏÂÀ´ reprint_from
        var reprint_from = "";
        if (doc.reprint_info.reprint_from) {
          reprint_from = doc.reprint_info.reprint_from;
        }
        if (reprint_from != "") {
          //¸üĞÂÔ­ÎÄÕÂËùÔÚÎÄµµµÄ reprint_to
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

        //É¾³ı×ªÔØÀ´µÄÎÄÕÂËùÔÚµÄÎÄµµ
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
//·µ»ØËùÓĞÎÄÕÂ´æµµĞÅÏ¢
Post.getArchive = function(callback) {
<<<<<<< HEAD
  //æ‰“å¼€æ•°æ®åº“
  mongodb.connect(settings.url, function (err, db) {
=======
  //´ò¿ªÊı¾İ¿â
  pool.acquire(function (err, mongodb) {
  mongodb.open(function (err, db) {
>>>>>>> prod
    if (err) {
      return callback(err);
    }
    //¶ÁÈ¡ posts ¼¯ºÏ
    db.collection('posts', function (err, collection) {
      if (err) {
<<<<<<< HEAD
        db.close();
=======
        pool.release(mongodb);
>>>>>>> prod
        return callback(err);
      }
      //·µ»ØÖ»°üº¬ name¡¢time¡¢title ÊôĞÔµÄÎÄµµ×é³ÉµÄ´æµµÊı×é
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
      //²éÑ¯ËùÓĞ tags Êı×éÄÚ°üº¬ tag µÄÎÄµµ
      //²¢·µ»ØÖ»º¬ÓĞ name¡¢time¡¢title ×é³ÉµÄÊı×é
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
      //æ‰¾åˆ°è¢«è½¬è½½çš„æ–‡ç« çš„åŸæ–‡æ¡£
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

        delete doc._id;//æ³¨æ„è¦åˆ æ‰åŸæ¥çš„ _id

        doc.name = reprint_to.name;
        doc.head = reprint_to.head;
        doc.time = time;
        doc.title = (doc.title.search(/[è½¬è½½]/) > -1) ? doc.title : "[è½¬è½½]" + doc.title;
        doc.comments = [];
        doc.reprint_info = {"reprint_from": reprint_from};
        doc.pv = 0;
 //å°†è½¬è½½ç”Ÿæˆçš„å‰¯æœ¬ä¿®æ”¹åå­˜å…¥æ•°æ®åº“ï¼Œå¹¶è¿”å›å­˜å‚¨åçš„æ–‡æ¡£
        collection.insert(doc, {
          safe: true
        }, function (err, post) {
          if (err) {
            return callback(err);
          }
		//æ›´æ–°è¢«è½¬è½½çš„åŸæ–‡æ¡£çš„ reprint_info å†…çš„ reprint_to
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
		  //ä¹‹å‰æœªè€ƒè™‘å¼‚æ­¥è€Œå°†å…³é—­æ•°æ®åº“æ”¾åœ¨è¿™é‡Œï¼Œ
		  //è¿™å°†ä¼šå¯¼è‡´updateçš„å›è°ƒå‡½æ•°æŠ›å‡ºerré”™è¯¯
         // db.close();
		  //è€ƒè™‘å¼‚æ­¥è°ƒç”¨ï¼Œä¸é€‚åˆæ”¾åœ¨è¿™é‡Œ
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
				delete doc._id;//×¢ÒâÒªÉ¾µôÔ­À´µÄ _id
				doc.name = reprint_to.name;
				doc.head = reprint_to.head;
				doc.time = time;
				doc.title = (doc.title.search(/[×ªÔØ]/) > -1) ? doc.title :"[post]"  + doc.title;
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

