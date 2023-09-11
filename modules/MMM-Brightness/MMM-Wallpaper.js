Module.register("MMM-Wallpaper", {
	defaults: {
	  source: "blue",
	},

	getStyles: function () {
		return ["MMM-Wallpaper.css"];
	  },

	start: function () {
	  console.log("Starting module: " + this.name);
	  this.setWallpaper();
	},
  
	setWallpaper: function () {
	  var wrapper = this.wrapperEl;
	  if (!wrapper) {
		wrapper = document.createElement("div");
		wrapper.className = "content-fill";
		this.wrapperEl = wrapper;
		this.updateDom();
	  }
  
	  // Get brightness value from configuration
	  var background = this.config.source;
  
	  // Update module's DOM with opacity
	  wrapper.style.background = background;
	},
  
	getDom: function () {
	  return this.wrapperEl;
	},
  });