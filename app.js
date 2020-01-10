require('dotenv').config();
const fs = require('fs')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var dataProcess,
 htmlFile,
 initMap,
 model,
 weight;
fs.readFile('./js/dataProcess.js', function(err, data) {
    if (err){
        throw err;
    }
    dataProcess = data;
});

fs.readFile('./js/initMap.js', function(err, data) {
    if (err){
        throw err;
    }
    initMap = data;
});

fs.readFile('./model.json', function(err, data) {
    if (err){
        throw err;
    }
    model = data;
});

fs.readFile('./weights.bin', function(err, data) {
    if (err){
        throw err;
    }
    weight = data;
});

fs.readFile('./index.html', function(err, data) {
    if (err){
        throw err;
    }
    htmlFile = data;
});

var server = require('http').createServer(function (request, response) {
    console.log(request.url);
    switch (request.url) {
        case "/js/dataProcess.js" :
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.write(dataProcess);
            break;
        case "/js/initMap.js" :
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.write(initMap);
            break;
        case "/model.json" :
            response.writeHead(200, {"Content-Type": "application/json"});
            response.write(model);
            break;
        case "/weights.bin" :
            response.writeHead(200, {"Content-Type": "application/octet-stream"});
            response.write(weight);
            break;
        default :    
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(htmlFile);
    }
    response.end();
});

const io = require('socket.io')(server);

var getJSON = async function(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    
    xhr.onload = async function() {
    
        var status = xhr.status;
        
        if (status == 200) {
            await callback(xhr.responseText, status);
        } else {
            await callback(null, status);
        }
    };
    
    xhr.send();
};

async function sendData(){
    var delayInMilliseconds = 10000; 
    var data;
    //await setTimeout(function() {
    getJSON(process.env.TRACK_DATA_URL, function(track_data, status) {
        getJSON(process.env.PM25_DATA_URL, function(pm25_data, status) {
            data = {'track_data': track_data, 'pm25_data': pm25_data};
            class Car {
                constructor(brand) {
                  this.carname = brand;
                }
                toString() {
                  return "receive_data";
                }
              }
            var car = new Car();
            io.sockets.emit('receive_data', data);
        });
    });
    //}, delayInMilliseconds);
};

io.on('connection', client => {
    console.log('user connected');
  
    client.on('disconnect', () => {
        console.log('user disconnected');
    })

    client.on('request_data', async function (data) {
        await sendData();
    })
})

server.listen(5500, function(){
    console.log("Listening on port 5500");
})