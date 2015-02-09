Shp2Svg.exe
===========
Copyright (c) XinGang Li, slinavlee@gmail.com

This is a free tool to convert ESRI shape files to SVG files, you can use it in any way.


Usage:
        Shp2Svg.exe -/shp=xxx -/svg=xxx [-/uom=xxx] [-/width] [-/height] [-/strokewidth] [-/strokecolor] [-/fillcolor]
        -shp=xxx 'xxx' means input shape file path.
        -svg=xxx 'xxx' means output svg file path.
        -uom=xxx 'xxx' means unit of meter in svg file.
        -width=xxx 'xxx' means output svg width, ignored if uom parameter used.
        -height=xxx 'xxx' means output svg height, ignored if uom parameter used.
        -strokewidth=xxx 'xxx' means shape border width, default is 1.0.
        -strokecolor=xxx 'xxx' means shape border color, default is black.
        -fillcolor=xxx 'xxx' means shape fill color, default is none.
	-h show usage information.

History:

2006-09-05: V0.2, add some style support, fixed the flip vertical problem of the output coordinate y.
2005-07-10: First version.