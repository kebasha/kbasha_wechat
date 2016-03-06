var express = require('express');
var request = require('request');


function getBlogTitles(){
    request('http://kbasha.com/titles.txt',function(err, response, body){
    var data = body.replace(/[\r\n]/g,',');
    var arr = data.split(',');
    var resStr = "[";
    for(var i=0;i<arr.length;i++){
        var blogArr = arr[i].split('|');
        var url = encodeURI('http://kbasha.com/index.html?title='+blogArr[0]);
        if(resStr.length == 1){
        //var url = encodeURI('http://kbasha.com/index.html?title='+blogArr[0]+"'");
          resStr += '{"title": "'+blogArr[0]+'","description": "这是女神与高富帅之间的对话","picurl": "http://kbasha.com/images/'+blogArr[1]+'","url": "'+url+'"}';
        }else{

          resStr += ',{"title": "'+blogArr[0]+'","description": "这是女神与高富帅之间的对话","picurl": "http://kbasha.com/images/'+blogArr[1]+'","url": "'+url+'"}';
        }
    }
    resStr += "]";
    console.log(resStr);
    return JSON.parse(resStr);
});
}



