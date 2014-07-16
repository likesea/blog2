var express = require('express');
var favicon = require('serve-favicon');

var app = express();
//app.use(favicon('\public/favicon.ico'));
app.get('/',function(req,res){
	res.write("hello");
});
// Add your routes here, etc.

app.listen(3000);
console.log('./public/favicon.ico');