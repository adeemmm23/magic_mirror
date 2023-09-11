// animation fade
setTimeout(function () {
	document.getElementById("animation").style.opacity = "1";
}, 2000);

// function to load txt file
function loadConfig() {
	var request = new XMLHttpRequest();
	request.open("GET", "/config/config.json", false);
	request.send(null);
	return request.responseText;
}

// path to config file
firstConfig = loadConfig();

// function to check if config file has changed
function check() {
	var response = loadConfig();
	if (response != firstConfig) {
		document.getElementById("animation").style.opacity = "0";
		setTimeout(() => {
			location.reload();
		}, 300);
	}
}

// check every second
setInterval(check, 1000);
