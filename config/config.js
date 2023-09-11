// Config file for MagicMirror²

function loadModules() {
	if (typeof module !== "undefined") {
		return require("./config.json");
	} else {
		try {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET", "http://localhost:8080/config/config.json", false);
			xmlhttp.send();
			if (xmlhttp.status === 200) {
				return JSON.parse(xmlhttp.responseText);
			} else {
				throw "Unexpected status code!";
			}
		} catch (e) {
			console.error(e);
			return {};
		}
	}
}

let config = {
	address: "localhost",
	port: 8080,
	basePath: "/",
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],
	useHttps: false,
	httpsPrivateKey: "",
	httpsCertificate: "",
	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"],
	timeFormat: 24,
	units: "metric",
	modules: loadModules()["modules"]
};

if (typeof module !== "undefined") {
	module.exports = config;
}
