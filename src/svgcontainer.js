var Promise = require('./promise');
var XHR = require('./xhr');
var decode64 = require('./utils').decode64;
var fabric = require('../vendor/fabric').fabric;

function SVGContainer(src) {
    this.src = src;
    this.image = null;
    var self = this;

    this.promise = (self.isInline(src) ? Promise.resolve(self.inlineFormatting(src)) : XHR(src))
        .then(function(svg) {
            return new Promise(function(resolve) {
                fabric.loadSVGFromString(svg, self.createCanvas.call(self, resolve));
            });
        });
}

SVGContainer.prototype.inlineFormatting = function(src) {
    return (/^data:image\/svg\+xml;base64,/.test(src)) ? this.decode64(this.removeContentType(src)) : this.removeContentType(src);
};

SVGContainer.prototype.removeContentType = function(src) {
    return src.replace(/^data:image\/svg\+xml(;base64)?,/,'');
};

SVGContainer.prototype.isInline = function(src) {
    return (/^data:image\/svg\+xml/i.test(src));
};

SVGContainer.prototype.createCanvas = function(resolve) {
    var self = this;
    return function (objects, options) {
        var canvas = new fabric.StaticCanvas('c');
        self.image = canvas.lowerCanvasEl;
        canvas
            .setWidth(options.width)
            .setHeight(options.height)
            .add(fabric.util.groupSVGElements(objects, options))
            .renderAll();
        resolve(canvas.lowerCanvasEl);
    };
};

SVGContainer.prototype.decode64 = function(str) {
    return (typeof(window.atob) === "function") ? window.atob(str) : decode64(str);
};

module.exports = SVGContainer;
