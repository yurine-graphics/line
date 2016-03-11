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
   * data:Object 渲染数据数组
     - label:Array\<String> 标签
     - value:Array\<Array\<int>> 值组 
   * option:Object 选项
     - font:String 文字字体css缩写
     - fontFamily:String 文字字体，会覆盖font
     - fontWeight:String 文字粗细，会覆盖font
     - fontVariant:String 文字异体，会覆盖font
     - fontStyle:String 文字样式，会覆盖font
     - fontSize:int 文字大小，单位px，会覆盖font
     - lineHeight:String/int 行高，单位px，会覆盖font
     - padding:int/Array 边距，上右下左，单位px，默认10
     - width:int 宽度，单位px
     - height:int 高度，单位px
     - lineWidth:int 绘线粗细，单位px，∈\[1, 可视半径]
     - gridColor:String 背景网格线颜色
     - xLineDash:Array\<int> x线虚线类型
     - yLineDash:Array\<int> y线虚线类型
     - xLine:Boolean x轴显示
     - yLine:Boolean y轴显示
     - percent:Boolean y轴是否为百分比
     - format:Function 自定义y轴格式化回调
     - color:String 坐标轴字体颜色
     - colors:Array\<String> 自定义绘线颜色数组
     - areaColors:Array\<String> 自定义区域颜色数组，无区域填空或transparent
     - discRadio:Array\<int> 数据圆点半径，单位px，∈\[0, lineHeight/2]；不设或false、0、null、undefined为不绘制
     - xNum:int 横坐标显示个数，∈\[1, labels.length]
     - yNum:int 纵坐标显示个数，∈\[1, labels.length]
     - xLineNum: int 横坐标线显示个数，∈\[1, labels.length]
     - yLineNum: int 纵坐标线显示个数，∈\[1, labels.length]
     - max:Number y轴自定义最大值，空为数据中最大值
     - min:Number y轴自定义最小值，空为数据中最小值
     - fixed:int y轴小数位个数，默认0取整
     - gridWidth:int 背景网格线粗细，单位px，∈\[1, 可视半径]
     - styles:Array\<String> 绘线类型，取值curve、straight，默认straight
     - curvature:float 曲线曲率，∈\[0, 1]
     - xOutline:Boolean 横线是否出头
     - yOutline:Boolean 纵线是否出头
     - gridOnArea:Boolean 背景网格线显示在area上
 * getCoords():Array\<Array> 获取绘制点的坐标，是个二维数组，包含所有线条
 * getCoord(index:int):Array\<Array\<x:Number, y:Number>> 获取第index线条的所有坐标，-1从末尾起
 * getPoint(index:int, j:int):Array\<x:Number, y:Number> 获取第index线条的第j点的纵坐标，-1从末尾起
 * getXLabelCoords():Array\<Array\<x:Number, y:Number>> 获取x坐标标签，是个二维数组，包含所有线条
 * getYLabelCoords():Array\<Array\<x:Number, y:Number>> 获取y坐标标签，是个二维数组，包含所有线条

# License
[MIT License]
