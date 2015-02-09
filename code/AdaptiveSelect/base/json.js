/**
 * JSON序列化
 * @author tongyao@baidu.com
 */

 
/**
 * jSON ecode
 * @author dongrui@baidu.com
 */
var JSON = {};
JSON.encode = function(json) {
    var readStack = [json]; //读取项栈表
    var readStateStack = [-1]; //读取状态栈表
    var readHelperStack = []; //读取帮助栈表
    var currentIndex = 0; //当前读取项，指向readStack。当前读取项其实就是readStack的末项，所以该变量可省略。
    var stringRegexp = /["\\\x00-\x1f\x7f-\x9f]/g;
    /**
     * 转义替换字符
     * @internal
     */
    var charMap = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    };
    /**
     * 转义替换函数
     * @internal
     */
    function charReplacer(item) {
        var c = charMap[item];
        if (c) {
            return c;
        }
        c = item.charCodeAt().toString(16);
        return '\\u00' + (c.length > 1 ? c : '0' + c);
    }
    
    var serialStr = [];
    while (currentIndex >= 0) {
        if (readStateStack[currentIndex] == 1) {
            readStateStack.pop();
            readStack.pop();
            currentIndex--;
            continue;
        }
        
        //获取当前读取项和读取项类型
        var current = readStack[currentIndex];
        var currentType = typeof(current);
        if (current instanceof Array) {
            currentType = 'array';
        }
        
        var curr, len, item;
        if (currentType == 'string') {
            serialStr.push('"' + current.replace(stringRegexp, charReplacer) + '"');
            readStateStack[currentIndex] = 1;
        } else if (currentType == 'number') {
            serialStr.push(current);
            readStateStack[currentIndex] = 1;
        } else if (currentType == 'array') {
            if (readStateStack[currentIndex] == -1) {
                //起始数组读取
                readStateStack[currentIndex] = 0;
                serialStr.push('[');
                readHelperStack.push({
                    'current': 0,
                    'len': readStack[currentIndex].length
                });
            } else {
                curr = readHelperStack[currentIndex]['current'];
                len = readHelperStack[currentIndex]['len'];
                if (curr >= len) {
                    //结束数组读取
                    serialStr.push(']');
                    readStateStack[currentIndex] = 1;
                    readHelperStack.pop();
                } else {
                    if (curr !== 0) {
                        serialStr.push(',');
                    }
                    
                    //将当前读取项入栈
                    item = current[readHelperStack[currentIndex]['current']++];
                    readStack.push(item);
                    readStateStack.push(-1);
                    currentIndex++;
                }
            }
        } else if (currentType == 'object') {
            if (readStateStack[currentIndex] == -1) {
                //起始key/value类型数据读取
                readStateStack[currentIndex] = 0;
                serialStr.push('{');
                
                //临时存储key集合
                var helper = {
                    'current': 0,
                    'len': 0,
                    'keymap': []
                };
                for (var k in current) {
                    if (current.hasOwnProperty(k)) {
                        helper['keymap'].push(k);
                        helper['len']++;
                    }
                }
                readHelperStack.push(helper);
            } else {
                curr = readHelperStack[currentIndex]['current'];
                len = readHelperStack[currentIndex]['len'];
                if (curr >= len) {
                    //结束key/value型数据读取
                    serialStr.push('}');
                    readStateStack[currentIndex] = 1;
                    readHelperStack.pop();
                } else {
                    if (curr !== 0) {
                        serialStr.push(',');
                    }
                    var key = readHelperStack[currentIndex]['keymap'][readHelperStack[currentIndex]['current']++];
                    serialStr.push('"' + key.replace(stringRegexp, charReplacer) + '":');
                    
                    //将当前读取项入栈
                    item = current[key];
                    readStack.push(item);
                    readStateStack.push(-1);
                    currentIndex++;
                }
            }
        }
    }
    
    return serialStr.join('');
};