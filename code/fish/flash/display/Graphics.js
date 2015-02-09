/**
 * Graphics 类包含一组可用来创建位图形状的方法
 * User: ningxiao
 * Date: 13-3-19
 * Time: 下午1:57
 */
flash.utils.provide("flash.display.Graphics");
flash.display.Graphics = function (conText, parent) {
    this.alpha = 1;//透明度0到1之间
    this.conText = conText;
    this.callList = [];//执行绘制的对象{属性方法名称:值[]};
    this.parent = parent;//当前绘制API 的父级
    this.gradient = false;//渐变对象
    this.stageX = this.parent.stageX;
    this.stageY = this.parent.stageY;
    this.isup = false;//是否修改
    this.lines = [{x:this.stageX,y:this.stageY}];//绘制直线数组
}
/**
 * 设置元素坐标 x
 */
flash.display.Graphics.prototype.setX = function () {
    this.isup = true;
    this.stageX = this.parent.stageX;
}
/**
 * 设置元素坐标 y
 */
flash.display.Graphics.prototype.setY = function () {
    this.isup = true;
    this.stageY = this.parent.stageY;
}
/**
 * 用位图图像填充绘图区。
 * @param img
 * @param repeat
 */
flash.display.Graphics.prototype.beginBitmapFill = function (img, repeat) {
    var json = {key:"fillStyle", value:this.conText.createPattern(img,repeat)};
    if (this.isBol(json)) {
        this.callList.push(json);
    }
}
/**
 * 指定一种简单的单一颜色填充
 * @param color:uint — 填充的颜色 ( #000000)。
 */
flash.display.Graphics.prototype.beginFill = function (color) {
    var json = {key:"fillStyle", value:color};
    if (this.isBol(json)) {
        this.callList.push(json);
    }
}
/**
 * 验证指定对象是否存在
 * @param val
 */
flash.display.Graphics.prototype.isBol = function (val) {
    var obj = null, key = val.key;
    for (var i = 0, l = this.callList.length; i < l; i++) {
        obj = this.callList[i];
        if (obj.key == key) {
            this.callList[i] = val;
            return false;
            break;
        }
    }
    return true;
}
/**
 * LINEAR线性
 * @param x0
 * @param y0
 * @param x1
 * @param y1
 */
flash.display.Graphics.prototype.setLinear = function (x0, y0, x1, y1) {
    x0 = x0 + this.stageX;
    y0 = y0 + this.stageY;
    x1 = x1 + this.stageX;
    y1 = y1 + this.stageY;
    return this.conText.createLinearGradient(x0, y0, x1, y1);
}
/**
 * RADIAL 放射
 * @param x0
 * @param y0
 * @param r0
 * @param x1
 * @param y1
 * @param r1
 * @return {CanvasGradient}
 */
flash.display.Graphics.prototype.setRadial = function (x0, y0, r0, x1, y1, r1) {
    x0 = x0 + this.stageX;
    y0 = y0 + this.stageY;
    x1 = x1 + this.stageX;
    y1 = y1 + this.stageY;
    return this.conText.createRadialGradient(x0, y0, r0, x1, y1, r1);
}
/**
 * 绘制填充
 * @param type
 * @param ratios
 * @param colors
 * @param alphas
 */
flash.display.Graphics.prototype.getGradient = function (type, ratios, colors, alphas) {
    if (this.isup || !this.gradient) {
        this.gradient = this[type].apply(this, ratios);
        for (var i = 0, l = colors.length; i < l; i++) {
            this.gradient.addColorStop(alphas[i], colors[i]);
        }
    }
    this.conText.fillStyle = this.gradient;
}
/**
 * 指定一种渐变填充
 */
flash.display.Graphics.prototype.beginGradientFill = function (type, ratios, colors, alphas) {
    var json = {key:"fillStyle", value:arguments, fun:this.getGradient};
    if (this.isBol(json)) {
        this.callList.push(json);
    }
}
/**
 * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
 */
flash.display.Graphics.prototype.clear = function () {

}
/**
 *绘制一个圆。 您必须在调用 drawCircle() 方法之前
 * @param x 相对于父显示对象注册点的圆心的 x 位置（以像素为单位）。
 * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
 * @param radius 圆的半径（以像素为单位）。
 */
flash.display.Graphics.prototype.drawCircle = function (x, y, radius) {

}
/**
 * 绘制一个矩形。 您必须在调用 drawRect() 方法之前
 * @param x
 * @param y
 * @param width
 * @param height
 */
flash.display.Graphics.prototype.drawRect = function (x, y, width, height) {
    var json = {key:"fillRect", value:arguments, fun:function (x, y, width, height) {
        x = this.stageX + x;
        y = this.stageY + y;
        this.conText.fillRect(x, y, width, height);
    }};
    if (this.isBol(json)) {
        this.callList.push(json);
    }
}
flash.display.Graphics.prototype.endFill = function () {

}
/**
 * 指定一种线条样式
 */
flash.display.Graphics.prototype.lineStyle = function (thickness,color,pixelHinting) {
    var json = {key:"lineWidth", value:thickness};
    if (this.isBol(json)) {
        this.callList.push(json);
    }
    if(pixelHinting){
        json = {key:"lineJoin", value:pixelHinting};
        if (this.isBol(json)) {
            this.callList.push(json);
        }
    }
    if(color){
        json = {key:"strokeStyle", value:color};
        if (this.isBol(json)) {
            this.callList.push(json);
        }
    }
}
/**
 * 绘制直线
 */
flash.display.Graphics.prototype.drawLine = function(data){
    var obj = data[0],x = this.stageX,y = this.stageY;
    this.conText.beginPath();
    this.conText.moveTo(x+obj.x,obj.y+y);
    for(var i= 1,l=data.length;i<l;i++){
        obj = data[i];
        this.conText.lineTo(x+obj.x,y+obj.y);
    }
    this.conText.stroke();
}
/**
 *使用当前线条样式绘制一条从当前绘画位置开始到 (x, y) 结束的直线
 * @param x
 * @param y
 */
flash.display.Graphics.prototype.lineTo = function (x, y) {
    var json = null;
    this.lines.push({x:x,y:y});
    json = {key:"drawLine", value:[this.lines], fun:this.drawLine};
    if (this.isBol(json)) {
        this.callList.push(json);
    }
}
/**
 *将当前绘画位置移动到 (x, y)。 如果缺少任何一个参数，则此方法将失败，并且当前绘画位置不改变。
 * @param x
 * @param y
 */
flash.display.Graphics.prototype.moveTo = function (x, y) {
    this.lines[0]={x:x,y:y};
}
/**
 * 自定义绘制
 */
flash.display.Graphics.prototype.renderer = function () {
    var json = null;
    if (this.conText) {
        for (var i = 0, l = this.callList.length; i < l; i++) {
            json = this.callList[i];
            if (json["fun"]) {
                json.fun.apply(this, json.value);
            } else {
                this.conText[json.key] = json.value;
            }
        }
        this.isup = false;
    }
}