/**
 * 将字符串转为日期对象
 * @param {String} str 日期字符串
 * @param {String} str 格式 格式为yyyymmdd，默认为yyyymmdd
 * @return {Object} 返回日期对象
 */
function stringToDate(str, format){
    if (typeof str == 'undefined') {
        return false;
    }
    format = format || "yyyymmdd";
    format = format.toLowerCase();
    var _yearPos = [format.indexOf('y'), format.lastIndexOf('y') - format.indexOf('y') + 1];
    var _monthPos = [format.indexOf('m'), format.lastIndexOf('m') - format.indexOf('m') + 1];
    var _dayPos = [format.indexOf('d'), format.lastIndexOf('d') - format.indexOf('d') + 1];
    try {
        str = str.substr(_monthPos[0], _monthPos[1]) + '/' + str.substr(_dayPos[0], _dayPos[1]) + '/' + str.substr(_yearPos[0], _yearPos[1]);
    } 
    catch (ex) {
        return false;
    }
    try {
        var _date = new Date(str);
        return _date;
    } 
    catch (ex) {
        return false;
    }
}

/**
 * 将日期格式化成设定的格式.
 * <h3>日期模式说明</h3>
 * <pre>
 * like the ISO 8895
 * also see Java's SimpleDateFormat.
 *
 * Letter  Date or Time Component  Presentation    Examples          UserDic
 * Y       Year                    Year            1996; 96
 * M       Month in year           Month           July; Jul; 07     *
 * D       Day in month            Number          10
 * w       Day in week             Text            Tuesday; Tue; 2   *
 * h       Hour in day (0-23)      Number          0
 * m       Minute in hour          Number          30
 * s       Second in minute        Number          55
 *
 *
 *
 * Pattern                       Sample
 * YYYY-MM-DD hh:mm:ss           2001-07-04 12:08:56
 * YYYY-MM-DDThh:mm:ss           2001-07-04T12:08:56
 * YYYY/MM/DDThh:mm:ss           2001/07/04T12:08:56
 * YYYY年MM月DD日,周w              2008年12月12日,周3
 * hh:mm                         12:08
 *
 * 使用代码:
 * var dateText = format("YYYY-MM-DD",date)
 * </pre>
 *
 * @public
 * @param {String} pattern 格式化模式字符串(参考上面说明)
 * @param {Date | Number} data 需要格式化的数据
 * @author a9text May.2007
 * @author jindw 2008-07
 * @author erik168 2008-11
 */
function dateToString(data, pattern){
    function dl(data, format){
        format = format.length;
        data = data || 0;
        var d = String(Math.pow(10, format) + data);
        return format == 1 ? data : d.substr(d.length - format);
    }
    return pattern.replace(/([YMDhsmw])\1*/g, function(format){
        switch (format.charAt()) {
            case 'Y':
                return dl(data.getFullYear(), format);
            case 'M':
                return dl(data.getMonth() + 1, format);
            case 'D':
                return dl(data.getDate(), format);
            case 'w':
                return data.getDay();
            case 'h':
                return dl(data.getHours(), format);
            case 'm':
                return dl(data.getMinutes(), format);
            case 's':
                return dl(data.getSeconds(), format);
        }
    });
}


