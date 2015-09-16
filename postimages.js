
var request = require('request');
var fs = require('fs');
var querystring = require('querystring');
var http = require('http');
//PHPSESSID=vgog47s9ebocvfo9me4ko8si86
var j = request.jar();
var cookie = request.cookie('PHPSESSID=vgog47s9ebocvfo9me4ko8si86');
var url = 'http://108.197.28.233';
j.setCookie(cookie, url);

request = request.defaults({jar: true});
//Post URL

// fs.createReadStream('data/pokemon_1.png').pipe(
//     request.post('http://service.com/upload', {
//         form: {
//             key: 'value'
//         }
//     })
// );

//var image = "";
//fs.readFile(__dirname + '/data/pokemon_4.png', 'binary', function(err,data){
//if(err) throw err;
var formData = {
    // Pass a simple key-value pair
    //my_field: 'my_value',
    // Pass data via Buffers
    //my_buffer: new Buffer([1, 2, 3]),
    // Pass data via Streams
    //imgfile: fs.createReadStream(__dirname + '/data/pokemon_1.png')
    //imgfile: data
    // Pass multiple values /w an Array
    /*attachments: [
    fs.createReadStream(__dirname + '/attachment1.jpg'),
    fs.createReadStream(__dirname + '/attachment2.jpg')
],*/
// Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
// Use case: for some types of streams, you'll need to provide "file"-related information manually.
// See the `form-data` README for more information about options: https://github.com/felixge/node-form-data
imgfile: {
    value:  fs.createReadStream(__dirname + '/data/pokemon_4.png'),
    options: {
        filename: 'pokemon_4.png',
        contentType: 'file'
    }
}
};
request.post({url:'http://108.197.28.233/imageboard.php', formData: formData, jar: j}, function optionalCallback(err, httpResponse, body) {
    if (err) {
        return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
});
//});
