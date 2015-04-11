var SVGContainer = require('./SVGContainer');
var Promise = require('../promise');
var SVGParser = require('./SVGParser.js');
var utils = require('../utils');

function SVGNodeContainer(node) {
  this.src = node;
  this.image = document.createElement('canvas');
  var self = this;

  this.getBounds = function(bounds) {
    bounds.left = bounds.left + this.bb.x1;
    bounds.right = bounds.left + this.bb.width;
    bounds.top = bounds.top + this.bb.y1;
    bounds.bottom = bounds.top + this.bb.height;
    bounds.width = this.bb.width;
    bounds.height = this.bb.height;

    return bounds;
  };

  this.promise = new Promise(function(resolve, reject) {
    SVGParser.parse(this.image, node, {
      renderCallback: function(obj) {
        this.bb = obj.bounds;
        resolve();
      }.bind(this)
    });
  }.bind(this));
}

SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);

module.exports = SVGNodeContainer;
