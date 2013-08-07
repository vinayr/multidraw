var socket = io.connect('http://192.168.1.10:8080/');
//var socket = io.connect('http://drawtv.nodester.com');
socket.on('connect', onConnect); 

function onConnect(data)
{
   	//socket.on('message', onMessage);
   	socket.on('tv_drawStart', onDrawStart);
  	socket.on('tv_draw', onDraw);
  	socket.on('tv_drawEnd', onDrawEnd);
  	//socket.on('disconnect', onDisconnect);
}

function onMessage(msg)
{
	//console.log(msg);
}

$(document).ready(function () {
    doodle.init();
});


var doodle = {
    // Define some variables
    'drawing':          false,
    'linethickness':    1,
    'updating':         false,
    'saveID':           '#save',
    'newID':            '#new',
    'penID':            '#pen',
    'eraserID':         '#eraser',
    'colour':           '#000',
    'noticeID':         '#notification',
    'loaded_id':         false
    
};

doodle.init = function() {
	
    // Collect elements from the DOM and set-up the canvas
    doodle.canvas = $('#doodle_canvas')[0];
    doodle.context = doodle.canvas.getContext('2d');
    doodle.oldState = doodle.context.getImageData(0, 0, 320, 240);                     	 
}; 	

// Change the size of the brush
doodle.changeBrushSize = function(ev) {
    if (ev.keyCode === 219 && doodle.linethickness > 1) {
        doodle.linethickness -= 1;
        doodle.draw(ev);
    }
    
    if (ev.keyCode === 221 && doodle.linethickness < 1000) {
        doodle.linethickness += 1;
        doodle.draw(ev);
    }
}

function onDrawStart(data)
{    
    // Calculate the current mouse X, Y coordinates with canvas offset
    var x, y;
    x = data.x - $(doodle.canvas).offset().left;
    y = data.y - $(doodle.canvas).offset().top;
    doodle.drawing = true;
    doodle.context.lineWidth = doodle.linethickness;

    // Store the current x, y positions
    doodle.oldX = x;
    doodle.oldY = y;
}

function onDraw(data)
{
    // Calculate the current mouse X, Y coordinates with canvas offset
    var x, y;
    x = data.x - $(doodle.canvas).offset().left;
    y = data.y - $(doodle.canvas).offset().top;
    
    // If the mouse is down (drawing) then start drawing lines
    if(doodle.drawing) {
        doodle.context.putImageData(doodle.oldState, 0, 0);
        doodle.context.strokeStyle = doodle.colour;
        doodle.context.beginPath();
        doodle.context.moveTo(doodle.oldX, doodle.oldY);
        doodle.context.lineTo(x, y);
        doodle.context.closePath();
        doodle.context.stroke();
        doodle.oldState = doodle.context.getImageData(0, 0, 320, 240);
    } else {
    
        doodle.context.putImageData(doodle.oldState, 0, 0);
        
        doodle.context.beginPath();
        doodle.context.arc(x, y, doodle.linethickness, 0, 2 * Math.PI, false);
        
        doodle.context.lineWidth = 3;
        doodle.context.strokeStyle = '#fff';
        doodle.context.stroke();
     
        doodle.context.lineWidth = 1;
        doodle.context.strokeStyle = '#000';
        doodle.context.stroke();
    
    }
    
    // Store the current X, Y position
    doodle.oldX = x;
    doodle.oldY = y;    
    
};

function onDrawEnd(data)
{ 
    doodle.drawing = false;
}


