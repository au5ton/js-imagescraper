/*

getpokemon_async.js
Retreives and saves the sprite images of Pokemon from http://pokeapi.co/

Uses glorius asynchronous javascript

*/

var startTime = new Date();

var request = require('request');
var fs = require('fs');
var http = require('http');

var hostname = 'pokeapi.co'
var host = 'http://pokeapi.co';
var api = '/api/v1/';
var req = host+api;
var req2 = hostname+api;
var maxPokemon = 718; //The last pokemon is 718
var printCount = 1;
var limit;
function print(str) {
    console.log('['+printCount+']: ', str);
    printCount++;
}

console.log(process.argv);
if(process.argv[2] === 'max') {
    limit = maxPokemon;
}
else if(!isNaN(parseInt(process.argv[2])) && typeof parseInt(process.argv[2]) === 'number'){
    limit = process.argv[2];
}
else {
    console.log('Please specify a limit. Ex: max, 42, 564');
    process.exit();
}

process.on('exit', function() {
    console.log('Finished operation in: '+((new Date() - startTime)/1000)+' seconds.');
});

console.log('Making data folder.');
fs.mkdir('data_async', function() {
    console.log('Made data_async folder.');
    for(var i = 1; i <= limit; i++) {

        //Thanks: http://bit.ly/1NEv9Ck

        function tryUntilSuccess(options, callback) {
            var req = http.request(options, function(res) {
                var data = '';
                var result;

                if(options.encoding) {
                    res.setEncoding(options.encoding);
                }
                else {
                    options.encoding = 'utf-8';
                }

                res.on('data', function(msg) {
                    data += msg;
                });
                res.on('end', function() {
                    try {
                        if(options.encoding === 'utf-8') {
                            result = JSON.parse(data);
                        }
                        else {
                            result = data;
                        }
                        if(options.savedFilePath) {
                            fs.writeFile(options.savedFilePath, result, 'binary', function (err) {
                                if (err) throw err;
                                console.log(options.savedFilePath+' saved!');
                                callback(null, result);
                            });
                        }
                        callback(null, result);
                    }
                    catch(err) {
                        console.log('trying again: ', err);
                        tryUntilSuccess(options, callback);
                    }
                });
            });
            req.end();

            req.on('error', function(e) {
                console.log('trying again: ', e);
                tryUntilSuccess(options, callback);
            });
        }

        // Use the standard callback pattern of err in first param, success in second
        tryUntilSuccess({
            host: hostname,
            path: api+'sprite/'+i+'/'
        },
        function(err, res) {
            if(err) throw err;
            print('id: '+res.id+', img: '+hostname+res.image);
            tryUntilSuccess({
                host: hostname,
                path: res.image,
                encoding: 'binary',
                savedFilePath: 'data_async/pokemon_'+res.id+'.png'
            },
            function(err, res) {
                //
            });
        });
    }
});
