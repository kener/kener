/**
 * Label 组件
 * User: ningxiao
 * Date: 13-8-17
 * Time: 下午1:19
 */
flash.utils.provide("flash.display.Label");
flash.display.Label = function (x, y,text) {
    flash.display.DisplayObject.apply(this, arguments);
    this.bitmapData = {};
    this.imgData = true;
    this.x = x || 0;//当前对象x坐标
    this.y = y || 0;//当前对象y坐标
    this.label = text;//按钮显示内容
    this.fillStyle = '#F3260C';//字体颜色
    this.fonsize = 12;//字体大小
    this.font = 'italic ' + this.fonsize + 'px sans-serif';//设置字体
}
flash.utils.inherits(flash.display.Label, flash.display.DisplayObject);
/**
 * 继承从新flash.display.DisplayObject 的渲染核心方法
 * @param x
 * @param y
 */
flash.display.Label.prototype.drawImage = function (x, y) {
    Stage.conText.fillStyle = this.fillStyle;
    Stage.conText.font = this.font;
    Stage.conText.fillText(this.label, x, y);
}