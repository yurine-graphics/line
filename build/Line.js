var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var colors = ['4A90E2', 'C374DE', 'F36342', 'F3A642', '93C93F', '50E3C2'];

function getColor(option, i) {
  var idx = i % colors.length;
  var color = option.colors[idx] || colors[idx];
  if(color.indexOf(0) != '#' && color.charAt(0) != 'r') {
    color = '#' + color;
  }
  return color;
}

function getCtrol(x0, y0, x1, y1, x2, y2, x3, y3) {
  var a = 0.25;
  var b = 0.25;
  return [
    x1 + (x2 - x0) * a, y1 + (y2 - y0) * a,
    x2 - (x3 - x1) * b, y2 - (y3 - y1) * b
  ];
}


  function Line(dom, data, option) {
    this.dom = util.isString(dom) ? document.querySelector(dom) : dom;
    if(!this.dom || !this.dom.getContext) {
      return;
    }
    this.data = data || [];
    this.option = option || {};
    this.option.colors = this.option.colors || [];
    this.render();
  }

  Line.prototype.render = function() {
    var context = this.dom.getContext('2d');
    context.strokeStyle = '#000';
    context.lineWidth = 5;
    var width = this.option.width || 300;
    var height = this.option.height || 150;
    var padding = this.option.padding || [10, 10, 10, 10];
    if(Array.isArray(padding)) {
      switch(padding.length) {
        case 0:
          padding = [10, 10, 10, 10];
          break;
        case 1:
          padding[3] = padding[2] = padding[1] = padding[0];
          break;
        case 2:
          padding[3] = padding[1];
          padding[2] = padding[0];
          break;
        case 3:
          padding[3] = padding[1];
          break;
      }
    }
    else {
      padding = [padding, padding, padding, padding];
    }
    var paddingX = padding[1] + padding[3];
    var paddingY = padding[0] + padding[2];
    var min = Math.min(width - paddingX, height - paddingY);
    var lineWidth = this.option.lineWidth || 2;
    if(lineWidth < 1) {
      lineWidth = 1;
    }
    else if(lineWidth > min >> 2) {
      lineWidth = min >> 2;
    }

    this.renderBg(context, padding, width, height);
    //this.renderFg(context, lineWidth);
  }
  Line.prototype.renderBg = function(context, padding, width, height) {
    var lineHeight;var fontSize;var fontWeight;var fontFamily;var fontVariant;var fontStyle;var self = this;
    var font = self.option.font || 'normal normal normal 12px/1.5 Arial';
    !function(){var _1= util.calFont(font);fontStyle=_1["fontStyle"];fontVariant=_1["fontVariant"];fontFamily=_1["fontFamily"];fontWeight=_1["fontWeight"];fontSize=_1["fontSize"];lineHeight=_1["lineHeight"]}();

    context.textBaseline = 'top';

    if(self.option.fontSize) {
      fontSize = parseInt(self.option.fontSize) || 12;
    }
    fontSize = Math.max(fontSize, 12);

    if(self.option.lineHeight) {
      lineHeight = self.option.lineHeight;
      if(util.isString(lineHeight)) {
        if(/[a-z]$/i.test(lineHeight)) {
          lineHeight = parseInt(lineHeight);
        }
        else {
          lineHeight *= fontSize;
        }
      }
      else {
        lineHeight *= fontSize;
      }
    }
    else {
      lineHeight = fontSize * 1.5;
    }
    lineHeight = Math.max(lineHeight, fontSize);

    font = fontStyle + ' ' + fontVariant + ' ' + fontWeight + ' ' + fontSize + 'px/' + lineHeight + 'px ' + fontFamily;
    context.font = font;

    var color = self.option.color || '#000';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }

    var xNum = parseInt(this.option.xNum) || this.data.length;
    if(xNum < 1) {
      xNum = 1;
    }
    else if(xNum > this.data.length) {
      xNum = this.data.length;
    }
    var yNum = parseInt(this.option.yNum) || Math.floor((height - padding[0] - padding[2] - lineHeight * 2 - 20) / lineHeight * 2);
    if(yNum < 1) {
      yNum = 1;
    }
    else if(yNum > this.data.length) {
      yNum = this.data.length;
    }

    var count = 0;
    var max = parseFloat(self.data[0][1]) || 0;
    var min = parseFloat(self.data[0][1]) || 0;
    var minAbs = Math.abs(min);
    self.data.forEach(function(item) {
      var v = parseFloat(item[1]) || 0;
      max = Math.max(max, v);
      min = Math.min(min, v);
    });
    self.data.forEach(function(item) {
      var v = parseFloat(item[1]) || 0;
      //所有均加|min|，防止负数干扰方差计算
      count += v + minAbs;
    });
    var yBar = count / self.data.length;
    var yDev = 0;
    self.data.forEach(function(item) {
      var v = parseFloat(item[1]) || 0;
      yDev += Math.pow(v + minAbs - yBar, 2);
    });
    count -= minAbs * self.data.length;
    yBar -= minAbs;

    var self = this;
    var color = self.option.color || '#000';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    context.fillStyle = color;
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(0, 0, 0, 0.2)';

    var left = self.renderY(context, padding, width, height, yNum, lineHeight, max, min, fontSize);
    self.renderX(context, padding, width, height, xNum, lineHeight, left);
  }
  Line.prototype.renderY = function(context, padding, width, height, yNum, lineHeight, max, min, fontSize) {
    var step = height - padding[0] - padding[2] - lineHeight * 2 - 10;
    step /= yNum - 1;
    var diff;
    if(max >= 0 && min >= 0 || max < 0 && min < 0) {
      diff = Math.abs(max - min) / (yNum - 1);
    }
    else {
      diff = Math.abs(max + min) / (yNum - 1);
    }

    var left = 0;
    var x = padding[3];

    for(var i = 0; i < yNum; i++) {
      var y = height - step * i - padding[2] - lineHeight * 2;
      var v = String((min + i * diff).toFixed(2));
      v = v.replace(/\.00$/, '');
      left = Math.max(left, context.measureText(v).width);
      context.fillText(v, x, y);
    }
    left += 10;
    for(var i = 0; i < yNum; i++) {
      var y = height - step * i - padding[2] - lineHeight * 2 + (fontSize >> 1);
      context.beginPath();
      context.moveTo(x + left, y);
      context.lineTo(width - padding[1], y);
      context.stroke();
    }

    return left;
  }
  Line.prototype.renderYItem = function(item, i, context, padding, height, lineHeight, step) {
    var x = padding[3];
    var y = height - step * i - padding[2] - lineHeight;
    context.fillText(item[1], x, y);
  }
  Line.prototype.renderX = function(context, padding, width, height, xNum, lineHeight, left) {
    var self = this;
    var offsetX1 = context.measureText(self.data[0][0]).width >> 1;
    var offsetX2 = context.measureText(self.data[self.data.length - 1][0]).width >> 1;
    var step = width - padding[1] - padding[3] - offsetX1 - offsetX2 - left;
    step /= (xNum - 1);

    self.data.forEach(function(item, i) {
      var x = left + i * step + padding[3] + offsetX1;
      self.renderXItem(item, context, padding, height, lineHeight, x);
      context.beginPath();
      context.moveTo(x, padding[0]);
      context.lineTo(x, height - padding[2] - lineHeight - 10);
      context.stroke();
    });
  }
  Line.prototype.renderXItem = function(item, context, padding, height, lineHeight, x) {
    var txt = item[0];
    var w = context.measureText(txt).width;
    context.fillText(txt, x - (w >> 1), height - lineHeight - padding[2]);
    return w;
  }
  Line.prototype.renderFg = function(context, lineWidth) {
  }


exports["default"]=Line;
