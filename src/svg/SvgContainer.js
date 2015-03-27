var Promise = require('../promise');
var XHR = require('../xhr');
var decode64 = require('../utils').decode64;
var SVGParser = require('./SVGParser.js');

function SVGContainer(src) {
  this.src = src;
  this.image = document.createElement('canvas');
  var self = this;

  this.promise = (self.isInline(src) ? Promise.resolve(self.inlineFormatting(src)) : XHR(src))
    .then(function(svg) {
      return new Promise(function(resolve) {
        SVGParser.parse(this.image, svg, {
          renderCallback: resolve
        });
      });
    });
}

SVGContainer.prototype.inlineFormatting = function(src) {
  return (/^data:image\/svg\+xml;base64,/.test(src)) ? this.decode64(this.removeContentType(src)) : this.removeContentType(src);
};

SVGContainer.prototype.removeContentType = function(src) {
  return src.replace(/^data:image\/svg\+xml(;base64)?,/, '');
};

SVGContainer.prototype.isInline = function(src) {
  return (/^data:image\/svg\+xml/i.test(src));
};

SVGContainer.prototype.decode64 = function(str) {
  return (typeof(window.atob) === "function") ? window.atob(str) : decode64(str);
};

module.exports = SVGContainer;
