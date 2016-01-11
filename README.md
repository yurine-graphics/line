# yurine-line

线图line，`yurine`取名自`鴉-KARAS-`中的城市精灵百合音。

[![NPM version](https://badge.fury.io/js/yurine-line.png)](https://npmjs.org/package/yurine-line)

# INSTALL
```
npm install yurine-line
```

[![preview](https://raw.githubusercontent.com/yurine-graphics/line/master/preview.png)](https://github.com/yurine-graphics/line)

# API
 * Line(selector:DOM/String, data:\<\<String>, \<int>>, option:Object):Class
   * selector:String 渲染的canvas对象或选择器
   * data:\<Object> 渲染数据数组
     - labels:\<String> 标签
     - values:\<Array\<int>> 值组 
   * option:Object 选项
     - font:String 文字字体css缩写
     - fontFamily:String 文字字体，会覆盖font
     - fontWeight:String 文字粗细，会覆盖font
     - fontVariant:String 文字异体，会覆盖font
     - fontStyle:String 文字样式，会覆盖font
     - fontSize:int 文字大小，单位px，会覆盖font
     - lineHeight:String/int 行高，单位px，会覆盖font
     - padding:int/Array 边距，上右下左，单位px
     - width:int 宽度，单位px
     - height:int 高度，单位px
     - lineWidth:int 绘线粗细，单位px，∈\[1, 可视半径]
     - xLineDash:Array\<int> x线虚线类型
     - yLineDash:Array\<int> y线虚线类型
     - colors:\<String> 自定义颜色数组
     - areaColor:\<String> 自定义区域颜色数组，无区域填空或transparent
     - discRadio:\<int> 数据圆点半径，单位px，∈\[0, lineHeight/2]；不设或false、0、null、undefined为不绘制
     - xNum:int 横坐标显示个数，∈\[1, labels.length]
     - yNum:int 纵坐标显示个数，∈\[1, values\[i].length]
     - gridWidth:int 背景网格线粗细，单位px，∈\[1, 可视半径]
     - styles:\<String> 绘线类型，取值curve、straight，默认straight
     - curvature:float 曲线曲率，∈\[0, 1]
 * getCoords():\<Array> 获取绘制点的坐标，是个二维数组，包含所有线条
 * getCoord(index:int):\<Array\<x:Number, y:Number>> 获取第index线条的所有坐标，-1从末尾起
 * getPoint(index:int, x:int):\<x:Number, y:Number> 获取第index线条的第j点的纵坐标，-1从末尾起

# License
[MIT License]
