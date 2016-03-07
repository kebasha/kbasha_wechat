var express = require('express');
var router = express.Router();
var request = require('request');
var wechat = require('wechat');

function getBlog(res){
    request('http://kbasha.com/titles.txt',function(err, response, body){
        var data = body.replace(/[\r\n]/g,',');
        var arr = data.split(',');
        var resStr = "[";
        for(var i=0;i<arr.length;i++){
            var blogArr = arr[i].split('|');
            var url = encodeURI('http://kbasha.com/index.html?title='+blogArr[0]);
            if(resStr.length == 1){
              resStr += '{"title": "'+blogArr[0]+'","description": "这是女神与高富帅之间的对话","picurl": "http://kbasha.com/images/'+blogArr[1]+'","url": "'+url+'"}';
            }else{
              resStr += ',{"title": "'+blogArr[0]+'","description": "这是女神与高富帅之间的对话","picurl": "http://kbasha.com/images/'+blogArr[1]+'","url": "'+url+'"}';
            }
        }

        resStr += "]";
        //console.log(resStr);
        res.reply(JSON.parse(resStr));
    });
}

function getEventDes(message, res){
    if(message.EventKey == 'WEB'){
        res.reply('敬请期待!');
    }
    if(message.EventKey == 'phone'){
        res.reply('敬请期待!');
    }
    if(message.EventKey == 'db'){
        res.reply('敬请期待!');
    }
    if(message.EventKey == 'bigdata'){
        res.reply('敬请期待!');
    }
    if(message.EventKey == 'other'){
        res.reply('敬请期待!');
    }
    if(message.EventKey == 'random'){
        res.reply('敬请期待!');
    }
}

function getRandom(){
    
}

router.use("/",wechat('kbasha').text(function(message,req,res,next){
    var info = message.Content;
    if(info == 'kbasha_菜单'){
       res.reply('创建菜单成功');r
    }else if(info == 'kbasha_推送'){
       res.reply('推送消息成功');
    }else{
        getBlog(res);
    }
}).image(function(message,req,res,next){
    getBlog(res);
}).voice(function(message,req,res,next){
    getBlog(res);
}).video(function(message,req,res,next){
    getBlog(res);
}).location(function(message,req,res,next){
    getBlog(res);
}).link(function(message,req,res,next){
    getBlog(res);
}).event(function(message,req,res,next){
    getEventDes(message,res);
}).device_text(function(message,req,res,next){
    getBlog(res);
}).device_event(function(message,req,res,next){
    getBlog(res);
}).middlewarify());

module.exports = router;
