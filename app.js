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

function genReq(i, url){
  return function(err, response, blog){
    console.log(url);
    var blogData = blog.replace(/[\r\n]/g,',');
    var blogArr = blogData.split(',');
    titleArr[i] = blogArr.length;
    console.log('更新数组记录成功!'+blogArr.length+'and'+titleArr[i]);
  }
}

var sendTxt = "";
function genSend(i, url){
  return function(err, response, blog){
    var blogData = blog.replace(/[\r\n]/g,',');
    var blogArr = blogData.split(',');

    if(titleArr[i] < blogArr.length){
      var url = encodeURI('http://kbasha.com/' + blogArr[0].split('|')[1] + '/index'+blogArr[0].split('|')[0]+'.html');
      var title = blogArr[0].split('|')[1];
      //sendTxt += 'http://kbasha.com/' + blogArr[0].split('|')[1] + '/index'+blogArr[0].split('|')[0]+'.html';
      var api = new WechatAPI('wx6b6bb6ad02270694', '29519328b7a59509f15e4108915621f5');
      api.uploadMaterial('./public/images/kbasha_id.jpg', 'thumb', function(err, result){
          console.log('uploadMaterial'+err);
          console.log('uploadMaterial'+result);
          if(sendTxt == ''){
              sendTxt += '{"thumb_media_id":"'+result.media_id+'","author":"kbasha","title":"'+title+'","content_source_url":"'+url+'","content":"content","digest":"digest","show_cover_pic":"1"}';
          }else{
              sendTxt += ',{"thumb_media_id":"'+result.media_id+'","author":"kbasha","title":"'+title+'","content_source_url":"'+url+'","content":"content","digest":"digest","show_cover_pic":"1"}';
          }
      });
    }
    console.log('titleArr[i]:'+titleArr[i]);
    console.log('blogData.length:'+blogArr.length);
    console.log('pullMsg:'+sendTxt);
  }
}

function genForEach(arr){
    for(var i=0;i<arr.length;i++){
      var urlTi = arr[i].split('|');
      var url = encodeURI('http://kbasha.com/titles-'+urlTi[0]+'.txt');
      request(url,genSend(i, url));
    }
}

function pullTxtMsg(){
    console.log('pullToMsg:'+sendTxt);
    var api = new WechatAPI('wx6b6bb6ad02270694', '29519328b7a59509f15e4108915621f5');
    /*api.uploadMaterial('/imamges/kbasha_id.jpg', 'thumb', function(err, result){
        var news = JSON.parse('{"articles": ['+sendTxt+']}');
        api.uploadNews(news, function(err, result){
          api.massSendNews(result.media_id, true, function(err, result){
            console.log(err);
            console.log(result);
          });
        });
    });*/

  if(sendTxt != ''){
      var news = JSON.parse('{"articles": ['+sendTxt+']}');
      api.uploadNews(news, function(err, result){
          api.massSendNews(result.media_id, true, function(err, result){
              if(result.errcode == 0){
                console.log('推送成功!');
              }else{
                console.log('推送失败!-'+result.errcode);
              }
          });
      });
      /*api.massSendText(sendTxt, true, function(err, result){
        console.log(err);
        console.log(result);
        if(result.errcode == 0){
          console.log('推送成功!');
        }else{
          console.log('推送失败!-'+result.errcode);
        }
      });*/
  }
}

var async = require('async');
var titleArr = new Array();
function sendAllMsg(){
  pullTxtMsg();
  request('http://kbasha.com/titles.txt',function(err, response, body){
      var data = body.replace(/[\r\n]/g,',');
      var arr = data.split(',');
      console.log('111>'+arr);
      if(titleArr == ''){
        for(var i=0;i<arr.length;i++){
          var urlTi = arr[i].split('|');
          var url = encodeURI('http://kbasha.com/titles-'+urlTi[0]+'.txt');
          request(url,genReq(i,url));
        }
      }else{
        for(var i=0;i<arr.length;i++){
          var urlTi = arr[i].split('|');
          var url = encodeURI('http://kbasha.com/titles-'+urlTi[0]+'.txt');
          request(url,genSend(i, url));
        }
        
        /*setTimeout(function(){
          pullTxtMsg();
        },10000);*/
      }
  });
}


module.exports = app;
