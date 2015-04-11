// base for both NodeParser and SVGParser to use.
function BoundingBox(x1, y1, x2, y2) {
  this.x1 = Number.NaN;
  this.y1 = Number.NaN;
  this.x2 = Number.NaN;
  this.y2 = Number.NaN;

  Object.defineProperty(this, 'x', {
    get: function() {
      return this.x1;
    }
  });

  Object.defineProperty(this, 'y', {
    get: function() {
      return this.y1;
    }
  });

  Object.defineProperty(this, 'width', {
    get: function() {
      return this.x2 - this.x1;
    }
  });

  Object.defineProperty(this, 'height', {
    get: function() {
      return this.y2 - this.y1;
    }
  });
}

module.exports = BoundingBox;
