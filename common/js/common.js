var dayMS = 86400000;

var animateEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';


(function (jQuery, undefined) {
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    /**
     * use in jsp xiangxiao 2014/8/16
     * @type {Object}
     */
    $.templateSettings = {
        evaluate: /<&([\s\S]+?)&>/g,
        interpolate: /<&=([\s\S]+?)&>/g,
        escape: /<&-([\s\S]+?)&>/g
    };
    //全局OCX 临时ID存放
    window.TEMPOBJECT=[];
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    //用于同步请求模板数据，并反回页面;
    $.loadTemplate = function (url, viewData, settings) {
        var resrultStr = "";
        $.ajax({url: url, plugin: false, async: false}).done(function (data) {
            var compiled = _.template($.trim(data));
            resrultStr = compiled(viewData);
        });

        //var compiled = _.template(" <% _.each(obj,function(item){ %><li></li> <% }) %>");
        //resrultStr = compiled([{"avg":null,"title":"11月考评","timeStr":null,"itemList":null},{"avg":"0.00","title":"10月考评","timeStr":"2016/10/25 ~ 2016/10/25","itemList":[{"id":4,"socre":0}]}]);
        return resrultStr;
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    $.template = function (text, data, settings) {
        var render;
        settings = $.extend({}, settings, $.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = new RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";

        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function (match) {
                    return '\\' + escapes[match];
                });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':$.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) {
            source = 'with(obj||{}){\n' + source + '}\n';
        }

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            render = new Function(settings.variable || 'obj', '$', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) {
            return render(data, $);
        }
        var template = function (data) {
            return render.call(this, data, $);
        };

        // Provide the compiled function source as a convenience for precompilation.
        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };
})(jQuery);


/**
 * Mask 遮罩
 * @author xiangxiao
 * @date   2014-08-19
 * require jquery
 */
(function ($) {
    'use strict';

    $.fn.mask = function (num) {
        var that = this;
        var zIndex = num ? num : this.css('z-index') - 1;

        $(".overlay").each(function () {
            if ($(this).is(":visible")) {
                zIndex++;
                $(that).css({
                    zIndex: (zIndex + 1)
                });
            }
        });

        this.maskui = $('<div class="overlay"></div>')
            .appendTo(document.body)
            .css({
                zIndex: zIndex,
                width: "100%",
                height: "100%",
                display: "block"
            });
    };

    $.fn.unmask = function (num) {
        if (this.maskui) {
            this.maskui.hide();
            this.maskui.remove();
        }
    };

    $.mask = function (opt) {
        var overlayLoad, settings = {
            zIndex: 3000,
            width: "100%",
            height: "100%",
            display: "block",
            loading: false,
            msg: "正在加载，请稍候！",
            transparent: false
        };
        settings = $.extend({}, settings, opt);
        //是否重绘
        if ($(".body-overlay").length === 0) {

            var overlay = $('<div class="body-overlay"></div>');
            overlay.appendTo(document.body);

            if (settings.loading && !settings.transparent) {
                overlayLoad = $('<div style="z-index:' + (settings.zIndex + 1) + ';" class="loading-mask-img">' + settings.msg + '</div>');
                overlayLoad.appendTo(document.body);
            }

        } else {
            if (settings.loading && $(".loading-mask-img").length === 0) {
                overlayLoad = $('<div style="z-index:' + (settings.zIndex + 1) + ';" class="loading-mask-img">' + settings.msg + '</div>');
                overlayLoad.appendTo(document.body);
            } else if (!!settings.loading) {
                $('.loading-mask-img').show();
            } else {
                $('.loading-mask-img').hide();
            }

            $(".body-overlay").show();
        }

        //样式
        $(".body-overlay").css({
            zIndex: settings.zIndex,
            width: settings.width,
            height: settings.width,
            display: settings.display
        });

        //透明
        if (settings.transparent) {
            $(".body-overlay").css({opacity: '0'});
            $(".body-overlay").css({filter: 'alpha(opacity=0)'});
        } else {
            $(".body-overlay").css({
                opacity: .3,
                filter: 'alpha(opacity=30)'
            });
        }
    };

    $.unmask = function (num) {
        $(".body-overlay").hide();
        $(".loading-mask-img").hide();
    };

})(jQuery);

//备份jquery的ajax方法
$._ajax = $.ajax;
/**
 * 重载ajax通用方法
 * @author zhangbiying
 * @date   2016-5-8
 * @param  {[type]}   opt [description]
 * @return {[type]}       [description]
 * option配置项参数说明
 * url:请求路径
 * data:请求参数
 * type:请求类型(默认"POST")
 * errorMsg:是否显示错误提示信息(默认为false);
 * opt.noMsg:是否显示成功提示细心(默认为false);
 * timeout:请求超时提醒(默认为120000);
 * mask:是否遮罩(默认为true)
 */
var ajaxArr = [];
var defaultOpt = {
    actionFlag: true,
    mask: true
};
$.ajax = function (opt) {
    opt = $.extend({}, defaultOpt, opt);
    var fn = {
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        success: function (data, textStatus) {
        },
        beforeSend: function (jqXHR, settings) {
        }
    };
    if (opt.error) {
        fn.error = opt.error;
    }
    if (opt.success) {
        fn.success = opt.success;
    }
    if (opt.beforeSend) {
        fn.beforeSend = opt.beforeSend;
    }
    if (opt.actionFlag && opt.url.indexOf("?") === -1) {
        if (opt.url && opt.url.indexOf(".action") > -1) {
            opt.url = opt.url.substr(0, opt.url.length - 7);
        }
        if (opt.url.indexOf(".js") === -1 && opt.url.indexOf(".html") === -1 && opt.url.indexOf(".tpl") === -1) {
            opt.url += ".action";
        }
        opt.url += "?time=" + new Date().getTime();
    }
    //ie789下存在先出发blur再出发keydown事件，所有的验证请求都不加遮罩，实现方式有待改善
    if (!opt.isValid) {
        if (ajaxArr.length > 20) {
            /*$.say("请求次数过多, 休息一会吧", "success");*/
            $.toast({
                message: "请求次数过多, 休息一会吧",
                state: false
            });
            return;
        }

        var flag = true;
        if (opt.mask == false) {
            flag = false;
        }
        fn.mask = flag;

        //前后都加了延时判断 以免后面不会unmask
        if (ajaxArr.length === 0 && fn.mask) {
            setTimeout(function () {
                if (ajaxArr.length > 0) {
                    $.mask({
                        loading: true
                    });
                }
            }, 20);
        }
        ajaxArr.push(opt);
    }

    opt.type = opt.type ? opt.type : "POST";
    opt.plugin = opt.plugin == null ? true : opt.plugin;
    opt.timeout = opt.timeout ? opt.timeout : 120000;
    /*if (opt.https) {
     if (opt.url.indexOf("http") == -1) {
     opt.url = "http://" + window.location.hostname + opt.url;
     }
     opt.url = opt.url.replace(/^http/, "https")
     }*/
    var _opt = $.extend(opt, {
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            var text = XMLHttpRequest.responseText;
            if (text && text.indexOf("this_is_login_input_title") !== -1) {
                // 隐藏OCX
                $('object').hide();

                $.alert({
                    module: true,
                    info: "登陆超时",
                    title: "提醒",
                    isShowClose: true,
                    sureBtn: null
                });
                ajaxArr.shift();

                if (ajaxArr.length === 0) {
                    $.unmask();
                }
                fn.error(XMLHttpRequest, textStatus, errorThrown);
                setTimeout(function () {
                    location.reload();
                }, 1000);
            } else {
                ajaxArr.shift();
                if (ajaxArr.length === 0) {
                    $.unmask();
                }
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            }
        },
        success: function (data, textStatus) {
            if (!opt.isValid) {
                ajaxArr.shift();
                if (ajaxArr.length === 0) {
                    setTimeout(function () {
                        ajaxArr.length === 0 && $.unmask();
                    }, 100);
                }
            }


            //如果是html,有待改善，需改善为正则
            if (typeof data === "string") {
                try {
                    data = $.parseJSON(data);
                } catch (e) {
                    fn.success(data, textStatus);
                    return;
                }
            }
            //登录超时：弹出超时提醒，并且跳转到登录页
            if (data.timeout) {
                $("body").append('<div class="overlay"></div>' +
                    '<div class="alert alert-danger alert-dismissible alert-base fade in" role="alert">' +
                        /*'<button type="button" class="close hide" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+*/
                    '<h4>超时提醒</h4>' +
                    '<p>登录超时，请重新登录！</p>' +
                    '</div>');
                setTimeout(function () {
                    $(".overlay").remove();
                    $(".alert").remove();
                    window.location.href = basePath + "/";//跳到登录页
                }, 1000);
                return;
            }
            //判断是否是ajax url重定向
            if (data.redirect) {
                window.location.href = basePath + data.url;//跳到重定向页
            }
            if (opt.plugin) { //如果是插件
                fn.success(data, textStatus);
                return;
            }

            /*if (typeof data.sessionStatus === "string" && data.sessionStatus === "timeout") {
             return;
             }*/
            if (!data.success && !data.redirect) { //若success为false，则显示提示信息
                $.toast({
                    message: data.message,
                    state: false
                });
                return;
            }
            /*if (data.message) {
             new Toast({context: $('body'), message: data.message, left: "50%", top: "50%"}).show();
             }*/
            fn.success(data.data, data.message, data.code, textStatus);
        },
        beforeSend: function (jqXHR, settings) {
            fn.beforeSend(jqXHR, settings);
        }
    });
    return $._ajax(_opt);
};

/**
 * 获取密码的强度
 * 等级0（风险密码）：密码长度小于8位，或者只包含4类字符中的任意一类，或者密码与用户名一样，或者密码是用户名的倒写。
 * 等级1（弱密码）：包含两类字符，且组合为（数字+小写字母）或（数字+大写字母），且长度大于等于8位。
 * 等级2（中密码）：包含两类字符，且组合不能为（数字+小写字母）和（数字+大写字母），且长度大于等于8位。
 * 等级3（强密码）：包含三类字符及以上，且长度大于等于8位。
 * @author chenguanbin
 * @date   2016-01-27
 * @param  {String}   szPwd 密码
 * @param  {String}   szUser 用户名
 * @return {Number}     密码强度
 */
$.getPwdRank = function (szPwd, szUser) {
    var iRank = 0;
    szUser = szUser ? szUser : "";
    szPwd.match(/[a-z]/g) && iRank++;
    szPwd.match(/[A-Z]/g) && iRank++;
    szPwd.match(/[0-9]/g) && iRank++;
    szPwd.match(/[^a-zA-Z0-9]/g) && iRank++;
    iRank = (iRank > 3 ? 3 : iRank);
    if (szPwd.length < 8 || iRank === 1 || szPwd === szUser || szPwd === szUser.split("").reverse().join("")) {
        iRank = 0;
    }
    if (iRank === 2) {
        if ((szPwd.match(/[0-9]/g) && szPwd.match(/[a-z]/g)) || (szPwd.match(/[0-9]/g) && szPwd.match(/[A-Z]/g))) {
            iRank = 1;
        }
    }
    return iRank;
};

/**
 * 自定义获取表单值并转成JSON的方法
 * @author zhengjunling
 * @date   2016-05-14
 */
(function ($) {
    $.fn.serializeJson = function (opts) {
        var that = this;
        var defaults = {
            allowDisabled: true,//是否允许获取设置为disabled的表单元素的值
            allowHidden: true,//是否允许获取隐藏的表单元素的值
            except: []
        };
        var serializeObj = {};
        //通过serializeArray()将表单值存为数组
        var array = that.serializeArray();

        opts = $.extend({}, defaults, opts);
        if (opts.allowDisabled) {
            that.find("input[name]:disabled, textarea[name]:disabled, select[name]:disabled").each(function () {
                array.push({
                    name: $(this).attr("name"),
                    value: $(this).val()
                })
            })
        }
        $(array).each(function () {
            //已经存在相同的name
            if (serializeObj[this.name]) {
                //值是数组，则将当前值插入数组,否则，将已有的值和当前值合并为数组
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        if (!opts.allowHidden) {
            that.find("input[name]:hidden, textarea[name]:hidden, select[name]:hidden").each(function () {
                var name = $(this).attr("name");
                if (that.find("[name=" + name + "]:visible").length) return;
                delete serializeObj[name];
            })
        }
        if (opts.except.length) {
            $.each(opts.except, function () {
                delete serializeObj[this];
            })
        }
        return serializeObj;
    }
})(jQuery);


/**
 * 表单填充赋值
 * @author zhengjunling
 * @date   2016-05-17
 */
(function ($) {
    $.fn.loadForm = function (jsonData) {
        var $formEl = this.find("input,select,textarea");
        $formEl.each(function () {
            var key = $(this).attr("name");
            var value = jsonData[key];
            var tagName = $(this).get(0).tagName;
            var type = $(this).attr("type");
            if (tagName == 'INPUT') {
                switch (type) {
                    case 'radio':
                        if ($(this).val() == value) {
                            $(this).trigger("click");
                        }
                        break;
                    case 'checkbox':
                        for (var i = 0; i < value.length; i++) {
                            if ($(this).val() == value[i]) {
                                $(this).prop('checked', true);
                            }
                        }
                        break;
                    default:
                        $(this).val(value);
                        break;
                }
            } else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
                $(this).val(value);
            }
        })
    }
})(jQuery);

/**
 * 下拉框初始化
 * @author zhengjunling
 * @date   2016-05-21
 */
(function ($) {
    $.fn.loadSelect = function (data, options) {
        var html = "";
        var defaults = {
            key: "value",
            value: "name"
        };
        options = $.extend({}, defaults, options);
        this.empty();
        $.each(data, function () {
            html += '<option value=' + this[options.key] + '>' + this[options.value] + '</option>';
        });
        this.append(html);
    }
})(jQuery);

/**
 * 数位补足
 * @author zhengjunling
 * @date   2016-05-25
 */
(function ($) {
    $.pad = function (num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    }
})(jQuery);

/**
 * 获取url参数值
 * @author zhengjunling
 * @date   2016-05-17
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

/**
 * 提取bootstrapTable公用配置项
 * @author zhengjunling
 * @date   2016-05-14
 */
var bsTableOptions = {
    queryParams: function (params) {  //请求配置参数
        return {
            pageSize: params.limit,   //页面大小
            pageNo: params.pageNo,  //页码
            searchKey: params.search
        };
    },
    striped: true,//条纹
    pagination: true,//是否分页
    idField: "id",//主键
    pageList: "[10, 25, 50, 100]",//分页可选项
    sidePagination: "server",
    dataField: "results",
    clickToSelect: true,
    onLoadSuccess: function (data, self) {
        if (typeof data == "undefined") return;
        if (data.paginator.total == 0) {//若传回的总数据为0，则隐藏分页栏
            $(".fixed-table-pagination").hide();
        } else {//若传回的总数据不为0，则显示分页栏
            $(".fixed-table-pagination").show();
        }
        self.resetView();
    },
    onLoadError: function (status, self) {
        $(".fixed-table-pagination").hide();
        self.resetView();
    }
};

/**
 * 提取bootstrapTable不分页公用配置项
 * @author 章碧莹
 * @date   2016-10-10
 */
var tableOptionsNopage = {
    queryParams: function (params) {  //请求配置参数
        return {
            pageSize: params.limit,   //页面大小
            pageNo: params.pageNo,  //页码
            searchKey: params.search
        };
    },
    striped: true,//条纹
    pagination: false,//是否分页
    idField: "id",//主键
    dataField: "results",
    clickToSelect: true,
    onLoadError: function (status, self) {
        $(".fixed-table-pagination").hide();
        self.resetView();
    }
};

/**
 * 提取echarts公用配置项
 * @author zhengjunling
 * @date   2016-05-14
 */
var echartOptions = {
    grid: {//直角坐标系网格
        show: true,
        borderColor: '#f0f0f0'
    },
    xAxis: {//x轴
        axisLine: {//x轴线
            lineStyle: {
                color: '#f0f0f0'
            }
        },
        axisTick: {//坐标轴刻度
            show: false
        },
        splitLine: {//X轴竖线
            lineStyle: {
                color: ['#f0f0f0']
            }
        }
    },
    yAxis: {
        nameTextStyle: {//坐标轴名称样式
            color: '#999'
        },
        axisLine: {
            lineStyle: {
                color: '#f0f0f0'
            }
        },
        axisTick: {
            show: false
        },
        splitLine: {
            lineStyle: {
                color: ['#f0f0f0']
            }
        }
    }
}

Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 毫秒类型的时间转化对讲字符显示时间格式
 * @author zhangbiying
 * @date   2016-5-17
 * @return {[type]}   [String]
 */
(function ($) {
    $.dateToString = function (v, type) {
        type = type || "yyyy-MM-dd";
        if (v == 0 || v == "" || v == null)
            return "";
        if (v.time != null)
            v = v.time;
        var date = new Date();
        if (typeof v == "string") {
            v = parseInt(v);
        }
        date.setTime(v);
        if ((v + "").length != 13) {
            v = v + "";
            date.setYear(parseInt(v.substr(0, 4)));
            date.setMonth(parseInt(v.substr(4, 2).replace(/^0*/, "")) - 1);
            date.setDate(parseInt(v.substr(6, 2).replace(/^0*/, "")));
            if (type.indexOf("HH:mm") > -1) {
                var tmpData = v.substr(8, 2).replace(/^0*/, "");
                date.setHours(tmpData == "" ? 0 : parseInt(tmpData));
                tmpData = v.substr(10, 2).replace(/^0*/, "");
                date.setMinutes(tmpData == "" ? 0 : parseInt(tmpData));
            }
        }
        return date.format(type);
    }
})(jQuery);

/**
 * 打开新页面并利用post方式传递参数
 * @author zhangbiying
 * @date   2016-5-23
 * @return {[type]}   [String]
 */
$.newWindowWithPostData = function (url, name, param) {
    var newWindow = window.open(basePath + "/views/common/jsp/export-blank.jsp", '', "height=230, width=500,top=400,left=700, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
    if (!newWindow) {
        return false;
    }
    var html = "<html><head></head><body>"
        + "<form id='form' method='post' action='"
        + url + "'>";

    if (param) {
        $.each(param, function (n, index) {
            html = html + "<input type='hidden' name='" + n + "' value='" + index + "'/>";
        });
        /*for (var i = 0; i < paramNames.length; i++) {
         postDataHtml = postDataHtml + "<input type='hidden' name='" + paramNames[i] + "' value='" + paramValues[i] + "'/>";
         }*/
    }

    html = html + "</form><script type=\"text/javascript\">document.getElementById(\"form\").submit()</script>";
    newWindow.document.write(html);
    return newWindow;
};

/**
 * 格式化元
 * @author zhangbiying
 * @date   2016-05-25
 */
$.formatMoney = function (data, unit) {
    var option = {};
    switch (unit) {
        case 2:
            option.data = Math.round(data / 100000000);
            /*(Math.round((data/100000000)*100)/100).toFixed(2)*/
            option.unitName = "亿元";
            option.unit = 2;
            break;
        case 1:
            option.data = Math.round(data / 10000);
            /*(Math.round((data/10000)*100)/100).toFixed(2)*/
            option.unitName = "万元";
            option.unit = 1;
            break;
        case 0:
            option.data = data/*.toFixed(2)*/;
            option.unitName = "元";
            option.unit = 0;
            break;
        default:
            if (data > 100000000) {
                option.data = Math.round(data / 100000000);
                /*(Math.round((data/100000000)*100)/100).toFixed(2)*/
                option.unitName = "亿元";
                option.unit = 2;
            } else if (data > 10000) {
                option.data = Math.round(data / 10000);
                /*(Math.round((data/10000)*100)/100).toFixed(2)*/
                option.unitName = "万元";
                option.unit = 1;
            } else {
                option.data = data/*.toFixed(2)*/;
                option.unitName = "元";
                option.unit = 0;
            }
    }
    return option;
};

/**
 * 格式化元,以最低单位为单位
 * @author zhangbiying
 * @date   2016-05-25
 */
$.formatMoneys = function (datas) {
    var unit = 2,
        options = [];
    //计算最小单位
    $.each(datas, function (n, index) {
        if ($.formatMoney(index).unit < unit) {
            unit = $.formatMoney(index).unit;
        }
    });
    $.each(datas, function (n, index) {
        options.push($.formatMoney(index, unit));
    });
    return options;
};

/**
 * 格式化钱（千分法，加逗号）
 * @author zhangbiying
 * 参数说明：s 需要转化的字符串  n 小数点保留位数
 * @date   2016/06/07
 */
(function ($) {
    $.fmoney = function (s, n) {
        n = n >= 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1] ? s.split(".")[1] : "",
            t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return n == 0 ? t.split("").reverse().join("") : t.split("").reverse().join("") + "." + r;
    }
})(jQuery);


/**
 * 自定义上传控件外观
 * @author zhengjunling
 * @date   2016-05-31
 */
/*(function ($) {
 var UploadUI = function (field, options) {
 this.options = options;
 this.$field = $(field);
 this.init();
 }

 UploadUI.prototype.init = function () {
 var that = this;
 var fieldClass = that.$field.attr("class");
 that.$submitbtn = $(that.$field.data("submit"));
 that.$field.hide();
 that.$el = $('<div class="file-upload ' + fieldClass + '">' +
 '<div class="file-name"></div>' +
 '<div class="file-choose">' +
 '<span class="divider"></span><a class="a-link">选择文件</a></div></div>');

 that.$el.insertBefore(that.$field);

 that.$el.on("click", function () {
 that.$el.next("[type=file]").off("change").on("change", function () {
 var value = $(this).val();
 if (value != "") {
 that.$submitbtn.removeAttr("disabled");
 }
 else {
 that.$submitbtn.attr("disabled", "disabled");
 }
 that.$el.find(".file-name").html(value);
 })
 that.$el.next("[type=file]").trigger("click");
 })
 }
 UploadUI.prototype.cleanValue = function () {
 this.$el.find(".file-name").html("");
 this.$field.val("");
 this.$submitbtn.attr("disabled", "disabled");
 }

 $.fn.uploadUI = function (options) {
 return this.each(function () {
 var $me = $(this),
 instance = $me.data('uploadUI');
 if (!instance) {
 $me.data('uploadUI', new UploadUI(this, options));
 }
 if ($.type(options) === 'string') {
 instance[options]();
 }
 });
 };

 $(function () {
 return new UploadUI($('[data-uploadUI]'));
 });
 })(jQuery);*/

/**
 * 在bootstrap modal基础上封装调用方法
 * @author zhengjunling
 * @date   2016-05-31
 */
(function ($) {
    $.modal = function (options) {

    }
})(jQuery);

//出发tip提示泡
$('[data-toggle="tooltip"]').tooltip();


/**
 * 导航菜单交互
 * @author zhengjunling
 * @date   2016-06-02
 */
(function ($) {
    var speed = 250;
    var $nav = $(".sidebar-nav");
    $.extend({
        resetNav: function () {
            $nav.find("li").removeClass("active is-open");
            $nav.find("ul").hide();
        }
    });
    $(document).on("click", ".sidebar-nav li>a", function () {
        var $parent = $(this).parent();
        var $childNav = $parent.children("ul");
        if ($childNav.length) {
            $parent.toggleClass("is-open").siblings().removeClass("is-open").children("ul").slideUp(speed);
            $childNav.slideToggle(speed);
            return false;
        } else {
            //判断父级菜单有无open
            if (!$parent.parent().parent().hasClass("is-open")) {
                $parent.parent().parent().addClass("is-open");
                $parent.parent().parent().children("ul").slideDown(speed);
            }
            $(".sidebar-nav").find("li").removeClass("active");
            $parent.addClass("active");
            if ($parent.closest("ul").hasClass("nav")) {
                $(".sidebar-nav").children().removeClass("is-open").children("ul").slideUp(speed);
            }
        }
    })
})
(jQuery);
/**
 * html转义
 * @author zhengjunling
 * @date   2016-06-03
 */
function html_encode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&gt;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    //s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
}

function html_decode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    //s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}


//搜索框清除按钮点击事件and dropdown下拉控件阻止冒泡
+function () {
    $(document).on("click", ".search-clear", function () {
        $(this).prev().val("");//清空输入框
    });
    $(document).on("click", ".dropdown-more-menu", function (e) {
        e.stopPropagation();
    });
    $(document).on("click", ".dropdown-areaSelect .dropdown-menu", function (e) {
        e.stopPropagation();
    });
    //$(".search-clear").on("click", function (e) {
    //
    //})
}();

//监听元素的resize事件
+(function ($, h, c) {
    var a = $([]),
        e = $.resize = $.extend($.resize, {
            "delay": 0,
            "throttleWindow": true
        }),
        i,
        k = "setTimeout",
        j = "resize",
        d = j + "-special-event",
        b = "delay",
        f = "throttleWindow";
    $.event.special["resize"] = {
        setup: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var $this = $(this);
            a = a.add($this);
            $.data(this, d, {w: $this.width(), h: $this.height()});
            if (a.length === 1) {
                g();
            }
        },
        teardown: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var $this = $(this);
            a = a.not($this);
            $this.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        },
        add: function ($this) {
            if (!e[f] && this[k]) {
                return false
            }
            var n;

            function m(s, o, p) {
                var el = $(this),
                    r = $.data(this, d);
                r.w = o !== c ? o : el.width();
                r.h = p !== c ? p : el.height();
                n.apply(this, arguments)
            }

            if ($.isFunction($this)) {
                n = $this;
                return m
            } else {
                n = $this.handler;
                $this.handler = m;
            }
        }
    };
    function g() {
        i = h[k](function () {
            a.each(function () {
                var n = $(this),
                    m = n.width(),
                    l = n.height(),
                    o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger("resize", [o.w = m, o.h = l]);
                }
            });
            g()
        }, e[b])
    }
})(jQuery, this);


/**
 * 日期选择控件区间关联
 *
 * @author zhengjunling
 * @date 2016-06-30
 */

(function ($) {
    $(document).on("changeDate", ".datepicker", function () {
        var linkField = $(this).attr("data-linkField");
        var dateType = $(this).attr("data-dateType");
        var date = $(this).datetimepicker("getDate");
        if (!linkField) {
            return;
        }
        else {
            switch (dateType) {
                case "start":
                    $(linkField).datetimepicker("setStartDate", date);
                    break;
                case "end":
                    $(linkField).datetimepicker("setEndDate", date);
            }
        }
    })
})(jQuery);


//时间格式化方法
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

$(document).on("keyup", "input", function (e) {
    if (e.keyCode == 32) {
        $(this).val($.trim($(this).val()));
        if ($(this).parents("form").data("bootstrapValidator")) {
            //去掉空格后，将输入框的校验状态设置为未校验。
            $(this).parents("form").data("bootstrapValidator").updateStatus($(this).attr("name"), 'NOT_VALIDATED');
            if ($(this).val().length != 0) {//若不为空，则触发校验
                $(this).parents("form").data("bootstrapValidator").validateField($(this).attr("name"));
            }
        }
    } else {
        return
    }

});

//文件域input框重置方法
//f为文件域input框的dom节点
$.clearInputFile = function (f) {
    if (f.value) {
        try {
            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
        } catch (err) {
        }
        if (f.value) { //for IE5 ~ IE10
            var form = document.createElement('form'), ref = f.nextSibling, p = f.parentNode;
            form.appendChild(f);
            form.reset();
            p.insertBefore(f, ref);
        }
    }
};

//文件上传样式点击联动方法
function getFileValue(el, name) {
    $('[name=' + name + ']').val($(el).val());
}

/**
 * 调整图片大小
 * @author chenguanbin
 * @date   2016-06-20
 * @params {Object} $wrap: 容器jQuery对象
 * @params {Object} $img: 图片jQuery对象
 * @params {Number} imgWidth: 图片原始宽度
 * @params {Number} imgHeight: 图片原始高度
 */
$.imgResize = function ($wrap, $img, imgWidth, imgHeight) {
    var wrapWidth = $wrap.width(), // 容器宽度
        wrapHeight = $wrap.height(); // 容器高度
    // 原图高宽小于容器高宽，则使用原图大小
    if (imgWidth < wrapWidth && imgHeight < wrapHeight) {
        $img.removeClass('broad').removeClass('narrow');
    }
    // 图片宽高比大于容器宽高比，添加类 broad
    else if (imgWidth / imgHeight > wrapWidth / wrapHeight) {
        $img.addClass('broad').removeClass('narrow');
    }
    // 图片宽高比小于容器宽高比，添加类 narrow
    else {
        $img.removeClass('broad').addClass('narrow');
    }
};

var videoTemplate =  _.template([
    '<% for(var i=0; i<catchList.length; i++) { %>',
    '<li data-url="<%= catchList[i].imgUrl %>" data-itemid="<%= catchList[i].randomPatrolItemId %>">',
    '  <div class="video-catch-img">',
    '    <img src="<%= catchList[i].imgUrl%>">',
    '    <span>点击涂鸦</span>',
    '    <i class="glyphicon glyphicon-remove-circle"></i>',
    '  </div>',
    '</li>',
    '<% } %>'
].join(''));


/**
 * 定时函数
 * @param f 定时任务执行的函数
 * @param start // 何时开始定时任务
 * @param interval // 发定时任务的频率
 * @param end // 计时，用于何止停止定时任务
 * @param obj // 用来绑定设置了定时任务的flag
 */
$.inovke = function (f, start, interval, end,obj) {
    if (!start) start = 0;    // 默认设置0毫秒
    if (arguments.length <= 2) // 单次调用模式
        setTimeout(f, start);
    else {
        setTimeout(repeat, start);

        function repeat() {
            obj.timer = setInterval(f, interval); // 循环调用f
            // 在end毫秒后停止调用
            if (end) setTimeout(function () {
                clearInterval(obj.timer)
            }, end);
        }
    }
};


/*对话框弹出消失方法绑定显示隐藏OCX控件*/
$('body').find('.modal')
    .on('shown.bs.modal',function(){
        if($("object").length > 0){
            if(!window.TEMPOBJECT){
                window.TEMPOBJECT=[];
            }
            $("object:visible").each(function(i,el){
                window.TEMPOBJECT.push($(el).attr("id"));
            });
            $("object:visible").hide();
        }
    })
    .on('hidden.bs.modal', function (e) {
        $.each(window.TEMPOBJECT,function(i,el){
            $("#"+el).show();
        });
        /*for(var a in window.TEMPOBJECT){
            $("#"+window.TEMPOBJECT[a]).show();
        }*/
    });

















