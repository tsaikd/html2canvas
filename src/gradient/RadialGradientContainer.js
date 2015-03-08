var GradientContainer = require('./GradientContainer');
var Color = require('../color');

function RadialGradientContainer(imageData) {
    GradientContainer.apply(this, arguments);
    this.type = this.TYPES.RADIAL;


}

RadialGradientContainer.prototype = Object.create(GradientContainer.prototype);

module.exports = RadialGradientContainer;
