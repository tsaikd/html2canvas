var SVGContainer = require('./SvgContainer');
var Promise = require('../promise');
var fabric = require('../../vendor/fabric').fabric;

function SVGNodeContainer(node, _native) {
    this.src = node;
    this.image = null;
    var self = this;

    this.promise = _native ? new Promise(function(resolve, reject) {
        self.image = new Image();
        self.image.onload = resolve;
        self.image.onerror = reject;
        self.image.src = "data:image/svg+xml," + (new XMLSerializer()).serializeToString(node);
        if (self.image.complete === true) {
            resolve(self.image);
        }
    }) : new Promise(function(resolve) {
        fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
    });
}

SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);

module.exports = SVGNodeContainer;
