var express = require('express');
var request = require('request');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var WechatAPI = require('wechat-api');

var later = require('later');
//var textSched = later.parse.text('at 11:30am every weekday');
var textSched = later.parse.text('every 1 min');
//later.date.localTime();
//var timer = later.setInterval(sendAllMsg, textSched);

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//var wechat = require('wechat');
var kbasha = require('./routes/kbasha');

app.use('/kbasha', kbasha);
//app.use("/wx",wechat('kbasha',function(req,res,next){
//    var info = req.weixin;
//    res.reply('hehe');
//}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function sendAllMsg(){
  request('http://kbasha.com/titles.txt',function(err, response, body){
      var data = body.replace(/[\r\n]/g,',');
      var arr = data.split(',');
      for(var i=0;i<arr.length;i++){
        var url = 'http://kbasha.com/titles-'+arr[i]+'.txt';
        request(url,function(err, response, blog){
          var blogData = blog.replace(/[\r\n]/g,',');
          var blogArr = blogData.split(',');

        });
      } 
      
  });
  /*var api = new WechatAPI('wx6c0f04f5e82e70c3', 'd4624c36b6795d1d99dcf0547af5443d');
  console.log('this is start...');
  api.massSendText('主动推送功能,测试成功!', true, function(err, result){
    console.log(err);
    console.log(result);
  });*/
}


module.exports = app;
