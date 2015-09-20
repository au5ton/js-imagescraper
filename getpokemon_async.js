/*

getdata.js
Retreives and saves the sprite images of Pokemon from http://pokeapi.co/

Uses recursion to work with async stuff

*/

var request = require('request');
var fs = require('fs');
var http = require('http');

var host = 'http://pokeapi.co';
var api = '/api/v1/';
var req = host+api;
var maxPokemon = 717; //The last pokemon was 718
//var i;

var spriteReceivedCount = 0;
var spriteData = [];
var spritesToRetry = [];
var spritesDone = [null];

// process.on('uncaughtException', function (err) {
//     console.error(err.stack);
// });

function getSpriteInfo() {
    for(i = 1; i < maxPokemon; i++) {
        console.log('Getting sprite image URL... (sprite/'+i+'/)');
        function recursion() {
            http.get(req+'sprite/'+i+'/',function(response){
                var requestedPath = response.client._httpMessage.path;
                console.log(requestedPath);
                var requestedPathArray = requestedPath.split('/').slice(1,requestedPath.split('/').length-1);
                var data = '';
                response.on('data', function (chunk) {
                    data += chunk;
                });
                response.on('end', function () {
                    if(response.statusCode.toString().charAt(0)==='5') {
                        spritesToRetry.push(requestedPath);
                        console.log('TRYING AGAIN ('+requestedPath+')');
                        recursion();
                        return;
                    }
                    try {
                        data = JSON.parse(data);
                        console.log('Done with Pokemon '+data.pokemon.name+' ('+data.image+').');
                        request(host+url).pipe(fs.createWriteStream('data/pokemon_'+id+'.png'));
                    }
                    catch(err) {
                        console.log(err);
                        console.log(data);
                    }
                });
                response.on('error', function(err) {
                    console.log('TRYING AGAIN ('+requestedPath+')');
                    recursion();
                    return;
                })
            });
        }
        recursion();
    }
}

function getSpriteBinary(url,id) {

    //request(host+url).pipe(fs.createWriteStream('data/pokemon_'+id+'.png'));

    function recursion() {
        http.get(host+url,function(response){
            console.log('Sending GET request for binary file ('+url+')...');
            var requestedPath = response.client._httpMessage.path;
            var requestedPathArray = requestedPath.split('/').slice(1,requestedPath.split('/').length-1);
            var data = '';
            response.setEncoding('binary');
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                if(response.statusCode.toString().charAt(0)==='5') {
                    console.log('TRYING AGAIN ('+requestedPath+')');
                    recursion();
                    return;
                }
                console.log('Done.');
                console.log('Saving file to disk: data/pokemon_'+id+'.png');
                fs.writeFile('data/pokemon_'+id+'.png', data, 'binary', function (err) {
                    if (err) throw err;
                    console.log('Saved! (data/pokemon_'+id+'.png)');
                });
            });
            response.on('error', function(err) {
                console.log(err);
                recursion();
                return;
            })
        });
    }
    recursion();
}

console.log('Making data folder.');
fs.mkdir('data_async', function() {
    for(var i = 1; i < maxPokemon; i++) {
        spritesDone.push(0);
        setTimeout(function(){
            request(req+'sprite/'+i+'/', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    spritesDone[body.id] = 1;
                    console.log(body.image);
                    request(host+body.image)
                    .on('error', function(err){
                        //
                    })
                    .pipe(fs.createWriteStream('data/pokemon_'+body.id+'.png'));
                }
                else {
                    if(response) {
                        console.log(response.statusCode);
                    }
                    else {
                        console.log(response);
                    }
                }
            })
        }, timeout);
        timeout += 1000;
    }
});

// var timeout = 0;
// for(var i = 1; i < maxPokemon; i++) {
//     var old_i = i;
//     setTimeout(function(){
//         console.log('Getting sprite image URL... (sprite/'+old_i+'/)');
//         request.get(req+'sprite/'+old_i+'/', {timeout: 1500})
//         .on('error', function(err) {
//             //console.log(err);
//             console.log(err.code);
//             console.log(err.connect);
//         })
//         .on('response', function(response){
//             console.log(response.statusCode);
//             console.log(response.client._httpMessage.path);
//         });
//     }, timeout);
//     timeout += 1000;
// }

// var timeout = 0;
// for (var index in results) {
//     username = results[index].username;
//     setTimeout(function() {
//         requestinfo(username);
//     }, timeout );
//     timeout += 5000;
// }


// http://pokeapi.co/api/v1/pokedex/1/
/*http.get('http://pokeapi.co/api/v1/pokedex/1/',function(response){
var data = '';
response.on('data', function (chunk) {
data += chunk;
});
response.on('end', function () {
//
});
response.on('error', function(err) {
//
})
});*/


// for(;;) {
//     console.log(spriteReceivedCount);
//     if(spriteReceivedCount >= 718) {
//         process.exit();
//     }
// }

// fs.mkdir('data', function() {
//     console.log('Data folder created.');
//         console.log('Getting sprite image URL... (sprite/'+i+'/)');
//         http.get(req+'sprite/'+i+'/',function(response){
//             var data = '';
//             response.on('data', function (chunk) {
//                 data += chunk;
//             });
//             response.on('end', function () {
//                 data = JSON.parse(data);
//                 console.log('Done: '+data.image);
//                 http.get(host+data.image,function(response){
//                     console.log('Sending GET request for binary file...')
//                     var data = '';
//                     response.setEncoding('binary');
//                     response.on('data', function (chunk) {
//                         data += chunk;
//                     });
//                     response.on('end', function () {
//                         console.log('Done.');
//                         console.log('Saving file to disk: data/pokemon_'+i+'.png');
//                         fs.writeFile('data/pokemon_'+i+'.png', data, 'binary', function (err) {
//                             if (err) throw err;
//                             console.log('It\'s saved!\n');
//                         });
//                     });
//                 });
//             });
//         });
// });
