function position() {
	this.x = 0;
	this.y = 0;
}

$(document).ready(function() {
	$("#page_11").bind("mousemove", function() {
		console.log(this.x);
	});
});

function getSessionData(key) {
	if(typeof(sessionStorage) != "undefined") {
		return sessionStorage.getItem(key);
	}
	return null;
}

function hasSessionData(key) {
	if(typeof(sessionStorage) != "undefined") {
		return sessionStorage.getItem(key) != null;
	}
	return false;
}

function addSessionData(key, value) {
	if(typeof(sessionStorage) != "undefined") {
		sessionStorage.setItem(key, value);
	}
}

function delSessionData(key) {
	if(typeof(sessionStorage) != "undefined") {
		sessionStorage.removeItem(key);
	}
}