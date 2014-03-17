var canvas;
var context;
var canvasWidth;
var canvasHeight;
var x = 0;
var y = 0;
$(document).ready(function() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	setInterval(draw, 100);
	AddEventHandlers();
	x = 176;
	y = 22;
});

function draw() {
	context.save();
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = "#f00";
	context.fillRect(0, 0, canvasWidth, canvasHeight);
//	x += 10;
//	y += 10;

	var w = canvasWidth;
	var h = canvasHeight;
	var gx = (x + w) / 2;
	var gy = (y + h) / 2;
	var em = (h - gy) * (h - gy) / (w - gx);
	var ex = gx - em;
	var ey = h;
	var gh = (w - gx) * (w - gx) / (h - gy);
	var hy = gy - gh;
	var hx = w;

	context.fillStyle = "#00f";
	context.beginPath();
	context.moveTo(0, 0);
    if (hy > 0) {
    	context.lineTo(w, 0);
    }
    context.lineTo(hx, hy);
    context.lineTo(ex, ey);
    context.lineTo(0, h);

	context.closePath();

	context.clip();
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = "#0f0";
	context.beginPath();
	context.moveTo(x,y);
	context.lineTo(hx, hy);
    context.lineTo(ex, ey);
	context.closePath();
	context.clip();
	context.fillRect(0, 0, canvasWidth, canvasHeight);
	context.restore();
}

//添加事件
function AddEventHandlers(){
	//鼠标移动事件
	$("#canvas").mousemove(function(e) {
	 	x = e.pageX ;
	    y = e.pageY  ;
	});

	//鼠标点击事件
	$("#canvas").click(function(e) {
			x = e.pageX ;
			y = e.pageY  ;
			// 检测xy是否符合规范  x*x+y*y<w*w
		}
	);
}