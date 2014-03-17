//全局变量
var pianoButtonArray = [];
var canvas;
var context;//画布
var screenWidth;//画布宽度
var screenHeight;//画布高度
var radius = 10;
var x = 0;
var y = 0;
var left = 0
var top = 0;
var audio;
var dou = 100;
var ra = 200;
var mi = 300;
var fa = 400;
var backgroundImage = new Image();//背景图
var buttonImage = new Image();//钢琴按键
//var yellowButtonImage = new Image();
var speed = 2;//速度
var horizontalSpeed = speed;//水平速度
var verticalSpeed = speed;//垂直速度
var pianoButtonNum = 10;
var pianoButtonSize = 1;
var count = 1;

function $(id) {
	return document.getElementById(id);
}

function getCanvas() {
	return document.querySelector("canvas");
}

//公用 定义一个游戏物体对象
function GameObject() {
	this.x = 0;
	this.y = 0;
	this.image = null;
	this.length = 1;
}

//定义钢琴按键
function PianoButton() {
	this.buttonType = "green";
}
PianoButton.prototype = new GameObject();//游戏对象GameObject

function LoadImages() {

}

function AddEventHandlers() {

}

function init() {
	self.moveTo(0,0);
	self.resizeTo(screen.availWidth,screen.availHeight);
	//onwebkitfullscreenchange webkitRequestFullScreen
	//document.body.webkitRequestFullScreen();
	window.onorientationchange = orientationChange;
	if(window.innerWidth < window.innerHeight) {
		window.location.href = "./view.html";
	}
	AddEventHandlers();
	LoadImages();
	canvas = $("piano");
	canvas.addEventListener("touchstart", touchStart, false);
	canvas.addEventListener("touchend", touchEnd, false);
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	context = canvas.getContext("2d");
	buttonImage.src = "images/lvse.png";
	//yellowButtonImage.src = "images/yellow.png";
	var pianoButton = new PianoButton();
	x = 10;
	y = 10;
	//初始化钢琴按键
	pianoButton.x = x;
	pianoButton.y = y;
	pianoButton.image = buttonImage;
	pianoButtonArray[0] = pianoButton;
	console.log("screenWidth:" + screenWidth);
	console.log("screenHeight:" + screenHeight);
	context.drawImage(pianoButton.image, pianoButton.x, pianoButton.y);
}

function drawCanvas() {
	init();
	audio = new Audio();
	audio.src = "sound/61.mp3";
	setInterval(gameLoop, 1000);
}

function viewChange() {
	if(window.innerWidth > window.innerHeight) {
		window.location.href = "./index.html";
	}
	window.onorientationchange = viewChangeOrientationChange;
}

function orientationChange() {
	switch(window.orientation) {
　　case 0:
		window.location.href = "./view.html";
		//alert("0, screen-width: " + screen.width + "; screen-height:" + screen.height);
		break;
　　case -90:
		//alert("左旋 -90, screen-width: " + screen.width + "; screen-height:" + screen.height);
		break;
　　case 90:
		//alert("右旋 90, screen-width: " + screen.width + "; screen-height:" + screen.height);
		break;
　　case 180:
		window.location.href = "./view.html";
	　　//alert("风景模式 180, screen-width: " + screen.width + "; screen-height:" + screen.height);
	　	break;
	}
}

function viewChangeOrientationChange() {
	switch(window.orientation) {
　　case 0:
		//alert("0, screen-width: " + screen.width + "; screen-height:" + screen.height);
		break;
　　case -90:
		window.location.href = "./index.html";
		//alert("左旋 -90, screen-width: " + screen.width + "; screen-height:" + screen.height);
		break;
　　case 90:
		window.location.href = "./index.html";
		//alert("右旋 90, screen-width: " + screen.width + "; screen-height:" + screen.height);
		break;
　　case 180:
	　　//alert("风景模式 180, screen-width: " + screen.width + "; screen-height:" + screen.height);
	　	break;
	}
}

function drawRect() {
	canvas = $("piano");
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	context = canvas.getContext("2d");
	x = 10;
	y = 10;
	gradient = context.createRadialGradient(x,
		y, 0, x, y, radius);
	gradient.addColorStop(0, "#33CC66");
	gradient.addColorStop(1, "#000000");
	context.fillStyle = gradient;
	context.fillRect(0, 0, 20, 20);
	/*context.moveTo(100, 0);
	gradient = context.createRadialGradient(100,
		10, 0, 100, 10, radius);
	gradient.addColorStop(0, "#33CC66");
	gradient.addColorStop(1, "#000000");
	context.fillStyle = gradient;
	context.fillRect(90, 0, 20, 20);*/
	audio = new Audio();
	audio.src = "sound/61.mp3";
	setInterval(drawRectLoop, 1000);
}

function drawArc() {
	canvas = $("piano");
	screenWidth = canvas.width;
	screenHeight = canvas.height;
	context = canvas.getContext("2d");
	x = 10;
	y = 10;
	gradient = context.createRadialGradient(x,
		y, 0, x, y, radius);
	gradient.addColorStop(0, "#33CC66");
	gradient.addColorStop(1, "#000000");
	context.fillStyle = gradient;
	context.arc(10, 10, 10, 0, Math.PI * 2, false);
	context.fill();
	/*context.moveTo(100, 0);
	gradient = context.createRadialGradient(100,
		10, 0, 100, 10, radius);
	gradient.addColorStop(0, "#33CC66");
	gradient.addColorStop(1, "#000000");
	context.fillStyle = gradient;
	context.arc(100, 10, 10, 0, Math.PI * 2, false);
	context.fill();*/
	audio = new Audio();
	audio.src = "sound/61.mp3";
	setInterval(drawArcLoop, 1000);
}

function gameLoop() {
	if(pianoButtonArray[0].length == 1) {
		if(pianoButtonArray[0].y > 200)
			return;
	} else {
		for(var i = 0 ; i < pianoButtonArray[0].length ; i++) {
			if(pianoButtonArray[0][i].y > 200) {
				for(var j = 0 ; j < pianoButtonArray[0].length ; j++) {
					var yellowButtonImage = new Image();
					yellowButtonImage.src = "images/circle.png";
					pianoButtonArray[0][j].image = yellowButtonImage;
				}
				context.clearRect(0, 0, screenWidth, screenHeight);
				context.save();
				for(var j = 0 ; j < pianoButtonArray.length ; j++) {
					if(pianoButtonArray[j].buttonType == "green") {
						context.drawImage(pianoButtonArray[j].image, pianoButtonArray[j].x, pianoButtonArray[j].y);
					} else {
						for(var k = 0 ; k < pianoButtonArray[j].length ; k++) {
							context.drawImage(pianoButtonArray[j][k].image, pianoButtonArray[j][k].x, pianoButtonArray[j][k].y);
						}
					}
				}
				context.restore();
				return;
			}
		}
	}
	if(pianoButtonArray.length == 10)
		return;
	context.translate(0, 0);
	context.clearRect(0, 0, screenWidth, screenHeight);
	context.save();
	x = Math.random();
	x = x * 400;
	buttonImage.src = "images/lvse.png";
	var pianoButton = new PianoButton();
	pianoButton.image = buttonImage;
	pianoButton.x = x;
	pianoButton.y = 0;
	pianoButton.length = 1;
	pianoButtonArray[pianoButtonSize] = pianoButton;
	var rand = Math.random() * 10;
	if(rand >= 1 && rand <= 2) {
		rand = Math.round(Math.random() * 10);
		if(rand == 1)
			rand = 2;
		if(rand > 4)
			rand = 4;
		var buttonArray = [];
		for(var i = 0 ; i < rand ; i++) {
			x = Math.random();
			x = x * 400;
			var yellowButtonImage = new Image();
			yellowButtonImage.src = "images/yellow.png";
			var pianoButton = new PianoButton();
			pianoButton.buttonType = "yellow";
			pianoButton.image = yellowButtonImage;
			pianoButton.x = x;
			pianoButton.y = 0;
			buttonArray[i] = pianoButton;
		}
		pianoButtonArray[pianoButtonSize] = null;
		pianoButtonArray[pianoButtonSize] = buttonArray;
	}
	for(var i = 0 ; i < pianoButtonArray.length ; i++) {
		pianoButtonArray[i].y += 60;
		console.log(pianoButtonArray);
		if(pianoButtonArray[i].buttonType == "green") {
			context.drawImage(pianoButtonArray[i].image, pianoButtonArray[i].x, pianoButtonArray[i].y);
		} else {
			for(var j = 0 ; j < pianoButtonArray[i].length ; j++) {
				pianoButtonArray[i][j].y += 60;
				context.drawImage(pianoButtonArray[i][j].image, pianoButtonArray[i][j].x, pianoButtonArray[i][j].y);
			}
		}
	}
	context.restore();
	pianoButtonSize++;
}

function drawRectLoop() {
	context.translate(0, 0);
	context.clearRect(0, 0, screenWidth, screenHeight);
	context.save();
	//context.fillStyle = "#000000";
	//context.fillRect(0, 0, screenWidth, screenHeight);
	for(var i = 0 ; i < 4 ; i++) {
		x += 10;
		y += 6;
		context.moveTo(10, 0 + y);
		gradient = context.createRadialGradient(10 + x,
			10 + y, 0, 10 + x, 10 + y, radius);
		gradient.addColorStop(0, "#33CC66");
		gradient.addColorStop(1, "#000000");
		context.fillStyle = gradient;
		context.fillRect(x, y, 20, 20);
	}
	context.restore();
	if(x > 480)
		x = 10;
	if(y > 300)
		y = 10;
}

function drawArcLoop() {
	context.translate(0, 0);
	context.clearRect(0, 0, screenWidth, screenHeight);
	context.save();
	//context.fillStyle = "#000000";
	//context.fillRect(0, 0, screenWidth, screenHeight);
	for(var i = 0 ; i < 4 ; i++) {
		x += 10;
		y += 6;
		context.moveTo(10, 0 + y);
		gradient = context.createRadialGradient(10 + x,
			10 + y, 0, 10 + x, 10 + y, radius);
		gradient.addColorStop(0, "#33CC66");
		gradient.addColorStop(1, "#000000");
		context.fillStyle = gradient;
		context.arc(10, 10 + y, 10, 0, Math.PI * 2, false);
		context.fill();
	}
	context.restore();
	if(x > 480)
		x = 10;
	if(y > 300)
		y = 10;
}

function playAudio() {
	var audio = $("audio");
	audio.play();
}

function playPiano(obj, event) {
	if(pianoButtonArray[0].length >= 2)
		return;
	x = pianoButtonArray[0].x;
	y = pianoButtonArray[0].y;
	console.log("x:" + x + " y:" + y);
	console.log("event.x:" + event.x + " event.y:" + event.y);
	if(x > 0 && x <= 15) {
		audio.src = "sound/61.mp3";
	} else if(x > 15 && x <= 30) {
		audio.src = "sound/65.mp3";
	} else if(x > 45 && x <= 60) {
		audio.src = "sound/67.mp3";
	} else if(x > 60 && x <= 75) {
		audio.src = "sound/69.mp3";
	} else if(x > 75 && x <= 90) {
		audio.src = "sound/71.mp3";
	} else if(x > 90 && x <= 105) {
		audio.src = "sound/75.mp3";
	} else if(x > 105 && x <= 120) {
		audio.src = "sound/77.mp3";
	} else if(x > 120 && x <= 135) {
		audio.src = "sound/79.mp3";
	} else if(x > 135 && x <= 150) {
		audio.src = "sound/81.mp3";
	} else if(x > 150 && x <= 165) {
		audio.src = "sound/83.mp3";
	} else if(x > 165 && x <= 180) {
		audio.src = "sound/85.mp3";
	} else if(x > 180 && x <= 195) {
		audio.src = "sound/87.mp3";
	} else if(x > 195 && x <= 210) {
		audio.src = "sound/89.mp3";
	} else if(x > 210 && x <= 225) {
		audio.src = "sound/91.mp3";
	} else if(x > 225 && x <= 240) {
		audio.src = "sound/93.mp3";
	} else if(x > 240 && x <= 255) {
		audio.src = "sound/95.mp3";
	} else if(x > 255 && x <= 270) {
		audio.src = "sound/97.mp3";
	} else if(x > 270 && x <= 285) {
		audio.src = "sound/99.mp3";
	} else if(x > 285 && x <= 300) {
		audio.src = "sound/101.mp3";
	} else if(x > 300 && x <= 315) {
		audio.src = "sound/103.mp3";
	} else if(x > 315 && x <= 330) {
		audio.src = "sound/105.mp3";
	} else if(x > 330 && x <= 345) {
		audio.src = "sound/107.mp3";
	} else if(x > 345 && x <= 360) {
		audio.src = "sound/109.mp3";
	} else if(x > 360 && x <= 375) {
		audio.src = "sound/111.mp3";
	} else if(x > 375 && x <= 390) {
		audio.src = "sound/113.mp3";
	} else if(x > 390 && x <= 405) {
		audio.src = "sound/115.mp3";
	} else if(x > 405 && x <= 420) {
		audio.src = "sound/117.mp3";
	} else if(x > 420 && x <= 435) {
		audio.src = "sound/119.mp3";
	} else if(x > 435 && x <= 450) {
		audio.src = "sound/121.mp3";
	} else if(x > 450 && x <= 465) {
		audio.src = "sound/123.mp3";
	} else if(x > 465 && x <= 480) {
		audio.src = "sound/127.mp3";
	}
	console.log("audio.src=" + audio.src)
	if(x - 100 <= event.x && x + 100 >= event.x
		&& y - 100 <= event.y && y + 100 >= event.y) {
		console.log("audio.play()");
		audio.play();
		pianoButtonArray.shift();
		for(var i = 1 ; i < pianoButtonArray.lenght ; i++) {
			pianoButtonArray[i - 1] = pianoButtonArray[i];
		}
		context.clearRect(0, 0, screenWidth, screenHeight);
		context.save();
		for(var i = 0 ; i < pianoButtonArray.length ; i++) {
			if(pianoButtonArray[i].buttonType == "green") {
				context.drawImage(pianoButtonArray[i].image, pianoButtonArray[i].x, pianoButtonArray[i].y);
			} else {
				for(var j = 0 ; j < pianoButtonArray[i].length ; j++) {
					context.drawImage(pianoButtonArray[i][j].image, pianoButtonArray[i][j].x, pianoButtonArray[i][j].y);
				}
			}
		}
		context.restore();
		pianoButtonSize--;
	}
}

function touchStart(event) {
	if(pianoButtonArray[0].buttonType == "green")
		return;
	for(var i = 0 ; i < event.touches.length ; i++) {
		var touch = event.touches[i];
		if(x > 0 && x <= 15) {
			audio.src = "sound/61.mp3";
		} else if(x > 15 && x <= 30) {
			audio.src = "sound/65.mp3";
		} else if(x > 45 && x <= 60) {
			audio.src = "sound/67.mp3";
		} else if(x > 60 && x <= 75) {
			audio.src = "sound/69.mp3";
		} else if(x > 75 && x <= 90) {
			audio.src = "sound/71.mp3";
		} else if(x > 90 && x <= 105) {
			audio.src = "sound/75.mp3";
		} else if(x > 105 && x <= 120) {
			audio.src = "sound/77.mp3";
		} else if(x > 120 && x <= 135) {
			audio.src = "sound/79.mp3";
		} else if(x > 135 && x <= 150) {
			audio.src = "sound/81.mp3";
		} else if(x > 150 && x <= 165) {
			audio.src = "sound/83.mp3";
		} else if(x > 165 && x <= 180) {
			audio.src = "sound/85.mp3";
		} else if(x > 180 && x <= 195) {
			audio.src = "sound/87.mp3";
		} else if(x > 195 && x <= 210) {
			audio.src = "sound/89.mp3";
		} else if(x > 210 && x <= 225) {
			audio.src = "sound/91.mp3";
		} else if(x > 225 && x <= 240) {
			audio.src = "sound/93.mp3";
		} else if(x > 240 && x <= 255) {
			audio.src = "sound/95.mp3";
		} else if(x > 255 && x <= 270) {
			audio.src = "sound/97.mp3";
		} else if(x > 270 && x <= 285) {
			audio.src = "sound/99.mp3";
		} else if(x > 285 && x <= 300) {
			audio.src = "sound/101.mp3";
		} else if(x > 300 && x <= 315) {
			audio.src = "sound/103.mp3";
		} else if(x > 315 && x <= 330) {
			audio.src = "sound/105.mp3";
		} else if(x > 330 && x <= 345) {
			audio.src = "sound/107.mp3";
		} else if(x > 345 && x <= 360) {
			audio.src = "sound/109.mp3";
		} else if(x > 360 && x <= 375) {
			audio.src = "sound/111.mp3";
		} else if(x > 375 && x <= 390) {
			audio.src = "sound/113.mp3";
		} else if(x > 390 && x <= 405) {
			audio.src = "sound/115.mp3";
		} else if(x > 405 && x <= 420) {
			audio.src = "sound/117.mp3";
		} else if(x > 420 && x <= 435) {
			audio.src = "sound/119.mp3";
		} else if(x > 435 && x <= 450) {
			audio.src = "sound/121.mp3";
		} else if(x > 450 && x <= 465) {
			audio.src = "sound/123.mp3";
		} else if(x > 465 && x <= 480) {
			audio.src = "sound/127.mp3";
		}
		console.log("ontouchstart");
		for(var j = 0 ; j < pianoButtonArray[0].length ; j++) {
			x = pianoButtonArray[0][j].x;
			y = pianoButtonArray[0][j].y;
			if(x - 100 <= touch.pageX && x + 100 >= touch.pageX
				&& y - 100 <= touch.pageY && y + 100 >= touch.pageY) {
				console.log("audio.play()");
				audio.play();
			}
		}
	}
}

function touchEnd(event) {
	if(pianoButtonArray[0].buttonType == "green")
		return;
	console.log("ontouchend");
	console.log("event.touches.length:" + event.touches.length);
	for(var i = 0 ; i < event.touches.length ; i++) {
		var touch = event.touches[i];
		for(var j = 0 ; j < pianoButtonArray[0].length ; j++) {
			x = pianoButtonArray[0][j].x;
			y = pianoButtonArray[0][j].y;
			console.log("x:" + x + " y:" + y + " pageX:" + touch.pageX + " pageY:" + touch.pageY);
			if(x - 100 <= touch.pageX && x + 100 >= touch.pageX
				&& y - 100 <= touch.pageY && y + 100 >= touch.pageY) {
				console.log("update");
				if(j == 0) {
					pianoButtonArray[0].shift();
				} else {
					pianoButtonArray[0].splice(j, 1);
				}
				pianoButtonArray[0].splice(j, 1);
			}
		}
		var index = 0;
		for(var j = 0 ; j < pianoButtonArray[0].length ; j++) {
			if(pianoButtonArray[0][j]) {
				pianoButtonArray[0][index] = pianoButtonArray[0][j];
				index++;
			}
		}
		console.log("pianoButtonArray[0].length:" + pianoButtonArray[0].length);
		if(pianoButtonArray[0].length == 0) {
			pianoButtonArray.shift();
			for(var i = 1 ; i < pianoButtonArray.lenght ; i++) {
				pianoButtonArray[i - 1] = pianoButtonArray[i];
			}
			context.clearRect(0, 0, screenWidth, screenHeight);
			context.save();
			for(var i = 0 ; i < pianoButtonArray.length ; i++) {
				if(pianoButtonArray[i].buttonType == "green") {
					context.drawImage(pianoButtonArray[i].image, pianoButtonArray[i].x, pianoButtonArray[i].y);
				} else {
					for(var j = 0 ; j < pianoButtonArray[i].length ; j++) {
						context.drawImage(pianoButtonArray[i][j].image, pianoButtonArray[i][j].x, pianoButtonArray[i][j].y);
					}
				}
			}
			context.restore();
			pianoButtonSize--;
		}
	}
}