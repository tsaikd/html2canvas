var ProxyURL = require('./proxy').ProxyURL;

function ProxyImageContainer(src, proxy, options) {
    var link = document.createElement("a");
    link.href = src;
    src = link.href;
    this.src = src;
    this.image = new Image();
    var self = this;
    this.promise = new Promise(function(resolve, reject) {
        if (options && typeof(options.imageCrossOriginHandler) === "function") {
            self.image.crossOrigin = options.imageCrossOriginHandler(src);
        } else {
            self.image.crossOrigin = "anonymous";
        }
        self.image.onload = resolve;
        self.image.onerror = reject;

        new ProxyURL(src, proxy, document, options).then(function(url) {
            self.image.src = url;
        })['catch'](reject);
    });
}

module.exports = ProxyImageContainer;
