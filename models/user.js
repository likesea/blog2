var crypto = require('crypto');
<<<<<<< HEAD
var Db = require('mongodb').Db;
var settings = require('../settings');
var async = require('async');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name:'mongoPool',
    create: function(callback){
        var mongodb;
        Db.connect(settings.url,function(err,db){
            mongodb = db;
            callback(null,mongodb);
        })
    },
    destroy:function(mongodb){
        mongodb.close();
    },
    max:100,
    min:5,
    idleTimeoutMillis:30000,
=======
var Db = require('./db');
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
>>>>>>> prod
    log:true
});
function User(user){
	this.name = user.name;
	this.password=user.password;
	this.email = user.email;
};
module.exports = User;
User.prototype.save = function(callback){
	var md5 = crypto.createHash('md5'),
		email_MD5 =md5.update(this.email.toLowerCase()).digest('hex'),
		head = "http://www.gravatar.com/avatar/"+email_MD5+"?s=48";
	var user = {
		name:this.name,
		password:this.password,
		email:this.email,
		head:head
	};
<<<<<<< HEAD
pool.acquire(function (err, db) {
   // })
    async.waterfall([
        function(cb){
=======
    pool.acquire(function(err,mongodb){
    async.waterfall([
        function(cb){
            mongodb.open(function(err,db){
                cb(err,db);
            });
        },
        function(db,cb){
>>>>>>> prod
            db.collection('users',function(err,collection){
                cb(err,collection);
            });
        },
        function(collection,cb){
            collection.insert(user,{
                safe:true
            },function(err,user){
                cb(err,user);
            });
        }
        ],function(err,user){
<<<<<<< HEAD
            db.close();
            callback(err,user[0]);
        });
 });

};

User.get = function(name,callback){
    pool.acquire(function (err, db) {
    async.waterfall([
        function(cb){
=======
            pool.release(mongodb);
            callback(err,user[0]);
        });
});
};

User.get = function(name,callback){
     pool.acquire(function(err,mongodb){
    async.waterfall([
        function(cb){
            mongodb.open(function(err,db){
                cb(err,db);
            });
        },
        function(db,cb){
>>>>>>> prod
            db.collection('users',function(err,collection){
                cb(err,collection);
            });
        },
        function(collection,cb){
            collection.findOne({
                name:name
            },function(err,user){
                cb(err,user);
            });
        }
        ],function(err,user){
<<<<<<< HEAD
            db.close();
=======
            pool.release(mongodb);
>>>>>>> prod
            callback(err,user);
        });
});
};
 
