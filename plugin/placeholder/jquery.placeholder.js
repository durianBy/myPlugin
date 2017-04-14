(function(factory) {
    //模块化
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else factory(jQuery);

})(function($) {

    "use strict";

    var Placeholder = function(element, options) {
        this.$el = $(element);
        this.opts = $.extend({}, Placeholder.DEFAULT_OPTIONS, options);
        this.init();
    }


    //控件初始化
    Placeholder.prototype.init = function() {
        var that = this,
            opts = this.opts;

        this.wrapperTag = opts.wrapperTag ? opts.wrapperTag : "div";
        this.placeholder = opts.placeholder ? opts.placeholder : this.$el.attr("placeholder");

        //定义容器
        this.wrapper = $("<" + this.wrapperTag + "/>");
        //定义提示语标签
        this.labelText = $("<span>" + this.placeholder + "</span>");

        if (opts.wrapperClass)
            this.wrapper.addClass(opts.wrapperClass);

        //将表单控件本身的外边距转嫁到容器身上
        this.wrapper.css({
            "position": "relative",
            "display": this.$el.css("display"),
            "margin-top": this.$el.css("margin-top"),
            "margin-left": this.$el.css("margin-left"),
            "margin-right": this.$el.css("margin-right"),
            "margin-bottom": this.$el.css("margin-bottom"),
        })

        //样式拷贝
        this.labelText.css({
            "position": "absolute",
            "display": "inline-block",
            "left": parseInt(this.$el.css("border-top-width")) + 1 + "px",
            "top": this.$el.css("border-left-width"),
            "max-width": "100%",
            "padding-top": this.$el.css("padding-top"),
            "padding-left": this.$el.css("padding-left"),
            "padding-right": this.$el.css("padding-right"),
            "font-size": this.$el.css("font-size"),
            "line-height": this.$el.css("line-height"),
            "color": opts.color,
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            "z-index": 11
        })

        //针对IE浏览器下，textarea默认显示滚动条做处理
        if (this.$el.is("textarea") && this.$el.css("overflow") === "scroll") {
            this.labelText.css({
                "padding-right": parseInt(this.$el.css("padding-right")) + 17 + "px"
            })
        }

        this.$el.css("margin", "0").wrap(this.wrapper).after(this.labelText).removeAttr("placeholder");

        //绑定事件
        this._bindEvents();

    }

    Placeholder.prototype._bindEvents = function() {
        var that = this;

        this.labelText.on("click", function() {
            that.$el.trigger("focus");
        })

        switch (this.opts.trigger) {
            case "input":
                this.$el.on("input.placeholder propertychange.placeholder", function() {
                    var val = $(this).val();
                    if (val) {
                        that.labelText.hide();
                    } else {
                        that.labelText.show();
                    }
                });
                break;
            case "focus":
                this.$el.on("focus.placeholder", function() {
                    that.labelText.hide();
                }).on("blur", function() {
                    if (!$(this).val())
                        that.labelText.show();
                });
                break;
        }

        return this;
    }

    //开放更改提示语api
    Placeholder.prototype.reset = function(text) {
        if (!text) return;
        this.placeholder = text;
        this.labelText.text(text);
    }

    Placeholder.DEFAULT_OPTIONS = {
        placeholder: "",
        wrapperTag: "div",
        wrapperClass: "",
        trigger: "input",
        color: "#999"
    }

    $.fn.placeholder = function(option) {

        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function(i) {
            var $this = $(this),
                tagName = $this[0].tagName,
                data = $this.data('Placeholder'),
                options = 'object' === typeof option && option;

            if (tagName !== "INPUT" && tagName !== "TEXTAREA") {
                return;
            }

            if (!data) {
                data = new Placeholder(this, options);
                $this.data('Placeholder', data);
            }

            if ('string' === typeof option) {
                data[option].apply(data, args);
            }

        });
    }

    $(function() {
        $("[data-role=placeholder]").placeholder();
    })
})
