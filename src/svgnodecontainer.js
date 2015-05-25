var SVGContainer = require('./svgcontainer');
var Promise = require('./promise');

function SVGNodeContainer(node, _native, options) {
    this.src = node;
    this.image = null;
    var self = this;

    this.promise = _native ? new Promise(function(resolve, reject) {
        self.image = new Image();
        self.image.onload = resolve;
        self.image.onerror = reject;
        if (typeof(options.svgSerializer) === "function") {
            self.image.src = "data:image/svg+xml," + options.svgSerializer.call(this, node);
        } else {
            self.image.src = "data:image/svg+xml," + (new XMLSerializer()).serializeToString(node);
        }
        if (self.image.complete === true) {
            resolve(self.image);
        }
    }) : this.hasFabric().then(function() {
        return new Promise(function(resolve) {
            window.html2canvas.svg.fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
        });
    });
}

SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);

module.exports = SVGNodeContainer;
