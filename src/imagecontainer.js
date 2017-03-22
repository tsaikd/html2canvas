function ImageContainer(src, cors, options) {
    this.src = src;
    this.image = new Image();
    var self = this;
    this.tainted = null;
    this.promise = new Promise(function(resolve, reject) {
        self.image.onload = resolve;
        self.image.onerror = reject;
        if (cors) {
            if (options && typeof(options.imageCrossOriginHandler) === "function") {
                self.image.crossOrigin = options.imageCrossOriginHandler(src);
            } else {
                self.image.crossOrigin = "anonymous";
            }
        }
        self.image.src = src;
        if (self.image.complete === true) {
            resolve(self.image);
        }
    });
}

module.exports = ImageContainer;
