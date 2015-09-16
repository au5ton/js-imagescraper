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
var maxPokemon = 718; //It's really 718, but for safety let's just do 717
var i = 1;

console.log('Making data folder.')
fs.mkdir('data', function() {
    console.log('Data folder created.');
    function recursive(){
        console.log('Getting sprite image URL... (sprite/'+i+'/)');
        http.get(req+'sprite/'+i+'/',function(response){
            var data = '';
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                data = JSON.parse(data);
                console.log('Done: '+data.image);
                http.get(host+data.image,function(response){
                    console.log('Sending GET request for binary file...')
                    var data = '';
                    response.setEncoding('binary');
                    response.on('data', function (chunk) {
                        data += chunk;
                    });
                    response.on('end', function () {
                        console.log('Done.');
                        console.log('Saving file to disk: data/pokemon_'+i+'.png');
                        fs.writeFile('data/pokemon_'+i+'.png', data, 'binary', function (err) {
                            if (err) throw err;
                            console.log('It\'s saved!\n');
                            if(i < maxPokemon) {
                                i++;
                                recursive();
                            }
                        });
                    });
                });
            });
        });
    }
    recursive();
});
