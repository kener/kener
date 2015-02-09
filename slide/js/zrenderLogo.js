functionMap.zrender = function(dom) {
    var zrender = require('zrender');
    var LineShape = require('zrender/shape/Line');
    var TextShape = require('zrender/shape/Text');
    var CircleShape = require('zrender/shape/Circle');
    var guid = require('zrender/tool/guid');
    
    var zr = zrender.init(dom);
    var zrColor = require('zrender/tool/color');
    var colorIdx = 0;
    var width = Math.ceil(zr.getWidth());
    var height = Math.ceil(zr.getHeight());

    var i;
    var n = 50;
    var shapeList = [];
    var pos;
    var len;
    var xStart;
    // 动画元素
    for(i = 0; i < n; i++) {
        xStart = -Math.ceil(Math.random() * 1000);
        len = Math.ceil(Math.random() * 400);
        pos = Math.ceil(Math.random() * height);
        shapeList[i] = new LineShape({
            id : guid(),
            style : {
                xStart : xStart,
                yStart : pos,
                xEnd : xStart + len,
                yEnd : pos,
                strokeColor : zrColor.random(),
                lineWidth : 1
            },
            _animationX : Math.ceil(Math.random() * 100),
            _len : len,
            hoverable : false
        });
        zr.addShape(shapeList[i]);
    }
    var aniText = new TextShape({
        id : guid(),
        style : {
            x : width / 2,
            y : 120,
            brushType : 'stroke',
            strokeColor : 'rgba(255, 255, 255, 0.2)',
            lineWidth : 1,
            text : 'ZRender',
            textFont : 'bold 80px verdana',
            textAlign : 'center'
        },
        _animationSize : 80,
        hoverable:false
    });

    zr.addShape(aniText);

    zr.addShape(new TextShape({
        zlevel : 1,
        style : {
            x : width / 2,
            y : 110,
            brushType : 'both',
            color : zrColor.getLinearGradient(
                        0, 100, 0, 140,
                        [[0, '#c7ffbb'],[1,'#00afdd']]
                    ),
            strokeColor : '#ffff77',
            lineWidth : 2,
            shadowBlur: 15,
            shadowColor : 'rgba(255,215,0,0.8)',
            text : 'ZRender',
            textFont : 'bold 80px "Times New Roman"',
            textAlign : 'center'
        },
        draggable : true,
        clickable : true,
        onclick : function(){
            alert('Hello! Catch you!');
        }
    }));

    zr.addShape(new TextShape({
        shape : 'text',
        zlevel : 1,
        style : {
            x : width / 2,
            y : 190,
            color : '#fff',//'rgba(255, 69, 0, 1)',
            shadowBlur: 10,
            shadowColor : 'rgba(255,215,0,0.8)',
            text : '一个轻量级的Canvas类库，MVC封装，数据驱动，提供类Dom事件模型，让canvas绘图大不同！',
            textFont : 'normal 20px 微软雅黑',
            textAlign : 'center'
        },
        highlightStyle: {
            brushType: 'fill'
        },
        draggable : true
    }));

    
    zr.addShape(new CircleShape({
        zlevel : 1,
        style : {
            x : width / 2,
            y : 270,
            r : 20,
            brushType : 'both',
            color : 'rgba(255, 69, 0, 1)',
            strokeColor : 'rgba(255, 255, 255, 1)',
            lineWidth : 8,
            shadowBlur: 20,
            shadowColor : 'rgba(255,215,0,0.8)',
            text : 'Try',
            textPosition : 'inside',
            textFont : 'normal 18px 微软雅黑',
            textAlign : 'center'
        },
        clickable : true,
        draggable : true,
        onclick : function(){
            window.open('http://localhost/zrender/index.html');
        }
    }));


    // 绘画，利用render的callback可以在绘画完成后马上开始动画
    zr.render(function(){
        timeTicket = setInterval(
            function(){
                var style;
                for( i = 0; i < n; i++) {
                    // 可以跳过
                    style = shapeList[i].style;

                    if (style.xStart >= width){
                        shapeList[i]._len = Math.ceil(Math.random() * 400);
                        shapeList[i].style.xStart = -400;
                        shapeList[i].style.xEnd = -400 + shapeList[i]._len;
                        shapeList[i].style.yStart = Math.ceil(Math.random() * height);
                        shapeList[i].style.yEnd = shapeList[i].style.yStart;
                    }
                    shapeList[i].style.xStart += shapeList[i]._animationX;
                    shapeList[i].style.xEnd += shapeList[i]._animationX;

                    // 就看这句就行了
                    zr.modShape(shapeList[i].id, shapeList[i]);
                }
                aniText._animationSize += Math.round(2000 / aniText._animationSize);
                if (aniText._animationSize > 500) {
                    aniText._animationSize = 80;
                }
                aniText.style.textFont = 'bold ' + aniText._animationSize + 'px verdana';
                zr.modShape(aniText.id, aniText);

                zr.refresh();
            },
            50
        )
    });
}