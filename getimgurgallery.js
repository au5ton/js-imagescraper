//https://api.imgur.com/3/gallery/hot/viral/1?showViral=true

// var username = 'Test';
// var password = '123';
// var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
//
// // auth is: 'Basic VGVzdDoxMjM='
//
// var header = {'Host': 'www.example.com', 'Authorization': auth};
// var request = client.request('GET', '/', header);
//ceebca2b962f5a4

var request = require('request');
var http = require('http');
var https = require('https');
var fs = require('fs');

request({
    url: 'https://api.imgur.com/3/gallery/hot/viral/1?showViral=true',
    headers: {
        Authorization: 'Client-ID ceebca2b962f5a4'
    }
}, function(err, response, body) {
    if(err) throw err;
    fs.writeFile('data.json',body,function(err){
        if (err) throw err;
    })
});
