var BoundingBox = require('./BoundingBox');

exports.smallImage = function smallImage() {
  return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
};

exports.bind = function(callback, context) {
  return function() {
    return callback.apply(context, arguments);
  };
};

exports.decode64 = require('base64-arraybuffer').decode;

exports.getBounds = function(node) {
  if(node.getBoundingClientRect) {
    var clientRect = node.getBoundingClientRect();
    var width = node.offsetWidth == null ? clientRect.width : node.offsetWidth;

    return new BoundingBox(clientRect.left,
                           clientRect.top,
                           clientRect.left + width,
                           clientRect.bottom || (clientRect.top + clientRect.height));
  }
  return new BoundingBox();
};

exports.offsetBounds = function(node) {
  var parent = node.offsetParent ? exports.offsetBounds(node.offsetParent) : {y: 0, x: 0};
  return new BoundingBox(node.offsetLeft + parent.x,
                         node.offsetTop + parent.y,
                         node.offsetLeft + parent.x + node.offsetWidth,
                         node.offsetTop + node.offsetHeight + parent.y);
};

exports.parseBackgrounds = function(backgroundImage) {
  var whitespace = ' \r\n\t',
    method, definition, prefix, prefix_i, block, results = [],
    mode = 0, numParen = 0, quote, args;
  var appendResult = function() {
    if(method) {
      if(definition.substr(0, 1) === '"') {
        definition = definition.substr(1, definition.length - 2);
      }
      if(definition) {
        args.push(definition);
      }
      if(method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1) + 1) > 0) {
        prefix = method.substr(0, prefix_i);
        method = method.substr(prefix_i);
      }
      results.push({
        prefix: prefix,
        method: method.toLowerCase(),
        value: block,
        args: args,
        image: null
      });
    }
    args = [];
    method = prefix = definition = block = '';
  };
  args = [];
  method = prefix = definition = block = '';
  backgroundImage.split("").forEach(function(c) {
    if(mode === 0 && whitespace.indexOf(c) > -1) {
      return;
    }
    switch(c) {
      case '"':
        if(!quote) {
          quote = c;
        } else if(quote === c) {
          quote = null;
        }
        break;
      case '(':
        if(quote) {
          break;
        } else if(mode === 0) {
          mode = 1;
          block += c;
          return;
        } else {
          numParen++;
        }
        break;
      case ')':
        if(quote) {
          break;
        } else if(mode === 1) {
          if(numParen === 0) {
            mode = 0;
            block += c;
            appendResult();
            return;
          } else {
            numParen--;
          }
        }
        break;

      case ',':
        if(quote) {
          break;
        } else if(mode === 0) {
          appendResult();
          return;
        } else if(mode === 1) {
          if(numParen === 0 && !method.match(/^url$/i)) {
            args.push(definition);
            definition = '';
            block += c;
            return;
          }
        }
        break;
    }

    block += c;
    if(mode === 0) {
      method += c;
    } else {
      definition += c;
    }
  });

  appendResult();
  return results;
};
