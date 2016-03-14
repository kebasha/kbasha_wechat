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
              resStr += '{"title": "'+blogArr[0]+'","description": "'+blogArr[0]+'","picurl": "http://kbasha.com/images/'+blogArr[1]+'","url": "'+url+'"}';
            }else{
              resStr += ',{"title": "'+blogArr[0]+'","description": "'+blogArr[0]+'","picurl": "http://kbasha.com/images/'+blogArr[1]+'","url": "'+url+'"}';
            }
        }

        resStr += "]";
        //console.log(resStr);
        res.reply(JSON.parse(resStr));
    });
}

function getEventDes(message, res){
    if(message.EventKey == 'WEB'){
        //res.reply('敬请期待!');
        getTitleRandom('WEB', res);
    }
    if(message.EventKey == 'phone'){
        getTitleRandom('移动端', res);
    }
    if(message.EventKey == 'db'){
        getTitleRandom('数据库', res);
    }
    if(message.EventKey == 'bigdata'){
        getTitleRandom('大数据', res);
    }
    if(message.EventKey == 'other'){
        getTitleRandom('其他', res);
    }
    if(message.EventKey == 'random'){
        //res.reply('敬请期待!');
        getRandom(res);
    }
}

function getTitleRandom(type, res){
    var url = encodeURI('http://kbasha.com/titles-'+type+'.txt');
    request(url,function(err, response, blog){
        var blogData = blog.replace(/[\r\n]/g,',');
        var blogArr = blogData.split(',');
        var numxt = Math.floor(Math.random()*blogArr.length+1);

        var str = blogArr[numxt-1].split('|');
        var title = str[1];
        var pic = encodeURI('http://kbasha.com/'+type+'/'+str[3]);
        var resStr = "[";
        var src = encodeURI('http://kbasha.com/'+type+'/index'+(blogArr.length-numxt+1)+'.html');
        console.log(pic);
        console.log(src);
        resStr += '{"title": "'+title+'","description": "'+title+'","picurl": "'+pic+'","url": "'+src+'"}';
        resStr += "]";
        res.reply(JSON.parse(resStr));
    });
}

function getRandom(res){
    request('http://kbasha.com/titles.txt',function(err, response, body){
        var data = body.replace(/[\r\n]/g,',');
        var arr = data.split(',');
        var num = Math.floor(Math.random()*arr.length+1);

            var urlTi = arr[num-1].split('|');
            var url = encodeURI('http://kbasha.com/titles-'+urlTi[0]+'.txt');
            request(url,function(err, response, blog){
                var blogData = blog.replace(/[\r\n]/g,',');
                var blogArr = blogData.split(',');
                var numxt = Math.floor(Math.random()*blogArr.length+1);

                var str = blogArr[numxt-1].split('|');
                var title = str[1];
                var pic = encodeURI('http://kbasha.com/'+urlTi[0]+'/'+str[3]);
                var resStr = "[";
                var src = encodeURI('http://kbasha.com/'+urlTi[0]+'/index'+(blogArr.length-numxt+1)+'.html');
                console.log(pic);
                console.log(src);
                
                      resStr += '{"title": "'+title+'","description": "'+title+'","picurl": "'+pic+'","url": "'+src+'"}';
            

                resStr += "]";
                res.reply(JSON.parse(resStr));
            });
      
    });
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
