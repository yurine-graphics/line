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
     - lineWidth:int 绘线粗细，单位px，最大不超过可视半径，最小不低于1px
     - colors:<String> 自定义颜色数组
     - discRadio:\<int> 数据圆点半径，最大不超过lineHeight的一半，最小不低于0；不设或false、0、null、undefined为不绘制
     - xNum:int 横坐标显示个数，最大不超过横坐标labels个数，最小不低于1
     - yNum:int 纵坐标显示个数，最大不超过纵坐标values一组个数，最小不低于1
     - gridWidth:int 背景网格线粗细，单位px，最大不超过可视半径，最小不低于1px
     - styles:\<String> 绘线类型，取值curve、straight，默认straight
     - curvature:float 曲线曲率，最大不超过1，最小不低于0

# License
[MIT License]
