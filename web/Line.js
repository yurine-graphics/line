define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var colors = ['4A90E2', 'C374DE', 'F36342', 'F3A642', '93C93F', '50E3C2'];

function getColor(option, i) {
  var idx = i % colors.length;
  var color = option.colors[idx] || colors[idx];
  if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
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

  Line.prototype.render = function() {
    var stepY;var stepX;var bottom;var left;var lineHeight;var fontSize;var fontWeight;var fontFamily;var fontVariant;var fontStyle;var self = this;
    var context = self.dom.getContext('2d');
    var width = self.option.width || 300;
    var height = self.option.height || 150;
    var padding = self.option.hasOwnProperty('padding') ? self.option.padding : [10, 10, 10, 10];
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

    var max = parseFloat(self.data.value[0][0]) || 0;
    var min = parseFloat(self.data.value[0][0]) || 0;
    var maxLength = self.data.value[0].length;
    self.data.value.forEach(function(item) {
      maxLength = Math.max(maxLength, item.length);
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
    (function(){var _1= util.calFont(font);fontStyle=_1["fontStyle"];fontVariant=_1["fontVariant"];fontFamily=_1["fontFamily"];fontWeight=_1["fontWeight"];fontSize=_1["fontSize"];lineHeight=_1["lineHeight"]}).call(this);
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
    else if(yNum > maxLength) {
      yNum = maxLength;
    }
    var xLineNum = parseInt(self.option.xLineNum) || xNum;
    if(xLineNum < 1) {
      xLineNum = 1;
    }
    else if(xLineNum > self.data.label.length) {
      xLineNum = self.data.label.length;
    }
    var yLineNum = parseInt(self.option.yLineNum) || yNum;
    if(yLineNum < 1) {
      yLineNum = 1;
    }
    else if(yLineNum > maxLength) {
      yLineNum = maxLength;
    }

    var stepV = Math.abs(max - min) / Math.max(1, (yNum - 1));

    (function(){var _2= self.renderBg(context, padding, width, height, gridWidth, min, lineHeight, fontSize, xNum, yNum, stepV, xLineNum, yLineNum);left=_2[0];bottom=_2[1];stepX=_2[2];stepY=_2[3]}).call(this);
    if(yNum == 1) {
      stepV = stepY >> 1;
    }
    self.renderFg(context, height, lineHeight, lineWidth, left, bottom, padding[0], width - padding[3] - padding[1], stepX, stepY, stepV, min, xLineNum, yLineNum);
  }
  Line.prototype.renderBg = function(context, padding, width, height, gridWidth, min, lineHeight, fontSize, xNum, yNum, stepV, xLineNum, yLineNum) {
    var color = this.option.color || '#000';
    if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
      color = '#' + color;
    }
    var gridColor = this.option.gridColor || 'rgba(0, 0, 0, 0.2)';
    if(gridColor.charAt(0) != '#' && gridColor.charAt(0) != 'r') {
      gridColor = '#' + gridColor;
    }
    context.fillStyle = this.option.color = color;
    context.lineWidth = this.option.gridWidth = gridWidth;
    context.strokeStyle = this.option.gridColor = gridColor;

    var stepY; var stepY2;
    stepY = stepY2 = height - padding[0] - padding[2] - lineHeight * (this.option.yOutline ? 2 : 1) - 10;
    if(yNum > 1) {
      stepY /= yNum - 1;
    }
    if(yLineNum > 1) {
      stepY2 /= yLineNum - 1;
    }

    var bottom = padding[2] + lineHeight * (this.option.yOutline ? 1.5 : 1) + 10;
    var left = this.renderY(context, padding, width, height, yNum, min, stepY, yLineNum, stepY2, fontSize, stepV, bottom);

    var offsetX1 = context.measureText(this.data.label[0]).width >> 1;
    var offsetX2 = context.measureText(this.data.label[this.data.label.length - 1]).width >> 1;
    if(this.option.xOutline) {
      left += offsetX1;
    }
    var stepX;
    stepX = width - padding[1] - padding[3] - left - (this.option.xOutline ? offsetX2 : 0);
    if(this.data.label.length > 1) {
      stepX /= this.data.label.length - 1;
    }
    var increase = (this.data.label.length - 1) / (xNum - 1);
    var increase2 = (this.data.label.length - 1) / (xLineNum - 1);

    this.renderX(context, padding, height, lineHeight, left, xNum, stepX, increase, xLineNum, increase2);

    return [left, bottom, stepX, stepY];
  }
  Line.prototype.renderY = function(context, padding, width, height, yNum, min, stepY, yLineNum, stepY2, fontSize, stepV, bottom) {
    var left = 0;
    var x = padding[3];
    var fixed = parseInt(this.option.fixed) || 0;

    var coords = this.yCoords = [];
    var vs = [];
    var ws = [];
    var v;
    for(var i = 0; i < yNum; i++) {
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
      var y;
      if(!this.option.yOutline && (i == 0 || i == yNum - 1)) {
        if(i == 0) {
          y = height - stepY * i - bottom - fontSize;
        }
        else {
          y = padding[0];
        }
      }
      else {
        y = height - stepY * i - bottom - (fontSize >> 1);
      }
      var v = vs[i];
      var w = ws[i];
      //只有1个
      if(yNum == 1) {
        y = padding[0] + (stepY >> 1);
      }
      context.fillText(v, x + left - w, y);
      coords.push([x + left - (w >> 1), y]);
    }

    left += 10 + x;
    if(this.option.xLine) {
      context.setLineDash && context.setLineDash(this.option.yLineDash || [width, 0]);
      this.gridOnAreaX = [];
      for(var i = 0; i < yLineNum; i++) {
        var y = Math.round(height - stepY2 * i - bottom);
        if(this.option.gridOnArea) {
          this.gridOnAreaX.push([left, y, width - padding[1], y]);
        }
        else {
          context.beginPath();
          context.moveTo(left, y);
          context.lineTo(width - padding[1], y);
          context.stroke();
        }
      }
    }

    return left;
  }
  Line.prototype.renderX = function(context, padding, height, lineHeight, left, xNum, stepX, increase, xLineNum, increase2) {
    var coords = this.xCoords = [];
    context.setLineDash && context.setLineDash(this.option.xLineDash || [1, 0]);
    var y = height - lineHeight - padding[2];
    for(var i = 0; i < xNum - 1; i++) {
      var item = this.data.label[i * Math.floor(increase)];
      var x = left + i * stepX * Math.floor(increase);
      this.renderXItem(item, context, padding, height, lineHeight, x, i == 0);
      coords.push([x, y]);
    }
    var item = this.data.label[this.data.label.length - 1];
    var x = left + stepX * (this.data.label.length - 1);
    this.renderXItem(item, context, padding, height, lineHeight, x, i == 0, true);
    coords.push([x, y]);
    if(this.option.yLine) {
      this.gridOnAreaY = [];
      for(var i = 0; i < xLineNum - 1; i++) {
        var x = Math.round(left + i * stepX * Math.floor(increase2));
        if(this.option.gridOnArea) {
          this.gridOnAreaY.push([x, padding[0], x, y - 10]);
        }
        else {
          context.beginPath();
          context.moveTo(x, padding[0]);
          context.lineTo(x, y - 10);
          context.stroke();
        }
      }
      x = Math.round(left + i * stepX * Math.floor(increase2));
      if(this.option.gridOnArea) {
        this.gridOnAreaY.push([x, padding[0], x, y - 10]);
      }
      else {
        context.beginPath();
        context.moveTo(x, padding[0]);
        context.lineTo(x, y - 10);
        context.stroke();
      }
    }
  }
  Line.prototype.renderXItem = function(item, context, padding, height, lineHeight, x, first, end) {
    var w = context.measureText(item).width;
    if(!this.option.xOutline && (first || end)) {
      if(first) {
        context.fillText(item, x, height - lineHeight - padding[2]);
      }
      else {
        context.fillText(item, x - w, height - lineHeight - padding[2]);
      }
    }
    else {
      context.fillText(item, x - (w >> 1), height - lineHeight - padding[2]);
    }
    return w;
  }
  Line.prototype.renderFg = function(context, height, lineHeight, lineWidth, left, bottom, top, right, stepX, stepY, stepV, min, xLineNum, yLineNum) {
    var self = this;
    context.setLineDash && context.setLineDash([1, 0]);
    var coords = this.coords = [];
    self.data.value.forEach(function(item) {
      var arr = [];
      item.forEach(function(item2, i) {
        if(item2 === null || item2 === undefined) {
          arr.push(null);
          return;
        }
        var x = left + i * stepX;
        var y = height - bottom - (item2 - min) * stepY / stepV;
        arr.push([x, y]);
      });
      coords.push(arr);
    });
    if(coords.length == 1 && coords[0].length == 1) {
      var color = getColor(self.option, 0);
      var item = coords[0];
      item[0][1] = height - bottom - stepV;
      self.renderOne(context, item[0], lineWidth, lineHeight, color, right, height - bottom);
      return;
    }
    coords.forEach(function(item, i) {
      var color = getColor(self.option, i);
      var style = self.option.styles[i];
      self.renderLine(context, item, i, lineWidth, lineHeight, color, style, height - bottom, top, xLineNum, yLineNum);
    });
  }
  Line.prototype.renderOne = function(context, item, lineWidth, lineHeight, color, right, bottom) {
    var self = this;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(item[0], item[1]);
    context.lineTo(right, item[1]);
    context.stroke();
    var fill = this.option.areaColors[0];
    if(fill && fill != 'transparent') {
      context.fillStyle = fill;
      context.lineTo(right, bottom);
      context.lineTo(item[0], bottom);
      context.lineTo(item[0], item[1]);
      context.fill();
    }
    context.closePath();
    if(self.option.discRadio) {
      var discRadio = parseInt(self.option.discRadio) || 1;
      discRadio = Math.max(discRadio, 1);
      discRadio = Math.min(discRadio, lineHeight >> 1);
      context.fillStyle = color;
      context.beginPath();
      context.arc(item[0], item[1], discRadio, 0, (Math.PI/180)*360);
      context.fill();
      context.closePath();
    }
  }
  Line.prototype.renderLine = function(context, coords, index, lineWidth, lineHeight, color, style, y, y0, xLineNum, yLineNum) {
    var self = this;
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    switch(style) {
      case 'curve':
        self.renderCurve(context, coords, index, y, y0, color, lineWidth, xLineNum, yLineNum);
        break;
      default:
        self.renderStraight(context, coords, index, y);
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
  Line.prototype.renderCurve = function(context, coords, index, y, y0, color, lineWidth, xLineNum, yLineNum) {
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
        //var o = centers[centers.length - 1];
        //context.fillStyle = '#FF0000';
        //context.beginPath();
        //context.arc(o[0], o[1], 3, 0, 360);
        //context.fill();
        //context.closePath();
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
        var cCenter = [
          (item1[0] + item2[0]) >> 1,
          (item1[1] + item2[1]) >> 1
        ];
        //context.fillStyle = '#000000';
        //context.beginPath();
        //context.arc(cCenter[0], cCenter[1], 5, 0, 360);
        //context.fill();
        //context.closePath();
        var diffX = (cCenter[0] - item[0]);
        var diffY = (cCenter[1] - item[1]);
        var x1 = item1[0] - diffX * curvature;
        var y1 = item1[1] - diffY * curvature;
        var x2 = item2[0] - diffX * curvature;
        var y2 = item2[1] - diffY * curvature;
        if(y1 < y0 || y1 > y) {
          y1 = y1 < y0 ? y0 : y;
          var d = coords[i + 1][0] - x1;
          x1 += d >> 1;
        }
        if(y2 < y0 || y2 > y) {
          y2 = y2 < y0 ? y0 : y;
          var d = x2 - coords[i + 1][0];
          x2 -= d >> 1;
        }
        ctrols.push([x1, y1, x2, y2]);
        //context.fillStyle = '#00FF00';
        //context.beginPath();
        //context.arc(x1, y1, 3, 0, 360);
        //context.arc(x2, y2, 3, 0, 360);
        //context.fill();
        //context.closePath();
      }

      context.beginPath();
      var start = clone[0];
      var end = clone[clone.length - 1];
      context.moveTo(start[0], start[1]);
      if(clone.length > 2) {
        context.quadraticCurveTo(ctrols[0][0], ctrols[0][1], clone[1][0], clone[1][1]);
        for(var i = 2, len = clone.length; i < len - 1; i++) {
          var left = ctrols[i - 2];
          var right = ctrols[i - 1];
          context.bezierCurveTo(left[2], left[3], right[0], right[1], clone[i][0], clone[i][1]);
        }
        var ctrl = ctrols[i - 2];
        context.quadraticCurveTo(ctrl[2], ctrl[3], clone[i][0], clone[i][1]);
      }
      else {
        context.lineTo(end[0], end[1]);
      }
      if(!this.option.gridOnArea) {
        context.stroke();
      }

      var fill = this.option.areaColors[index];
      if(fill && fill != 'transparent') {
        context.fillStyle = fill;
        context.lineTo(end[0], y);
        context.lineTo(start[0], y);
        context.lineTo(start[0], start[1]);
        context.fill();
      }
      context.closePath();

      if(this.option.gridOnArea) {
        if(this.option.xLine) {
          context.fillStyle = this.option.color;
          context.lineWidth = this.option.gridWidth;
          context.strokeStyle = this.option.gridColor;
          for(var i = 0; i < yLineNum; i++) {
            var item = this.gridOnAreaX[i];
            context.beginPath();
            context.moveTo(item[0], item[1]);
            context.lineTo(item[2], item[3]);
            context.stroke();
          }
        }
        if(this.option.yLine) {
          context.fillStyle = this.option.color;
          context.lineWidth = this.option.gridWidth;
          context.strokeStyle = this.option.gridColor;
          for(var i = 0; i < xLineNum; i++) {
            var item = this.gridOnAreaY[i];
            context.beginPath();
            context.moveTo(item[0], item[1]);
            context.lineTo(item[2], item[3]);
            context.stroke();
          }
        }
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.beginPath();
        var start = clone[0];
        var end = clone[clone.length - 1];
        context.moveTo(start[0], start[1]);
        if(clone.length > 2) {
          context.quadraticCurveTo(ctrols[0][0], ctrols[0][1], clone[1][0], clone[1][1]);
          for(var i = 2, len = clone.length; i < len - 1; i++) {
            var left = ctrols[i - 2];
            var right = ctrols[i - 1];
            context.bezierCurveTo(left[2], left[3], right[0], right[1], clone[i][0], clone[i][1]);
          }
          var ctrl = ctrols[i - 2];
          context.quadraticCurveTo(ctrl[2], ctrl[3], clone[i][0], clone[i][1]);
        }
        else {
          context.lineTo(end[0], end[1]);
        }
        context.stroke();
      }
    }
  }
  Line.prototype.renderStraight = function(context, coords, index, y) {
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
  Line.prototype.getCoords = function() {
    return this.coords;
  }
  Line.prototype.getCoord = function(index) {
    var length = this.coords.length;
    return this.coords[index < 0 ? length + index : index];
  }
  Line.prototype.getPoint = function(index, x) {
    var arr = this.getCoord(index);
    var length = arr.length;
    return arr[x < 0 ? length + x : x];
  }
  Line.prototype.getXLabelCoords = function() {
    return this.xCoords;
  }
  Line.prototype.getYLabelCoords = function() {
    return this.yCoords;
  }


exports["default"]=Line;
});