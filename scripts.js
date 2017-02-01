// !!!!!!!!!!!!!!!WEBSOCKET SECTION!!!!!!!!!!!!!!!
// var socketio = io.connect("http://10.150.50.81:8081/");
var socketio = io.connect("http://localhost:8081/");

// socketio.on("users", (socketUsers)=>{
//     console.log(socketUsers);
//     var newHTML = "";
//     socketUsers.map((currSocket, index)=>{
//         newHTML += "<li class=user>" + currSocket.name + "</li>";
//     });
//     document.getElementById("userNames").innerHTML = newHTML;
// });

socketio.on("messageToClient",(messageObject)=>{
    document.getElementById("userChats").innerHTML += "<div class='message'>" + messageObject.message + " -- " + messageObject.date + "</div>";
});

// !!!!!!!!!!!!!!!CLIENT FUNCTIONS!!!!!!!!!!!!!!!
function sendChatMessage(){
    event.preventDefault();
    var messageToSend = document.getElementById("chat-message").value;
    socketio.emit("messageToServer", {
        message: messageToSend,

    });
    document.getElementById("chat-message").value = "";
}

// !!!!!!!!!!!!!!!CANVAS SECTION!!!!!!!!!!!!!!!
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Set up base options
var color = "black";
var thickness = 10;
var mouseDown = false;
var mousePosition = {};
var lastMousePosition = null;
var colorPicker = document.getElementById('color-picker');
var thicknessPicker = document.getElementById("thickness");
var placeBase = document.getElementById("placeBase");

colorPicker.addEventListener('change', (event)=>{
    color = colorPicker.value;
})

thicknessPicker.addEventListener('change', (event)=>{
    thickness = thicknessPicker.value
})

placeBase.addEventListener("onkeydown", (event)=>{
    placeBase = "<img src='https://www.base64-image.de/build/img/mr-base64-482fa1f767.png' />"
})

canvas.addEventListener("mousedown", (event)=>{
    // console.log(event);
    mouseDown = true;
})

canvas.addEventListener("mouseup", (event)=>{
    // console.log(event);
    mouseDown = false;
})

canvas.addEventListener("mousemove", (event)=>{
    // console.log(event);
    if(mouseDown){
        var magicBrushX = event.pageX - canvas.offsetLeft;
        var magicBrushY = event.pageY - canvas.offsetTop;
        mousePosition = {
            x: magicBrushX,
            y: magicBrushY
        }
        console.log(mousePosition);
        if(lastMousePosition !== null){
            context.strokeStyle = color;
            // context.lineJoin = "bevel";
            context.lineCap = "round";
            context.lineWidth = thickness;
            context.beginPath();
            // context.moveTo(lastMousePosition.x, lastMousePosition.y);
            context.lineTo(mousePosition.x, mousePosition.y);
            context.closePath();
            context.stroke();
        }else{
            context.closePath();
        }

        var drawingDataForServer = {
            mousePosition: mousePosition,
            lastMousePosition: lastMousePosition,
            color: color,
            thickness: thickness
        }


        lastMousePosition = {
            x: mousePosition.x,
            y: mousePosition.y
        }


        socketio.emit("drawingToServer", drawingDataForServer);

        socketio.on("drawingToClients", (drawingData)=>{
            context.strokeStyle = drawingData.color;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.lineWidth = drawingData.thickness;
            context.beginPath();
            context.moveTo(drawingData.lastMousePosition.x, drawingData.lastMousePosition.y);
            context.lineTo(drawingData.mousePosition.x, drawingData.mousePosition.y);
            context.stroke();
            context.closePath();
        });
    }

})
