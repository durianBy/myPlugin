/**
 * 项目所有自定义组件源码均在这里
 * Created by zhangbiying on 2016/10/19.
 */



/**
 * Toast效果，主要是用于在不打断程序正常执行的情况下显示提示数据
 * @author zhangbiying
 * @date   2016-05-25
 * @param config
 * @return
 */
(function ($) {
    var Toast = function (options) {
        this.opts = $.extend({
            context: $('body'),//上下文
            class:"",//浮动形式
            message: "",//显示内容
            time: 1000,//持续时间
            state: true//错误状态还是正确状态
        }, options);
        this.init();
    };

    Toast.prototype = {
        init: function () {
            var opts = this.opts;
            $("#toastMessage").remove();
            //设置消息体
            this.$el = $(
                '<div class="toast '+opts.class+'" id="toastMessage">' +
                    '<iframe id="iframeToast"+ src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="display:none;position:absolute; visibility:inherit;margin:-10px 0 0 -20px;height:100%;  width:100%; z-Index:-1;border-radius: 25px;background: rgba(0, 0, 0)"  filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)> </iframe>'+
                '   <i class="glyphicon ' + (opts.state ? 'glyphicon-ok' : 'glyphicon-remove') + '"></i>' +
                '   <span>' + opts.message + '</span>' +
                '</div>');
            this.$el.appendTo(opts.context).css({"margin-left": -this.$el.width() / 2}).hide();
        },

        //显示动画
        show: function () {
            this.$el.fadeIn(this.opts.time / 2,function(){
                $("#iframeToast").css("display","block")
            }).delay(1000).fadeOut(this.opts.time / 2,function(){
                $("#iframeToast").css("display","none")
            });
        }
    };

    $.toast = function (config) {
        new Toast(config).show();
    };
})(jQuery);


/**
 * 密码强度级别实时显示
 * @author zhengjunling
 * @date   2016-05-30
 */

(function ($) {
    var PwdStrength = function (element, options) {
        this.$field = $(element);
        this.opts = $.extend({}, {
            level: 4,
            text: ["风险", "弱", "中", "强"]
        }, this.$field.data(), options);
        this.init();
    };
    PwdStrength.prototype = {
        init: function () {
            var that = this;
            that.$el = $('<div class="pwd-strength"><ul></ul><div class="strength-text"></div></div>').insertAfter(that.$field);
            for (var i = 0; i < that.opts.level; i++) {
                that.$el.find("ul").append("<li><span></span></li>");
            }
            that.$field.on("input keyup", function () {
                var value = $(this).val();
                if (value == "") {
                    that.hide();
                    return;
                }
                that.show();
                var level = that.getLevel(value);
                that.$el.attr("strengthLevel", level);
                that.$el.find("li").removeClass("active").slice(0, level + 1).addClass("active");
                that.$el.find(".strength-text").html(that.opts.text[level]);
            })
        },
        hide: function () {
            this.$el.removeAttr("strengthLevel").hide();
        },
        show: function () {
            this.$el.show();
        },
        getLevel: function (value) {
            return $.getPwdRank(value, "");
        },
        destroy: function () {
            this.$el.remove();
        }
    };
    $.fn.pwdStrength = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('pwdStrength')
            var options = typeof option == 'object' && option

            if (!data && option == 'destroy') return
            if (!data) $this.data('pwdStrength', (data = new PwdStrength(this, options)))
            if (typeof option == 'string') data[option]()
        })
    };
    $(function () {
        $('[data-role="pwdStrength"]').pwdStrength();
    })
})(jQuery);

/**
 * 提示信息弹出窗
 * 注：有按钮，需要手动关闭，点击有回调
 * 注：需要依赖插件<Bootstrap-modal><underscore>
 *
 * @author chenguanbin
 * @date 2016-04-05
 */
+function ($) {
    'use strict';

    var Notice = function (options) {
        this.options = $.extend(true, {}, Notice.DEFAULTS, options);
    };

    Notice.DEFAULTS = {
        type: 'info', // 提示类型，包括: 'warning', 'info', 'success', 'danger'
        height: '',
        width: 340,
        title: '信息提示', // 标题
        message: '', // 提示信息
        btnClick : false,//是否已点击按钮
        buttons: [{ // 按钮
            type: 'primary', // 按钮类型，包括: 'warning', 'info', 'success', 'danger'
            text: '确定', // 按钮信息
            close: true, // 点击按钮是否关闭弹出窗
            onclick: null // 按钮点击回调事件
        }, { // 按钮
            type: 'white', // 按钮类型，包括: 'warning', 'info', 'success', 'danger'
            text: '确定', // 按钮信息
            close: true, // 点击按钮是否关闭弹出窗
            onclick: null // 按钮点击回调事件
        }]
    };

    Notice.template = {
        notice: _.template([
            '<div class="modal fade modal-notice modal-notice-<%= notice.type %>" tabindex="-1" role="dialog">',
            '  <div class="modal-dialog iep-dialog" style="height: <%= notice.height %>px; width: <%= notice.width %>px;">',
            '    <div class="modal-content">',
            '      <div class="modal-header iep-dialog-head bg-primary">',
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '        <div class="modal-title iep-dialog-title"><%= notice.title%></div>',
            '      </div>',
            '      <div class="modal-body iep-dialog-body">',
            '        <span class="icon-Warning"></span>',
            '        <span class="text"><%= notice.message %></span>',
            '      </div>',
            '      <div class="modal-footer iep-dialog-footer">',
            '        <% for(var i=0; i< notice.buttons.length; i++) { %>',
            '          <button <% if(notice.buttons[i].close) { %> data-dismiss="modal" <% } %> class="btn btn-<%= notice.buttons[i].type %>"><%= notice.buttons[i].text%></button>',
            '        <% } %>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>',
        ].join(''))
    };

    Notice.prototype = {
        render: function () {
            var that = this;
            var buttons = this.options.buttons,
                noticeHtml = '',
                i;
            noticeHtml = Notice.template.notice({
                notice: this.options
            });
            // 将DOM元素添加到body上
            $('body').append(noticeHtml);

            // notice关闭后将添加上的元素移除
            $('body').find('.modal-notice')
                .modal('show')
                .on('shown.bs.modal', function (e) {
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
                    if(!that.options.btnClick && that.options.hideCallBack){
                        that.options.hideCallBack();
                    }
                    $(this).remove();
                    $.each(window.TEMPOBJECT,function(i,el){
                        $("#"+el).show();
                    });
                });

            // 遍历buttons，绑定onclick事件
            for (i = 0; i < buttons.length; i++) {
                if (buttons[i].onclick) {
                    // 在循环中绑定事件，使用闭包传递参数
                    (function (index) {
                        $('body').find('.modal-notice .modal-footer button').eq(index).on('click', function (event) {
                            that.options.btnClick = true;
                            buttons[index].onclick.call(this);
                            event.preventDefault();
                        });
                    })(i);
                }
            }
        },

        close: function () {
            $('body').find('.modal-notice').modal('hide');
        }
    };

    function Plugin(option) {
        var options = typeof option == 'object' && option,
            notice = new Notice(options);

        /* Notice未打开，则渲染 */
        if (!$('body').find('.modal-notice').length) {
            notice.render();
        }

        if (typeof option == 'string') {
            notice[option].call(notice);
        }
    }

    var old = $.notice;

    $.notice = Plugin;

    $.notice.noConflict = function () {
        $.notice = old;
        return this;
    };
}(jQuery);

/**
 * 更多条件数据获取与写入,获取更多条件勾选数据
 * @author zhangbiying
 * 参数说明：$el 需要插入的dropdwon容器  ul action地址
 * @date   2016/07/12
 */
(function ($) {
    $.moreMenu = function (option) {
        var url = option.url,
            $el = option.$el,
            $dropdown = $(option.id)
        $.ajax({
            url: url,
            data: {
                gatewayNo: option.gatewayNo
            },
            plugin: false,
            success: function (data) {
                if (data && data.length > 0) {
                    var moreItem = '';
                    $.each(data, function (n, index) {
                        moreItem += '<li><label class="menuName">' + index.name + '：</label>' + '<a class="no-limited" querytype="' + index.value[0].querytype + '">不限</a>';
                        if (index.value.length > 0) {
                            $.each(index.value, function (i, el) {
                                moreItem += '<label class="label-checkbox"><input type="checkbox" querytype="' + el.querytype + '" code="' + el.code + '">' + el.name + '</label>';
                            })
                        }
                        moreItem += '</li>';
                    });
                    moreItem += '<a class="resetMoreBtn">重置筛选条件</a>';
                    $el.empty();
                    $el.append(moreItem);
                    //绑定下拉菜单收起事件
                    $dropdown.parent().on("hidden.bs.dropdown",function(){
                        //获取勾选数据
                        var length = $("[type=checkbox]:checked",$el).length;
                        if(length){//若更多条件有勾选
                            $dropdown.addClass("mark-red");
                        }else{
                            $dropdown.removeClass("mark-red");
                        }
                    })
                } else {
                    //若获取到的更多条件为空，更多条件按钮置灰
                    $el.siblings("a").addClass("disabled");
                    /*$.toast({
                     message: "暂无更多条件",
                     state: false
                     });*/
                }
            }
        });
    };
    //获取更多条件勾选数据情况
    $.fn.moreMenuGetData = function (data) {
        var $this = this;
        $("[type=checkbox]:checked", $this).each(function (n, el) {
            var queryType = $(el).attr("querytype"),
                code = $(el).attr("code");
            if (!data[queryType]) { //若未定义，则先定义
                data[queryType] = [];
                data[queryType] += code;
            } else {
                data[queryType] += ',' + code;
            }
        });
    };

    $(document).on("click change", ".label-checkbox>[type=checkbox],a.no-limited,a.resetMoreBtn", function (e) {
        var $el = $(e.currentTarget),
            $parentLi = $el.parents("li"),
            querytype = $el.attr("querytype"),

            $dropDownMenu = $el.parent(),
            $parentLabel = $(this).parent(),
            $noLimit = $('.no-limited[querytype="'+querytype+'"]',$parentLi);
        if($el.attr("type")){//checkbox点击逻辑
            if ($el.is(':checked')) {
                $parentLabel.addClass("active");//label标签加active
                if(!$noLimit.hasClass('usable')){
                    $noLimit.addClass("usable");
                }
            } else {
                $parentLabel.removeClass("active");
                if($noLimit.hasClass('usable')){
                    if($("[type=checkbox][querytype="+querytype+"]:checked",$parentLi).length == 0){
                        $noLimit.removeClass("usable")
                    }
                }
            }
        }else if($el.hasClass("no-limited")){//不限按钮逻辑
            //判断不限按钮是否可用
            if ($el.hasClass("usable")) {
                //本行checkbox取消勾选
                $("[type=checkbox][querytype=" + querytype + "]:checked", $parentLi).each(function (n, el) {
                    $(el).attr("checked", false).trigger("change");
                });
                //不限按钮状态置为不可用
                $el.removeClass("usable")
            }
        }else{//重置筛选按钮逻辑
            e.stopPropagation();
            var $dropDownMenu = $(e.currentTarget).parent();
            $dropDownMenu.find(".label-checkbox").removeClass("active");
            $("input[type=checkbox]", $dropDownMenu).each(function (n, el) {
                $(el).attr("checked", false);
            });
            $(".no-limited", $dropDownMenu).each(function (n, el) {
                $(el).removeClass("usable");
            })
        }

    });
})(jQuery);


