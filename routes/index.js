
/*
 * GET home page.
 */
var crypto = require('crypto'),//generate hash value to encrypt password
fs = require('fs'),
User = require('../models/user.js'),
Comment = require('../models/comment.js'),
Post = require('../models/post.js');
module.exports = function(app){
	app.get('/',function(req,res){
		var page = req.query.p? parseInt(req.query.p):1;
		Post.getTen(null, page, function(err,posts,total){
			if(err){
				posts=[];
			}
			res.render('index',{
				title:"主页",
				user:req.session.user,
				posts:posts,
				page:page,
				isFirstPage: (page - 1) == 0,
      			isLastPage: ((page - 1) * 10 + posts.length) == total,
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			});
		});
	});
	app.get('/reg',checkNotLogin);
	app.get('/reg',function  (req,res) {
		res.render('reg',{
			title:'注册',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});
	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		if(password_re != password){
			req.flash('error','两次输入密码不一致！');
			//res.write("err");
			console.log(password);
			return res.redirect('/reg');
		}
		var md5 =crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name:name,
			password:password,
			email:req.body.email
			});
		User.get(newUser.name,function(err,user){
			if(user){
				req.flash('error','用户已存在！');
				return res.redirect('/reg');
				}
				newUser.save(function(err,user){
				 if (err) {
					crypto.flash('error', err);
					 return res.redirect('/reg');  //注册失败返回主册页
					}
				req.session.user=user;
				req.flash('success','注册成功!');
				res.redirect('/');
			});
		});
	});
	app.get('/login',checkNotLogin);
	app.get('/login',function  (req,res) {
		res.render('login',{
			title:'登录',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});
	app.post('/login',checkNotLogin);
	app.post('/login', function(req,res){
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(req.body.name,function(err,user){
			if(!user){
				req.flash('error','用户不存在！');
				return res.redirect('/login');
			}
			if(user.password!=password){
				req.flash('error','密码错误！');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success','登录成功！');
			res.redirect('/');
		});	
	});
	app.get('/post',checkLogin);
	app.get('/post',function  (req,res) {
		res.render('post',{
			title:'发表',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});
	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
		var currentUser = req.session.user,
			tags = [req.body.tag1, req.body.tag2, req.body.tag3],
			post = new Post(currentUser.name,currentUser.head,req.body.title,tags,req.body.post);
		post.save(function  (err) {
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发布成功！');
			res.redirect('/');
			// body...
		});
	});
    app.get('/logout', checkLogin);
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','登出成功！');
		res.redirect('/');
	});
	app.get('/upload',checkLogin);
	app.get('/upload',function  (req,res) {
		res.render('upload',{
			title:"文件上传",
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
		// body...
	});
	app.post('/upload',checkLogin);
	app.post('/upload',function  (req,res) {
		for(var i in req.files){
			if(req.files[i].size==0){
				fs.unlinkSync(req.files[i].path);
				console.log('successfully removed an empty files!');
			}else{
				var target_path='./public/images/'+req.files[i].name;
				fs.renameSync(req.files[i].path, target_path);
      			console.log('Successfully renamed a file!');
			}
		}
		req.flash('success', '文件上传成功');
  		res.redirect('/upload');
		// body...
	});
	app.get('/u/:name', function (req, res) {
  	//检查用户是否存在
  		var page = req.query.p ? parseInt(req.query.p) : 1;
  		User.get(req.params.name, function (err, user) {
    	if (!user) {
      		req.flash('error', '用户不存在!'); 
      		return 
      		res.redirect('/');//用户不存在则跳转到主页
    		}
    	Post.getTen(user.name, page, function (err, posts, total) {
	      if (err) {
	        req.flash('error', err); 
	        return res.redirect('/');
	      } 
	      res.render('user', {
	        title: user.name,
	        posts: posts,
	        page: page,
	        isFirstPage: (page - 1) == 0,
	        isLastPage: ((page - 1) * 10 + posts.length) == total,
	        user: req.session.user,
	        success: req.flash('success').toString(),
	        error: req.flash('error').toString()
	      });
    	
    		});
  		}); 
	});
	//look for an article
	app.get('/p/:_id', function (req, res) {
	  Post.getOne(req.params._id, function (err, post) {
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect('/');
	    }
	    res.render('article', {
	      title: post.title,
	      post: post,
	      user: req.session.user,
	      success: req.flash('success').toString(),
	      error: req.flash('error').toString()
	    });
	  });
	});
	//post comments
	app.post('/p/:_id', function (req, res) {
	  var date = new Date(),
	      time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	var md5 = crypto.createHash('md5'),
		email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
		head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48"; 
	  var comment = {
	      name: req.body.name,
		  head:head,
	      email: req.body.email,
	      website: req.body.website,
	      time: time,
	      content: req.body.content
	  };
	  var newComment = new Comment(req.params._id, comment);
	  newComment.save(function (err) {
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect('back');
	    }
	    req.flash('success', '留言成功!');
	    res.redirect('back');
	  });
	});
	app.get('/edit/:_id', checkLogin);
	app.get('/edit/:_id', function (req, res) {
  		var currentUser = req.session.user;
  		Post.edit(req.params._id, function (err, post) {
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect('back');
	    }
	    res.render('edit', {
	      title: '编辑',
	      post: post,
	      user: req.session.user,
	      success: req.flash('success').toString(),
	      error: req.flash('error').toString()
    		});
  		});
	});
	app.post('/edit/:_id', checkLogin);
	app.post('/edit/:_id', function (req, res) {
	  Post.update(req.params._id,req.body.post, function (err) {
	    var url = '/p/' +  req.params._id;
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect(url);//出错！返回文章页
		}
	    req.flash('success', '修改成功!');
	    res.redirect(url);//成功！返回文章页
		}); 
	});
	app.get('/remove/:_id', checkLogin);
	app.get('/remove/:_id', function (req, res) {
	  var currentUser = req.session.user;
	  Post.remove(req.params._id, function (err) {
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect('back');
	    }
	    req.flash('success', '删除成功!');
	    res.redirect('/');
	  });
	});
	app.get('/reprint/:_id', checkLogin);
	app.get('/reprint/:_id', function (req, res) {
		  Post.edit(req.params._id, function (err, post) {
		    if (err) {
		      req.flash('error', err); 
		      return res.redirect(back);
		    }
		    var currentUser = req.session.user,
		        reprint_from = {postID:post._id,name: post.name, day: post.time.day, title: post.title},
		        reprint_to = {name: currentUser.name, head: currentUser.head};
		    Post.reprint(reprint_from, reprint_to, function (err, post) {
		      if (err) {
		        req.flash('error', err); 
		        return res.redirect('back');
		      }
		    var url = '/p/' + post._id;
		    req.flash('success', '转载成功!');
		      //跳转到转载后的文章页面
		      res.redirect(url);
		    });
		  });
		});
	app.get('/archive', function (req, res) {
	  Post.getArchive(function (err, posts) {
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect('/');
	    }
	    res.render('archive', {
	      title: '存档',
	      posts: posts,
	      user: req.session.user,
	      success: req.flash('success').toString(),
	      error: req.flash('error').toString()
	    });
	  });
	});
	app.get('/tags',function(req,res){
		Post.getTags(function(err,posts){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			res.render('tags',{
				title:'标签',
				posts:posts,
				user:req.session.user,
				success:req.flash('success').toString(),
				error:req.flash('error').toString()
			});
		});
	});
	app.get('/tags/:tag', function (req, res) {
	  Post.getTag(req.params.tag, function (err, posts) {
	    if (err) {
	      req.flash('error',err); 
	      return res.redirect('/');
	    }
	    res.render('tag', {
	      title: 'TAG:' + req.params.tag,
	      posts: posts,
	      user: req.session.user,
	      success: req.flash('success').toString(),
	      error: req.flash('error').toString()
	    });
	  });
	});
	app.get('/search', function (req, res) {
	  Post.search(req.query.keyword, function (err, posts) {
	    if (err) {
	      req.flash('error', err); 
	      return res.redirect('/');
	    }
	    res.render('search', {
	      title: "SEARCH:" + req.query.keyword,
	      posts: posts,
	      user: req.session.user,
	      success: req.flash('success').toString(),
	      error: req.flash('error').toString()
	    });
	  });
	});
	app.get('/links', function (req, res) {
	  res.render('links', {
	    title: '友情链接',
	    user: req.session.user,
	    success: req.flash('success').toString(),
	    error: req.flash('error').toString()
	  });
	});

	app.use(function (req, res) {
	  res.render("404");
	});
	function checkLogin(req, res, next) {
    	if (!req.session.user) {
      		req.flash('error', '未登录!'); 
      		res.redirect('/login');
    	}
    	next();
    }

    function checkNotLogin(req, res, next) {
    if (req.session.user) {
      	req.flash('error', '已登录!'); 
      	res.redirect('back');
    	}
    	next();
    }
};
