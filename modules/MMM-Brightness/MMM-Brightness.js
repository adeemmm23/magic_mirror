Module.register("MMM-Brightness", {
	defaults: {
	  brightness: 0.5, // Default brightness value
	},

	getStyles: function () {
		return ["MMM-Brightness.css"];
	  },

	start: function () {
	  console.log("Starting module: " + this.name);
	  this.setBrightness();
	},
  
	setBrightness: function () {
	  var wrapper = this.wrapperEl;
	  if (!wrapper) {
		wrapper = document.createElement("div");
		wrapper.className = "content-fill";
		this.wrapperEl = wrapper;
		this.updateDom();
	  }
  
	  // Get brightness value from configuration
	  var brightness = this.config.brightness;
  
	  // Update module's DOM with opacity
	  wrapper.style.opacity = Math.abs(brightness - 1.0);
	},
  
	getDom: function () {
	  return this.wrapperEl;
	},
  });