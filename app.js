require('dotenv').config();
const fs = require('fs')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var dataProcess,
 htmlFile,
 initMap,
 liquidFillGauge;
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

fs.readFile('./js/liquidFillGauge.js', function(err, data) {
    if (err){
        throw err;
    }
    liquidFillGauge = data;
});

fs.readFile('./index.html', function(err, data) {
    if (err){
        throw err;
    }
    htmlFile = data;
});

var server = require('http').createServer(function (request, response) {
    switch (request.url) {
        case "/js/dataProcess.js" :
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.write(dataProcess);
            break;
        case "/js/initMap.js" :
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.write(initMap);
            break;
        case "/js/liquidFillGauge.js" :
            response.writeHead(200, {"Content-Type": "text/javascript"});
            response.write(liquidFillGauge);
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
    await setTimeout(function() {
        getJSON(process.env.DATA_URL, function(responseText, status) {
            data = responseText;
            io.sockets.emit('receive_data', data);
        });
    }, delayInMilliseconds);
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

server.listen(3000, function(){
    console.log("Listening on port 3000");
})