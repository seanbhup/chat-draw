// console.log("Albus Dumbledore")

var http = require("http");
var fs = require("fs");


var server = http.createServer((req, res)=>{
    console.log("Someone connected via HTTP");
    fs.readFile("index.html", "utf-8", (error, fileData)=>{
        if(error){

            res.writeHead(500, {"content-type":"text/html"});
            res.end(error);
        }else{

            res.writeHead(200,{"content-type":"text/html"});
            res.end(fileData);
        }
    });
});

// Include the server version of socketIO and assignt it to a variable
var socketIo = require("socket.io");
// Sockets are going to listen to the server which is listening on port 8008
var io = socketIo.listen(server);

var socketUsers = [];

io.sockets.on("connect", (socket)=>{
    console.log("Someone connected by Socket")
    socketUsers.push({
        socketID: socket.id,
        name: "A girl has no name"
    });
    io.sockets.emit("users", socketUsers);

    socket.on("messageToServer", (messageObject)=>{
        console.log("Someone sent a message. It is",messageObject.message)
        io.sockets.emit("messageToClient",{
            message: messageObject.message,
            date: new Date()
        })
    })

});

server.listen(8080);
console.log("Listening on port 8080...");
