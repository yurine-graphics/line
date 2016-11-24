define(function(require, exports, module){var util=function(){var _0=require('./util');return _0.hasOwnProperty("default")?_0["default"]:_0}();

var colors = ['4A90E2', 'C374DE', 'F36342', 'F3A642', '93C93F', '50E3C2'];

function getColor(option, i) {
  var idx = i % colors.length;
  var color = option.colors[idx] || colors[idx];
  return preColor(color);
}

function getCtrol(x0, y0, x1, y1, x2, y2, x3, y3) {
  var a = 0.25;
  var b = 0.25;
  return [
    x1 + (x2 - x0) * a, y1 + (y2 - y0) * a,
    x2 - (x3 - x1) * b, y2 - (y3 - y1) * b
  ];
}

function getTop(coords) {
  var top = coords[0][1];
  coords.forEach(function(item) {
    top = Math.min(top, item[1]);
  });
  return top;
}

function preColor(color) {
  if(color.charAt(0) != '#' && color.charAt(0) != 'r') {
    return '#' + color;
  }
  return color;
}

function getGdr(context, top, y, fill) {
  var gdr = context.createLinearGradient(0, top, 0, y);
  var length = fill.length;
  fill.forEach(function(item, i) {
    if(/\s[\d.]+$/.test(item)) {
      var j = item.lastIndexOf(' ');
      gdr.addColorStop(parseFloat(item.slice(j + 1)), preColor(item.slice(0, j)));
    }
    else {
      gdr.addColorStop(i / (length - 1), preColor(item));
    }
  });
  return gdr;
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
    this.originCoords = [];
    this.render();
  }

  Line.prototype.render = function() {
    var stepY;var stepX;var bottom;var left;var lineHeight;var fontSize;var fontWeight;var fontFamily;var fontVariant;var fontStyle;var self = this;
    var context = self.dom.getContext('2d');
    var width = self.option.width || self.dom.getAttribute('width') || parseInt(window.getComputedStyle(self.dom, null).getPropertyValue('width')) || 300;
    var height = self.option.height || self.dom.getAttribute('height') || parseInt(window.getComputedStyle(self.dom, null).getPropertyValue('height')) || 150;
    context.clearRect(0, 0, width, height);
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

    var lineWidth;
    if(Array.isArray(self.option.lineWidth)) {
      lineWidth = self.option.lineWidth;
    }
    else {
      lineWidth = self.option.lineWidth;
    }

    var breakLineWidth;
    if(Array.isArray(self.option.breakLineWidth)) {
      breakLineWidth = self.option.breakLineWidth;
    }
    else {
      breakLineWidth = self.option.breakLineWidth;
    }

    var gridWidth = parseInt(self.option.gridWidth) || 1;
    gridWidth = Math.max(gridWidth, 1);
    
    var xlp = self.option.xlp || 0;
    var ylp = self.option.ylp || 0;

    var length = self.data.label.length || 0;
    for(var i = 0, len = self.data.value.length; i < len; i++) {
      if(self.data.value[i].length > length) {
        self.data.value[i] = self.data.value[i].slice(0, length);
      }
    }

    var max = 0;
    var min = 0;
    var maxConfig = false;
    var minConfig = false;
    if(self.option.max !== undefined && self.option.max !== null) {
      maxConfig = true;
      max = parseFloat(self.option.max) || 0;
    }
    if(self.option.min !== undefined && self.option.min !== null) {
      minConfig = true;
      min = parseFloat(self.option.min) || 0;
    }
    if(max < min) {
      max = min;
    }
    if(!maxConfig || !minConfig) {
      if(!maxConfig) {
        max = parseFloat(self.data.value[0][0]) || 0;
      }
      if(!minConfig) {
        min = parseFloat(self.data.value[0][0]) || 0;
      }
      self.data.value.forEach(function(item) {
        item && item.forEach(function(item2) {
          var v = parseFloat(item2) || 0;
          if(!maxConfig) {
            max = Math.max(max, v);
          }
          if(!minConfig) {
            min = Math.min(min, v);
          }
        });
      });
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

    var len = self.data.label.length || 0;
    self.data.value.forEach(function(item, i) {
      if(item.length > len) {
        item.splice(len);
      }
    });

    var xNum = parseInt(self.option.xNum) || len;
    if(xNum < 1) {
      xNum = 1;
    }
    else if(xNum > len) {
      xNum = len;
    }
    var yNum = parseInt(self.option.yNum) || Math.floor((height - padding[0] - padding[2] - lineHeight * 2 - 20) / lineHeight);
    if(yNum < 1) {
      yNum = 1;
    }
    var xLineNum = parseInt(self.option.xLineNum) || xNum;
    if(xLineNum < 1) {
      xLineNum = 1;
    }
    else if(xLineNum > len) {
      xLineNum = len;
    }
    var yLineNum = parseInt(self.option.yLineNum) || yNum;
    if(yLineNum < 1) {
      yLineNum = 1;
    }

    var stepV = Math.abs(max - min) / Math.max(1, (yNum - 1));

    (function(){var _2= self.renderBg(context, padding, width, height, gridWidth, min, lineHeight, fontSize, xNum, yNum, stepV, xLineNum, yLineNum, xlp, ylp);left=_2[0];bottom=_2[1];stepX=_2[2];stepY=_2[3]}).call(this);
    if(yNum == 1) {
      stepV = stepY >> 1;
    }
    self.renderFg(context, height, lineHeight, lineWidth, breakLineWidth, left, bottom, padding[0], width - padding[3], stepX, stepY, stepV, min, xLineNum, yLineNum);
  }
  Line.prototype.renderBg = function(context, padding, width, height, gridWidth, min, lineHeight, fontSize, xNum, yNum, stepV, xLineNum, yLineNum, xlp, ylp) {
    var color = preColor(this.option.color || '#000');
    var gridColor = preColor(this.option.gridColor || 'rgba(0, 0, 0, 0.2)');
    context.fillStyle = this.option.color = color;
    context.lineWidth = this.option.gridWidth = gridWidth;
    context.strokeStyle = this.option.gridColor = gridColor;

    var stepY; var stepY2;
    stepY = stepY2 = height - padding[0] - padding[2] - lineHeight * (this.option.yOutline ? 2 : 1) - ylp;
    if(yNum > 1) {
      stepY /= yNum - 1;
    }
    if(yLineNum > 1) {
      stepY2 /= yLineNum - 1;
    }

    var bottom = padding[2] + lineHeight * (this.option.yOutline ? 1.5 : 1) + ylp;
    var left = this.renderY(context, padding, width, height, yNum, min, stepY, yLineNum, stepY2, fontSize, stepV, bottom, xlp, ylp);

    var offsetX1 = context.measureText(this.data.label[0]).width >> 1;
    var offsetX2 = context.measureText(this.data.label[this.data.label.length - 1]).width >> 1;
    if(this.option.xOutline) {
      left += offsetX1;
    }
    var stepX;
    stepX = width - padding[1] - left - (this.option.xOutline ? offsetX2 : 0);
    if(this.data.label.length > 1) {
      stepX /= this.data.label.length - 1;
    }
    var increase = (this.data.label.length - 1) / (xNum - 1);
    var increase2 = (this.data.label.length - 1) / (xLineNum - 1);

    this.renderX(context, padding, height, lineHeight, left, width - padding[1], xNum, stepX, increase, xLineNum, increase2, xlp, ylp);

    return [left, bottom, stepX, stepY];
  }
  Line.prototype.renderY = function(context, padding, width, height, yNum, min, stepY, yLineNum, stepY2, fontSize, stepV, bottom, xlp, ylp) {
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

    left += xlp + x;
    this.originCoords.push(left);
    if(this.option.xLine) {
      context.setLineDash && context.setLineDash(this.option.xLineDash || [width, 0]);
      this.gridOnAreaY = [];
      for(var i = 0; i < yLineNum; i++) {
        var y = Math.round(height - stepY2 * i - bottom);
        if(this.option.gridOnArea) {
          this.gridOnAreaY.push([left, y, width - padding[1], y]);
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
  Line.prototype.renderX = function(context, padding, height, lineHeight, left, right, xNum, stepX, increase, xLineNum, increase2, xlp, ylp) {
    var self = this;
    var coords = self.xCoords = [];
    context.setLineDash && context.setLineDash(self.option.yLineDash || [1, 0]);
    var y = height - lineHeight - padding[2];
    self.originCoords.push(y - ylp);
    if(self.option.labelIndex) {
      self.option.labelIndex.forEach(function(item) {
        var x = left + item * stepX;
        self.renderXItem(self.data.label[item], context, padding, height, lineHeight, x, item == 0, item == self.data.label.length - 1);
        coords.push([x, y]);
        if(self.option.yLine) {
          self.gridOnAreaX = self.gridOnAreaX || [];
          if(self.option.gridOnArea) {
            self.gridOnAreaX.push([x, padding[0], x, y - ylp]);
          }
          else {
            context.beginPath();
            context.moveTo(x, padding[0]);
            context.lineTo(x, y - ylp);
            context.stroke();
          }
        }
      });
    }
    else {
      for(var i = 0; i < xNum - 1; i++) {
        var item = self.data.label[i * Math.floor(increase)];
        var x = left + i * stepX * Math.floor(increase);
        self.renderXItem(item, context, padding, height, lineHeight, x, i == 0);
        coords.push([x, y]);
      }
      var item = self.data.label[self.data.label.length - 1];
      var x = left + stepX * (self.data.label.length - 1);
      self.renderXItem(item, context, padding, height, lineHeight, x, i == 0, true);
      coords.push([x, y]);
      if(self.option.yLine) {
        self.gridOnAreaX = [];
        for(var i = 0; i < xLineNum - 1; i++) {
          var x = Math.round(left + i * stepX * Math.floor(increase2));
          if(self.option.gridOnArea) {
            self.gridOnAreaX.push([x, padding[0], x, y - ylp]);
          }
          else {
            context.beginPath();
            context.moveTo(x, padding[0]);
            context.lineTo(x, y - ylp);
            context.stroke();
          }
        }
        if(self.option.gridOnArea) {
          self.gridOnAreaX.push([right, padding[0], right, y - ylp]);
        }
        else {
          context.beginPath();
          var x = self.data.label.length > 1 ? right : left;
          context.moveTo(x, padding[0]);
          context.lineTo(x, y - ylp);
          context.stroke();
        }
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
  Line.prototype.renderFg = function(context, height, lineHeight, lineWidth, breakLineWidth, left, bottom, top, right, stepX, stepY, stepV, min, xLineNum, yLineNum) {
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
        var y = height - bottom - (item2 - min) * stepY / (stepV || 1);
        arr.push([x, y]);
      });
      coords.push(arr);
    });
    var breakColor = preColor(self.option.breakColor || '#000');
    var breakDash = self.option.breakDash || [4, 4];
    coords.forEach(function(item, i) {
      var color = getColor(self.option, i);
      if(!item.length) {
        return;
      }
      if(item.length == 1) {
        self.renderOne(context, item[0], lineHeight, color);
        return;
      }
      var style = self.option.styles[i];
      var lw = Array.isArray(lineWidth) ? lineWidth[i] : lineWidth;
      var bw = Array.isArray(breakLineWidth) ? breakLineWidth[i] : breakLineWidth;
      self.renderLine(context, item, i, lw, bw, lineHeight, color, breakColor, breakDash, style, height - bottom, top, left, right, xLineNum, yLineNum);
    });
  }
  Line.prototype.renderOne = function(context, item, lineHeight, color) {
    var self = this;
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
  Line.prototype.renderLine = function(context, coords, index, lineWidth, breakLineWidth, lineHeight, color, breakColor, breakDash, style, y, y0, left, right, xLineNum, yLineNum) {
    var self = this;
    switch(style) {
      case 'curve':
        self.renderCurve(context, coords, index, y, y0, left, right, color, lineWidth, breakLineWidth, breakColor, breakDash, xLineNum, yLineNum);
        break;
      default:
        self.renderStraight(context, coords, index, y, left, right, color, lineWidth, breakLineWidth, breakColor, breakDash, xLineNum, yLineNum);
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
  Line.prototype.renderCurve = function(context, coords, index, y, y0, left, right, color, lineWidth, breakLineWidth, breakColor, breakDash, xLineNum, yLineNum) {
    if(coords.length) {
      var clone = [];
      coords.forEach(function(item) {
        if(item === null || item === undefined) {
          return;
        }
        clone.push(item);
      });
      var centers = [];
      for(var i = 0, len = clone.length; i < len - 1; i++) {
        var item1 = clone[i];
        var item2 = clone[i + 1];
        centers.push([
          (item1[0] + item2[0]) >> 1,
          (item1[1] + item2[1]) >> 1
        ]);
        var o = centers[centers.length - 1];
        // context.fillStyle = '#FF9900';
        // context.beginPath();
        // context.arc(o[0], o[1], 6, 0, 360);
        // context.fill();
        // context.closePath();
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
        // context.fillStyle = '#000000';
        // context.beginPath();
        // context.arc(cCenter[0], cCenter[1], 5, 0, 360);
        // context.fill();
        // context.closePath();
        var diffX = (cCenter[0] - item[0]);
        var diffY = (cCenter[1] - item[1]);
        var x1 = item1[0] - diffX * curvature;
        var y1 = item1[1] - diffY * curvature;
        var x2 = item2[0] - diffX * curvature;
        var y2 = item2[1] - diffY * curvature;
        //防止超出范围
        if(y1 < y0 || y1 > y) {
          y1 = y1 < y0 ? y0 : y;
          var d = clone[i + 1][0] - x1;
          x1 += d >> 1;
        }
        if(y2 < y0 || y2 > y) {
          y2 = y2 < y0 ? y0 : y;
          var d = x2 - clone[i + 1][0];
          x2 -= d >> 1;
        }
        ctrols.push([x1, y1, x2, y2]);
        // context.fillStyle = '#00FF00';
        // context.beginPath();
        // context.arc(x1, y1, 3, 0, 360);
        // context.arc(x2, y2, 3, 0, 360);
        // context.fill();
        // context.closePath();
      }

      context.beginPath();
      var fill = this.option.areaColors[index];
      if(fill == 'transparent') {
        fill = null;
      }
      if(Array.isArray(fill)) {
        context.fillStyle = getGdr(context, getTop(coords), y, fill);
      }
      else if(fill) {
        context.fillStyle = preColor(fill);
      }
      var count = 0;
      //从第一个非空点开始,防止前置有空数据
      for(var i = 0, len = this.data.label.length; i < len; i++) {
        if(coords[i]) {
          break;
        }
        else {
          count++;
        }
      }
      if(i > 0 && this.option.breakStart !== undefined && this.option.breakStart < i) {
        var x = left + (right - left) * this.option.breakStart / (this.data.label.length - 1 || 1);
        context.strokeStyle = breakColor;
        context.lineWidth = breakLineWidth;
        context.setLineDash && context.setLineDash(breakDash);
        context.moveTo(x, coords[i][1]);
        context.lineTo(coords[i][0], coords[i][1]);
        context.stroke();
        context.closePath();
        context.beginPath();
      }
      var begin = clone[0];
      var last = clone[0];
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.setLineDash && context.setLineDash([1, 0]);
      context.moveTo(last[0], last[1]);
      var isPrevBreak = false;
      for(++i; i < len - 1; i++) {
        if(coords[i]) {
          last = coords[i];
          if(isPrevBreak) {
            begin = coords[i];
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.setLineDash && context.setLineDash([1, 0]);
            context.beginPath();
            context.moveTo(coords[i][0], coords[i][1]);
          }
          else {
            var leftC = ctrols[i - 2 - count];
            var rightC = ctrols[i - 1 - count];
            if(leftC && rightC) {
              context.bezierCurveTo(leftC[2], leftC[3], rightC[0], rightC[1], coords[i][0], coords[i][1]);
            }
            else if(rightC) {
              context.quadraticCurveTo(rightC[0], rightC[1], coords[i][0], coords[i][1]);
            }
            else {
              context.quadraticCurveTo(leftC[2], leftC[3], coords[i][0], coords[i][1]);
            }
          }
          isPrevBreak = false;
        }
        else {
          context.stroke();
          if(fill && last != begin) {
            context.lineTo(last[0], y);
            context.lineTo(begin[0], y);
            context.lineTo(begin[0], begin[1]);
            context.fill();
            begin = last;
          }
          context.closePath();
          context.beginPath();
          context.moveTo(last[0], last[1]);
          count++;
          //找到连续空白结尾
          for(var next = i + 1; next < len - 1; next++) {
            if(coords[next]) {
              break;
            }
            else {
              count++;
            }
          }
          if(coords[next]) {
            i = next - 1;
            context.strokeStyle = breakColor;
            context.lineWidth = breakLineWidth;
            context.setLineDash && context.setLineDash(breakDash);
            context.lineTo(coords[next][0], coords[next][1]);
            context.stroke();
            context.closePath();
            context.beginPath();
          }
          isPrevBreak = true;
        }
      }
      if(coords[i]) {
        last = coords[i];
        if(!isPrevBreak) {
          var ctrl = ctrols[i - 2 - count];
          if(ctrl) {
            context.quadraticCurveTo(ctrl[2], ctrl[3], coords[i][0], coords[i][1]);
          }
          else {
            context.lineTo(coords[i][0], coords[i][1]);
          }
          context.stroke();
          if(fill && last != begin) {
            context.lineTo(last[0], y);
            context.lineTo(begin[0], y);
            context.lineTo(begin[0], begin[1]);
            context.fill();
          }
          context.closePath();
        }
      }
      else {
        context.stroke();
        if(fill && last != begin) {
          context.lineTo(last[0], y);
          context.lineTo(begin[0], y);
          context.lineTo(begin[0], begin[1]);
          context.fill();
        }
        context.closePath();
        context.beginPath();
        context.moveTo(last[0], last[1]);
        context.strokeStyle = breakColor;
        context.lineWidth = breakLineWidth;
        context.setLineDash && context.setLineDash(breakDash);
        if(!this.option.breakEnd || this.option.breakEnd <= 0) {
          context.lineTo(right, last[1]);
        }
        else {
          var x = left + (right - left) * this.option.breakEnd / (this.data.label.length - 1 || 1);
          if(x > last[0]) {
            context.lineTo(x, last[1]);
          }
        }
        context.stroke();
        context.closePath();
      }

      if(this.option.gridOnArea) {
        if(this.option.yLine) {
          context.lineWidth = this.option.gridWidth;
          context.strokeStyle = this.option.gridColor;
          context.setLineDash && context.setLineDash(this.option.yLineDash || [1, 0]);
          if(this.option.labelIndex) {
            this.gridOnAreaX.forEach(function(item) {
              context.beginPath();
              context.moveTo(item[0], item[1]);
              context.lineTo(item[2], item[3]);
              context.stroke();
            });
          }
          else {
            for(var i = 0; i < xLineNum; i++) {
              var item = this.gridOnAreaX[i];
              context.beginPath();
              context.moveTo(item[0], item[1]);
              context.lineTo(item[2], item[3]);
              context.stroke();
            }
          }
        }
        if(this.option.xLine) {
          context.lineWidth = this.option.gridWidth;
          context.strokeStyle = this.option.gridColor;
          context.setLineDash && context.setLineDash(this.option.xLineDash || [1, 0]);
          if(this.option.labelIndex) {
            this.gridOnAreaY.forEach(function(item) {
              context.beginPath();
              context.moveTo(item[0], item[1]);
              context.lineTo(item[2], item[3]);
              context.stroke();
            });
          }
          else {
            for(var i = 0; i < yLineNum; i++) {
              var item = this.gridOnAreaY[i];
              context.beginPath();
              context.moveTo(item[0], item[1]);
              context.lineTo(item[2], item[3]);
              context.stroke();
            }
          }
        }
        context.closePath();
      }
    }
  }
  Line.prototype.renderStraight = function(context, coords, index, y, left, right, color, lineWidth, breakLineWidth, breakColor, breakDash, xLineNum, yLineNum) {
    context.beginPath();
    var fill = this.option.areaColors[index];
    if(fill == 'transparent') {
      fill = null;
    }
    if(Array.isArray(fill)) {
      context.fillStyle = getGdr(context, getTop(coords), y, fill);
    }
    else if(fill) {
      context.fillStyle = preColor(fill);
    }
    if(coords.length) {
      //从第一个非空点开始,防止前置有空数据
      for(var i = 0, len = this.data.label.length; i < len; i++) {
        if(coords[i]) {
          break;
        }
      }
      if(i > 0 && this.option.breakStart !== undefined && this.option.breakStart < i) {
        var x = left + (right - left) * this.option.breakStart / (this.data.label.length - 1 || 1);
        context.strokeStyle = breakColor;
        context.lineWidth = breakLineWidth;
        context.setLineDash && context.setLineDash(breakDash);
        context.moveTo(x, coords[i][1]);
        context.lineTo(coords[i][0], coords[i][1]);
        context.stroke();
        context.closePath();
        context.beginPath();
      }
      var begin = coords[i];
      var last = coords[i];
      var isPrevBreak = false;
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.setLineDash && context.setLineDash([1, 0]);
      context.moveTo(last[0], last[1]);
      for(++i; i < len - 1; i++) {
        if(coords[i]) {
          last = coords[i];
          if(isPrevBreak) {
            begin = coords[i];
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.setLineDash && context.setLineDash([1, 0]);
            context.moveTo(coords[i][0], coords[i][1]);
          }
          else {
            context.lineTo(coords[i][0], coords[i][1]);
          }
          isPrevBreak = false;
        }
        else {
          context.stroke();
          if(fill && last != begin) {
            context.lineTo(last[0], y);
            context.lineTo(begin[0], y);
            context.lineTo(begin[0], begin[1]);
            context.fill();
            begin = last;
          }
          context.closePath();
          context.beginPath();
          context.moveTo(last[0], last[1]);
          //找到连续空白结尾
          for(var next = i + 1; next < len - 1; next++) {
            if(coords[next]) {
              break;
            }
          }
          if(coords[next]) {
            i = next - 1;
            context.strokeStyle = breakColor;
            context.lineWidth = breakLineWidth;
            context.setLineDash && context.setLineDash(breakDash);
            context.lineTo(coords[next][0], coords[next][1]);
            context.stroke();
            context.closePath();
            context.beginPath();
          }
          isPrevBreak = true;
        }
      }

      if(coords[i]) {
        last = coords[i];
        if(!isPrevBreak) {
          context.lineTo(coords[i][0], coords[i][1]);
          context.stroke();
          if(fill && last != begin) {
            context.lineTo(last[0], y);
            context.lineTo(begin[0], y);
            context.lineTo(begin[0], begin[1]);
            context.fill();
          }
          context.closePath();
        }
      }
      else {
        context.stroke();
        if(fill && last != begin) {
          context.lineTo(last[0], y);
          context.lineTo(begin[0], y);
          context.lineTo(begin[0], begin[1]);
          context.fill();
        }
        context.closePath();
        context.beginPath();
        context.moveTo(last[0], last[1]);
        context.strokeStyle = breakColor;
        context.lineWidth = breakLineWidth;
        context.setLineDash && context.setLineDash(breakDash);
        if(!this.option.breakEnd || this.option.breakEnd <= 0) {
          context.lineTo(right, last[1]);
        }
        else {
          var x = left + (right - left) * this.option.breakEnd / (this.data.label.length - 1 || 1);
          if(x > last[0]) {
            context.lineTo(x, last[1]);
          }
        }
        context.stroke();
        context.closePath();
      }
    }

    if(this.option.gridOnArea) {
      if(this.option.yLine) {
        context.lineWidth = this.option.gridWidth;
        context.strokeStyle = this.option.gridColor;
        context.setLineDash && context.setLineDash(this.option.yLineDash || [1, 0]);
        if(this.option.labelIndex) {
          this.gridOnAreaX.forEach(function(item) {
            context.beginPath();
            context.moveTo(item[0], item[1]);
            context.lineTo(item[2], item[3]);
            context.stroke();
          });
        }
        else {
          for(var i = 0; i < yLineNum; i++) {
            var item = this.gridOnAreaX[i];
            context.beginPath();
            context.moveTo(item[0], item[1]);
            context.lineTo(item[2], item[3]);
            context.stroke();
          }
        }
      }
      if(this.option.xLine) {
        context.lineWidth = this.option.gridWidth;
        context.strokeStyle = this.option.gridColor;
        context.setLineDash && context.setLineDash(this.option.xLineDash || [1, 0]);
        if(this.option.labelIndex) {
          this.gridOnAreaY.forEach(function(item) {
            context.beginPath();
            context.moveTo(item[0], item[1]);
            context.lineTo(item[2], item[3]);
            context.stroke();
          });
        }
        else {
          for(var i = 0; i < xLineNum; i++) {
            var item = this.gridOnAreaY[i];
            context.beginPath();
            context.moveTo(item[0], item[1]);
            context.lineTo(item[2], item[3]);
            context.stroke();
          }
        }
      }
      context.closePath();
    }
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
  Line.prototype.getOriginCoords = function() {
    return this.originCoords;
  }


exports["default"]=Line;
});