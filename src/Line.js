import util from './util';

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

class Line {
  constructor(dom, data, option) {
    this.dom = util.isString(dom) ? document.querySelector(dom) : dom;
    if(!this.dom || !this.dom.getContext) {
      return;
    }
    this.data = data || {
        label: [],
        value: []
      };
    this.option = option || {};
    this.option.colors = this.option.colors || [];
    this.option.areaColors = this.option.areaColors || [];
    this.option.styles = this.option.styles || [];
    this.render();
  }

  render() {
    var self = this;
    var context = self.dom.getContext('2d');
    var width = self.option.width || 300;
    var height = self.option.height || 150;
    var padding = self.option.padding || [10, 10, 10, 10];
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
    var minSize = Math.min(width - paddingX, height - paddingY);

    var lineWidth = parseInt(self.option.lineWidth) || 1;
    lineWidth = Math.max(lineWidth, 1);
    lineWidth = Math.min(lineWidth, minSize >> 2);

    var gridWidth = parseInt(self.option.gridWidth) || 1;
    gridWidth = Math.max(gridWidth, 1);
    gridWidth = Math.min(gridWidth, minSize >> 2);

    var length = parseInt(self.data.label.length) || 0;
    for(var i = 0, len = self.data.length; i < len; i++) {
      if(self.data[i].length > length) {
        self.data[i] = self.data[i].slice(0, i);
      }
    }

    var max = parseFloat(self.data.value[0][1]) || 0;
    var min = parseFloat(self.data.value[0][1]) || 0;
    self.data.value.forEach(function(item) {
      item.forEach(function(item2) {
        var v = parseFloat(item2) || 0;
        max = Math.max(max, v);
        min = Math.min(min, v);
      });
    });
    if(self.option.max !== undefined && self.option.max !== null) {
      max = parseFloat(self.option.max);
    }
    if(self.option.min !== undefined && self.option.min !== null) {
      min = parseFloat(self.option.min);
    }
    if(max < min) {
      max = min;
    }

    var font = self.option.font || 'normal normal normal 12px/1.5 Arial';
    var { fontStyle, fontVariant, fontFamily, fontWeight, fontSize, lineHeight } = util.calFont(font);
    context.textBaseline = 'top';

    if(self.option.fontSize) {
      fontSize = parseInt(self.option.fontSize) || 12;
    }

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

    var xNum = parseInt(self.option.xNum) || self.data.label.length;
    if(xNum < 1) {
      xNum = 1;
    }
    else if(xNum > self.data.label.length) {
      xNum = self.data.label.length;
    }
    var yNum = parseInt(self.option.yNum) || Math.floor((height - padding[0] - padding[2] - lineHeight * 2 - 20) / lineHeight);
    if(yNum < 1) {
      yNum = 1;
    }
    else if(yNum > self.data.value[0].length) {
      yNum = self.data.value[0].length;
    }

    var stepV = Math.abs(max - min) / (yNum - 1);

    var [left, bottom, stepX, stepY] = self.renderBg(context, padding, width, height, gridWidth, min, lineHeight, fontSize, xNum, yNum, stepV);
    self.renderFg(context, height, lineHeight, lineWidth, left, bottom, stepX, stepY, stepV, min);
  }
  renderBg(context, padding, width, height, gridWidth, min, lineHeight, fontSize, xNum, yNum, stepV) {
    var color = this.option.color || '#000';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    var gridColor = this.option.gridColor || 'rgba(0, 0, 0, 0.2)';
    if(gridColor.charAt(0) != '#' && gridColor.charAt(0) != 'r') {
      gridColor = '#' + gridColor;
    }
    context.fillStyle = color;
    context.lineWidth = gridWidth;
    context.strokeStyle = gridColor;

    var stepY = height - padding[0] - padding[2] - lineHeight * 2 - 10;
    stepY /= yNum - 1;

    var bottom = padding[2] + lineHeight * 1.5 + 10;
    var left = this.renderY(context, padding, width, height, yNum, min, stepY, fontSize, stepV, bottom);

    var offsetX1 = context.measureText(this.data.label[0]).width >> 1;
    var offsetX2 = context.measureText(this.data.label[this.data.label.length - 1]).width >> 1;
    left += offsetX1;
    var stepX = width - padding[1] - padding[3] - offsetX2 - left;
    stepX /= this.data.label.length - 1;
    var increase = (this.data.label.length - 1) / (xNum - 1);

    this.renderX(context, padding, height, lineHeight, left, xNum, stepX, increase);

    return [left, bottom, stepX, stepY];
  }
  renderY(context, padding, width, height, yNum, min, stepY, fontSize, stepV, bottom) {
    var left = 0;
    var x = padding[3];
    var fixed = parseInt(this.option.fixed) || 0;

    var vs = [];
    var ws = [];
    for(var i = 0; i < yNum; i++) {
      var v;
      if(this.option.format) {
        v = this.option.format((min + i * stepV).toFixed(fixed));
      }
      else {
        v = this.option.percent ? (((min + i * stepV) * 100).toFixed(fixed) + '%') : (min + i * stepV).toFixed(fixed);
      }
      vs.push(v);
      var w = context.measureText(v).width;
      ws.push(w);
      left = Math.max(left, w);
    }
    for(var i = 0; i < yNum; i++) {
      var y = height - stepY * i - bottom - (fontSize >> 1);
      var v = vs[i];
      var w = ws[i];
      context.fillText(v, x + left - w, y);
    }

    left += 10 + x;
    context.setLineDash(this.option.yLineDash || [1, 0]);
    for(var i = 0; i < yNum; i++) {
      var y = height - stepY * i - bottom;
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(width - padding[1], y);
      context.stroke();
    }

    return left;
  }
  renderX(context, padding, height, lineHeight, left, xNum, stepX, increase) {
    context.setLineDash(this.option.xLineDash || [1, 0]);
    for(var i = 0; i < xNum - 1; i++) {
      var item = this.data.label[i * Math.floor(increase)];
      var x = left + i * stepX * Math.floor(increase);
      this.renderXItem(item, context, padding, height, lineHeight, x);
      context.beginPath();
      context.moveTo(x, padding[0]);
      context.lineTo(x, height - padding[2] - lineHeight - 10);
      context.stroke();
    }
    var item = this.data.label[this.data.label.length - 1];
    var x = left + stepX * (this.data.label.length - 1);
    this.renderXItem(item, context, padding, height, lineHeight, x);
    context.beginPath();
    context.moveTo(x, padding[0]);
    context.lineTo(x, height - padding[2] - lineHeight - 10);
    context.stroke();
  }
  renderXItem(item, context, padding, height, lineHeight, x) {
    var w = context.measureText(item).width;
    context.fillText(item, x - (w >> 1), height - lineHeight - padding[2]);
    return w;
  }
  renderFg(context, height, lineHeight, lineWidth, left, bottom, stepX, stepY, stepV, min) {
    var self = this;
    context.setLineDash([1, 0]);
    var coords = this.coords = [];
    self.data.value.forEach(function(item) {
      var arr = [];
      item.forEach(function(item2, i) {
        var v = item2;
        if(item2 === null || item2 === undefined) {
          arr.push(null);
          return;
        }
        var x = left + i * stepX;
        var y = height - bottom - (v - min) * stepY / stepV;
        arr.push([x, y]);
      });
      coords.push(arr);
    });
    coords.forEach(function(item, i) {
      var color = getColor(self.option, i);
      var style = self.option.styles[i];
      self.renderLine(context, item, i, lineWidth, lineHeight, color, style, height - bottom);
    });
  }
  renderLine(context, coords, index, lineWidth, lineHeight, color, style, y) {
    var self = this;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    switch(style) {
      case 'curve':
        this.renderCurve(context, coords, index, y);
        break;
      default:
        this.renderStraight(context, coords, index, y);
        break;
    }
    if(self.option.discRadio) {
      var discRadio = parseInt(self.option.discRadio) || 1;
      discRadio = Math.max(discRadio, 1);
      discRadio = Math.min(discRadio, lineHeight >> 1);
      coords.forEach(function(item) {
        if(item === null || item === undefined) {
          return;
        }
        context.fillStyle = color;
        context.beginPath();
        context.arc(item[0], item[1], discRadio, 0, (Math.PI/180)*360);
        context.fill();
        context.closePath();
      });
    }
  }
  renderCurve(context, coords, index, y) {
    if(coords.length) {
      var clone = [];
      coords.forEach(function(item) {
        if(item === null || item === undefined) {
          return;
        }
        if(item !== null && item !== undefined) {
          clone.push(item);
        }
      });
      var centers = [];
      for(var i = 0, len = clone.length; i < len - 1; i++) {
        var item1 = clone[i];
        var item2 = clone[i + 1];
        centers.push([
          (item1[0] + item2[0]) >> 1,
          (item1[1] + item2[1]) >> 1
        ]);
      }
      var curvature = parseFloat(this.option.curvature);
      if(isNaN(curvature)) {
        curvature = 1;
      }
      curvature = Math.max(curvature, 0);
      curvature = Math.min(curvature, 1);
      var ctrols = [];
      for(var i = 0, len = centers.length; i < len - 1; i++) {
        var item1 = centers[i];
        var item2 = centers[i + 1];
        var item = clone[i + 1];
        var center = [
          (item1[0] + item2[0]) >> 1,
          (item1[1] + item2[1]) >> 1
        ];
        var diffX = (center[0] - item[0]);
        var diffY = (center[1] - item[1]);
        ctrols.push([
          item1[0] - diffX * curvature,
          item1[1] - diffY * curvature,
          item2[0] - diffX * curvature,
          item2[1] - diffY * curvature
        ]);
      }

      context.beginPath();
      var start = clone[0];
      var end = clone[clone.length - 1];
      context.moveTo(start[0], start[1]);
      context.quadraticCurveTo(ctrols[0][0], ctrols[0][1], clone[1][0], clone[1][1]);
      for(var i = 2, len = clone.length; i < len - 1; i++) {
        var left = ctrols[i - 2];
        var right = ctrols[i - 1];
        context.bezierCurveTo(left[2], left[3], right[0], right[1], clone[i][0], clone[i][1]);
      }
      var ctrl = ctrols[i - 2];
      context.quadraticCurveTo(ctrl[2], ctrl[3], clone[i][0], clone[i][1]);
      context.stroke();
      var fill = this.option.areaColors[index];
      if(fill && fill != 'transparent') {
        context.fillStyle = fill;
        context.lineTo(end[0], y);
        context.lineTo(start[0], y);
        context.lineTo(start[0], start[1]);
        context.fill();
      }
      context.closePath();
    }
  }
  renderStraight(context, coords, index, y) {
    context.beginPath();
    var fill = this.option.areaColors[index];
    if(fill == 'transparent') {
      fill = null;
    }
    var start;
    var end;
    for(var i = 0, len = coords.length; i < len; i++) {
      var item = coords[i];
      if(start) {
        if(item !== null && item !== undefined) {
          context.lineTo(item[0], item[1]);
          end = item;
        }
        else {
          if(fill) {
            context.lineTo(end[0], y);
            context.lineTo(start[0], y);
            context.lineTo(start[0], start[1]);
            context.fill();
          }
          context.stroke();
          start = end = null;
        }
      }
      else if(item !== null && item !== undefined) {
        start = item;
        context.lineTo(start[0], start[1]);
      }
    }
    context.stroke();
    context.closePath();
  }
  getCoords() {
    return this.coords;
  }
  getCoord(index) {
    var length = this.coords.length;
    return this.coords[index < 0 ? length + index : index];
  }
  getPoint(index, x) {
    var arr = this.getCoord(index);
    var length = arr.length;
    return arr[x < 0 ? length + x : x];
  }
}

export default Line;
