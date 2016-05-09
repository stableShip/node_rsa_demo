'use strict'
var co = require("co");
var Promise = require("bluebird");
var fs = require("fs");
fs = Promise.promisifyAll(fs);
var path = require("path");
var ursa = require("ursa");

var getPrivateKey = function () {
    return co(function* (){
        var privateKey =yield fs.readFileAsync(path.join(__dirname, "./rsa_key/private.pem"));
        return privateKey;

    })
};

var getPublicKey = function () {
    return co(function* (){
        var publicKey = yield fs.readFileAsync(path.join(__dirname, "./rsa_key/public.pub"));
        return publicKey;
    })
};

co(function* (){
    var privateKey = yield getPrivateKey();
    var publicKey = yield getPublicKey();
    var key = ursa.createPrivateKey(privateKey);
    var crt = ursa.createPublicKey(publicKey);

    console.log('Encrypt with Public');
    var msg = crt.encrypt("Everything is going to be 200 OK", 'utf8', 'base64');
    console.log('encrypted', msg, '\n');

    console.log('Decrypt with Private');
    var msg = key.decrypt(msg, 'base64', 'utf8');
    console.log('decrypted', msg, '\n');

}).catch(function(err){
    console.log(err);
})

