Module.register("MMM-Wallpaper", {
  defaults: {
    source: "/config/img/black.jpg",
	filter: "brightness(0.5)",
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
	  console.log(this.config.source)
      wrapper = document.createElement("div");
      wrapper.className = "content-fill";
      this.wrapperEl = wrapper;
      this.updateDom();
    }

    // Get wallpaper source from configuration
    var wallpaper = this.config.source;
	var filter = this.config.filter;

    // Update module's DOM with wallpaper
    wrapper.style.backgroundImage = "url('" + wallpaper + "')";
	wrapper.style.filter = filter;
  },

  getDom: function () {
    return this.wrapperEl;
  },
});