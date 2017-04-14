(function ($, document) {
    'use strict';

    var $document = $(document);

    var animation = window.requestAnimationFrame;

    Array.prototype.S = String.fromCharCode(2);

    Array.prototype.inArray = function (e) {
        var r = new RegExp(this.S + e + this.S);
        return (r.test(this.S + this.join(this.S) + this.S));
    };

    var Drawingboard = function (element, options) {
        this.$el = $(element);
        this.options = $.extend({}, $.fn.drawingboard.DEFAULT_OPTIONS, options);
        this.init();
    };

    Drawingboard.prototype = {
        paintWidth: 0,
        paintHeight: 0,
        toolMode: null,
        isDrawing: false,
        isMouseHovering: false,
        isTextFocus: false,
        allTools: ["pencil", "rect", "ellipse", "text", "eraser", "clean", "undo", "redo", "complete"],
        allToolsTitle: {
            'pencil': '铅笔',
            'rect': '矩形',
            'ellipse': '椭圆形',
            'text': '文本',
            'clean': '清除',
            'complete': '完成'
        },
        paintTools: ["pencil", "rect", "ellipse", "text", "eraser"],
        controlTools: ["clean", "undo", "redo", "complete"],
        textbox: [],

        //初始化
        init: function () {
            var template = [
                '<div class="db-toolbar-box">',
                '  <div class="db-toolbar"></div>',
                '</div>',
                '<div class="db-body-wrap">',
                '  <div class="db-body">',
                '   <div class="db-canvas-wrap">',
                '    <div class="db-canvas-box">',
                '      <canvas class="img-canvas"></canvas>',
                '      <canvas class="paint-canvas"></canvas>',
                '      <div class="paint-cursor"></div>',
                '    </div>',
                '    </div>',
                '  </div>',
                '</div>',
            ].join('');

            this.$el.addClass("drawingboard").html(template);
            // 增加渲染模板后的回调
            this.options.afterInit && this.options.afterInit();

            this.$toolbar = this.$el.find(".db-toolbar");
            this.$boardBody = this.$el.find(".db-body");
            this.$canvasWrap = this.$el.find(".db-canvas-wrap");
            this.$canvasBox = this.$el.find(".db-canvas-box");
            this.$imgCanvas = this.$el.find(".img-canvas");
            this.$paintCanvas = this.$el.find(".paint-canvas");
            this.$cursor = this.$el.find(".paint-cursor");

            this.toolMode = this.options.activeMode;

            this.imgCtx = this.$imgCanvas[0].getContext && this.$imgCanvas[0].getContext('2d') ? this.$imgCanvas[0].getContext('2d') : null;
            this.paintCtx = this.$paintCanvas[0].getContext && this.$paintCanvas[0].getContext('2d') ? this.$paintCanvas[0].getContext('2d') : null;

            if (!this.imgCtx && !this.paintCtx) return false;

            this.initToolbar(this.options.tools);

            this.loadImg(this.options.src);

            this.initEvents();

            if (animation) requestAnimationFrame($.proxy(this.draw, this));
        },

        //加载工具栏
        initToolbar: function (tools) {
            if (!tools.length) return false;
            this.$toolbar.empty();
            for (var i = 0; i < tools.length; i++) {
                this.addTool(tools[i]);
            }
            this._setToolMode(this.options.activeMode);
        },

        //加载图片
        loadImg: function (src) {
            if (!src && typeof src !== "string") return;
            var that = this;
            var ctx = that.imgCtx;
            var img = new Image();
            img.onload = function () {
                that.$canvasBox.css({
                    "width": this.width,
                    "height": this.height,
                    "margin-top": -this.height / 2,
                    "margin-left": -this.width / 2
                });
                that.$canvasWrap.css({
                    "min-width": this.width,
                    "min-height": this.height
                });
                that.paintWidth = that.$imgCanvas[0].width = that.$paintCanvas[0].width = this.width;
                that.paintHeight = that.$imgCanvas[0].height = that.$paintCanvas[0].height = this.height;

                ctx.clearRect(0, 0, that.paintWidth, that.paintHeight);
                ctx.drawImage(this, 0, 0, that.paintWidth, that.paintHeight);
            };
            img.src = src;
        },

        //事件绑定
        initEvents: function () {
            var that = this;
            var paintClasses = "";
            var controlClasses = "";

            $.each(this.paintTools, function (index) {
                paintClasses += (index == 0 ? "" : ",") + ".db-tool-" + this;
            });

            $.each(this.controlTools, function (index) {
                controlClasses += (index == 0 ? "" : ",") + ".db-tool-" + this;
            });

            this.$toolbar.on("click", paintClasses, function () {
                var toolMode = $(this).data("tool");
                that._setToolMode(toolMode);
            });

            this.$toolbar.on("mousedown", controlClasses, function () {
                $(this).addClass("active");
            });

            this.$toolbar.on("mouseup", controlClasses, function () {
                $(this).removeClass("active");
            });

            this.$toolbar.on("click", ".db-tool-clean", function () {
                that.clean();
            });

            // 点击完成涂鸦按钮
            this.$toolbar.on("click", ".db-tool-complete", function() {
                that.complete();
            });

            this.$canvasBox.on("click", function (e) {
                if (that.toolMode == "text" && !that.isTextFocus) {
                    that._creatTextbox(e);
                    that.isTextFocus = true;
                }
                else {
                    that.isTextFocus = false;
                }
            });

            this.$canvasBox.on("mousedown", function (e) {
                that._onInputStart(e);
            });

            this.$boardBody.on("mousemove", function (e) {
                that._onInputMove(e);
            });

            this.$canvasBox.on("mouseout", function () {
                that._onMouseOut();
            });

            this.$canvasBox.on("mouseover", function (e) {
                that._onMouseOver(e);
            });

            $document.on('mouseup', function () {
                that._onInputStop();
            });

            $document.on('click.textMode', function () {
                if (that.textbox.length && !that.isTextFocus) {
                    $.each(that.textbox, function () {
                        this.removeBox();
                    })
                }
            });
        },

        //添加工具
        addTool: function (toolName) {
            if (this.allTools.inArray(toolName) === false) return false;
            this.$toolbar.append('<div class="db-toolbtn db-tool-' + toolName + '" data-tool=' + toolName + ' title="' + this.allToolsTitle[toolName] + '"></div>');
        },

        //设置当前工具类型
        _setToolMode: function (toolMode) {
            this.$toolbar.find(".db-toolbtn").removeClass("active");
            this.$toolbar.find(".db-tool-" + toolMode).addClass("active");
            this.toolMode = toolMode;
        },

        //绘制开始
        _onInputStart: function (e) {
            if (this.toolMode !== "text") {
                var coords = this.getCoords(e);
                this.isDrawing = true;
                this.currentCoords = this.oldCoords = coords;
                this.oldMidCoords = this._getMidCoords(coords);
                this.currentCanvasSta = this.paintCtx.getImageData(0, 0, this.paintWidth, this.paintHeight);
                if (!animation) this.draw();
                e.stopPropagation();
                e.preventDefault();
            }
        },

        //绘制中
        _onInputMove: function (e) {
            this.currentCoords = this.getCoords(e);
            if (!animation) this.draw();
            //e.stopPropagation();
            e.preventDefault();
        },

        //结束绘制
        _onInputStop: function () {
            this.isDrawing = false;
        },

        //鼠标移出画布后，笔触消失
        _onMouseOut: function () {
            this.isMouseHovering = false;
        },

        //鼠标进入画布，显示笔触
        _onMouseOver: function (e) {
            this.currentCoords = this.getCoords(e);
            if (this.toolMode == "pencil" || this.toolMode == "eraser") {
                this.isMouseHovering = true;
            }
        },

        //绘制
        draw: function () {
            var that = this;
            this.paintCtx.lineCap = this.toolMode === "rect" ? "butt" : "round";
            this.paintCtx.lineJoin = this.toolMode === "rect" ? "miter" : "round";
            this.paintCtx.globalCompositeOperation = this.toolMode === "eraser" ? "destination-out" : "source-over";
            this.paintCtx.lineWidth = this.toolMode === "eraser" ? this.options.eraserSize : this.options.paintSize;
            this.paintCtx.strokeStyle = this.options.color;
            // 画笔圆形笔触控制
            if (this.isMouseHovering) {
                this.$cursor.css({
                    "width": this.paintCtx.lineWidth,
                    "height": this.paintCtx.lineWidth,
                    "top": this.currentCoords.y - this.paintCtx.lineWidth / 2,
                    "left": this.currentCoords.x - this.paintCtx.lineWidth / 2,
                    "background": this.toolMode == "eraser" ? "#000" : this.paintCtx.strokeStyle,
                    "opacity": this.toolMode == "eraser" ? ".4" : "1"
                }).show();
            } else {
                this.$cursor.hide();
            }
            //绘制
            if (this.isDrawing) {
                switch (this.toolMode) {
                    case "pencil":
                    case "eraser":
                        this._drawCurve();
                        break;
                    case "ellipse":
                        this._drawEllipse();
                        break;
                    case "rect":
                        this._drawRect();
                        break;
                }
            }
            if (animation) requestAnimationFrame(function () {
                that.draw();
            });
        },

        //绘制曲线
        _drawCurve: function () {
            var currentMidCoords = this._getMidCoords(this.currentCoords);
            this.paintCtx.beginPath();
            this.paintCtx.moveTo(currentMidCoords.x, currentMidCoords.y);
            this.paintCtx.quadraticCurveTo(this.oldCoords.x, this.oldCoords.y, this.oldMidCoords.x, this.oldMidCoords.y);
            this.paintCtx.stroke();
            this.oldCoords = this.currentCoords;
            this.oldMidCoords = currentMidCoords;
        },

        //绘制椭圆
        _drawEllipse: function () {
            var x = (this.oldCoords.x + this.currentCoords.x) / 2,
                y = (this.oldCoords.y + this.currentCoords.y) / 2,
                a = Math.abs(this.oldCoords.x - this.currentCoords.x) / 2,
                b = Math.abs(this.oldCoords.y - this.currentCoords.y) / 2;
            var k = .5522848, ox = a * k, oy = b * k;
            this.paintCtx.putImageData(this.currentCanvasSta, 0, 0);
            this.paintCtx.beginPath();
            this.paintCtx.moveTo(x - a, y);
            this.paintCtx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
            this.paintCtx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
            this.paintCtx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
            this.paintCtx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
            this.paintCtx.closePath();
            this.paintCtx.stroke();
        },

        //绘制矩形
        _drawRect: function () {
            var x = Math.min(this.oldCoords.x, this.currentCoords.x);
            var y = Math.min(this.oldCoords.y, this.currentCoords.y);
            var width = Math.abs(this.oldCoords.x - this.currentCoords.x);
            var height = Math.abs(this.oldCoords.y - this.currentCoords.y);
            this.paintCtx.putImageData(this.currentCanvasSta, 0, 0);
            this.paintCtx.beginPath();
            this.paintCtx.strokeRect(x, y, width, height);
            this.paintCtx.closePath();
            this.paintCtx.stroke();
        },

        //获取当前鼠标距画布左上角位置
        getCoords: function (e) {
            e = e.originalEvent ? e.originalEvent : e;
            return {
                x: e.pageX - this.$canvasBox.offset().left,
                y: e.pageY - this.$canvasBox.offset().top
            };
        },

        //获取当前与上一帧中间点位置
        _getMidCoords: function (coords) {
            return {
                x: this.oldCoords.x + coords.x >> 1,
                y: this.oldCoords.y + coords.y >> 1
            };
        },

        //新建文本框
        _creatTextbox: function (e) {
            var coords = this.getCoords(e);
            var textbox = new Drawingboard.TextMode(this, {
                container: this.$canvasBox,
                left: coords.x,
                top: coords.y
            });
            this.textbox.push(textbox);
        },

        restoreHistory: function (image) {
            var that = this;
            this.clean();
            if (image) {
                var img = new Image();
                img.onload = function () {
                    that.paintCtx.drawImage(img, 0, 0);
                };
                img.src = image;
            }
        },

        //清空痕迹
        clean: function () {
            this.paintCtx.clearRect(0, 0, this.paintWidth, this.paintHeight);
        },

        // 调用完成涂鸦方法
        complete: function() {
            this.options.complete && this.options.complete.call(this);
        },

        //文字绘制到画布上
        combineText: function () {
            var that = this;
            $.each(this.textbox, function () {
                var coords = this.getCoords();
                var text = this.getText();
                var textLen = text.length;
                var fontStyle = this.getFontStyle();
                var top = coords.top + (parseInt(fontStyle.lineHeight) - parseInt(fontStyle.fontSize)) / 2;
                that.imgCtx.font = fontStyle.fontWeight + " " + fontStyle.fontSize + " " + fontStyle.fontFamily;
                that.imgCtx.fillStyle = fontStyle.color;
                that.imgCtx.textBaseline = "top";
                for (var i = 0; i < textLen; i++) {
                    that.imgCtx.fillText(text[i], coords.left, top + parseInt(fontStyle.lineHeight) * i);
                }
            })
        },

        //生成图片
        export: function (callback) {
            var result;

            var imgCanvasStatus = this.$imgCanvas[0].toDataURL("image/octet-stream");

            var paintCanvasStatus = this.$paintCanvas[0].toDataURL("image/octet-stream");

            this.imgCtx.drawImage(this.$paintCanvas[0], 0, 0);

            this.combineText();

            result = this.$imgCanvas[0].toDataURL("image/jpeg");

            this.loadImg(imgCanvasStatus);

            this.restoreHistory(paintCanvasStatus);

            if (callback) {
                callback(result);
            }
        }

    };

    $.fn.drawingboard = function (option) {
        var params = arguments;
        return this.each(function () {
            var $this = $(this),
                data = $this.data('drawingboard'),
                options = 'object' === typeof option && option;
            if (!data) {
                data = new Drawingboard(this, options);
                $this.data('drawingboard', data);
            }

            if ('string' === typeof option) {
                data[option].apply(data, Array.prototype.slice.call(params, 1));
            }
        });
    };

    $.fn.drawingboard.DEFAULT_OPTIONS = {
        src: null,
        tools: ["pencil", "rect", "ellipse", "text", "eraser", "clean", "undo", "redo"],
        activeMode: "pencil",
        paintSize: 10,
        eraserSize: 30,
        color: "#f60",
        fontSize: 30
    };


    Drawingboard.TextMode = function (drawingboard, options) {
        this.board = drawingboard;
        this.options = $.extend({}, Drawingboard.TextMode.DEFAULT_OPTIONS, options);
        this.init();
    }

    Drawingboard.TextMode.DEFAULT_OPTIONS = {
        container: $("body"),
        left: 0,
        top: 0,
        handles: ['e', 'w'],
        dragbars: ['n', 's', 'e', 'w']
    };

    Drawingboard.TextMode.prototype = {
        $el: "",
        isDrag: false,
        currentCoords: null,
        oldCoords: null,

        init: function () {
            var that = this;
            var temp = '<div class="db-textBox">' +
                '   <div class="db-textarea-wrap">' +
                '       <textarea class="db-textarea"></textarea>' +
                '       <textarea class="db-textarea-clone"></textarea>' +
                '   </div>' +
                '</div>';
            this.$el = $(temp).appendTo(this.options.container)
                .addClass("dash-border")
                .css({
                    "left": this.options.left,
                    "top": this.options.top
                });
            this.$textWrap = this.$el.find(".db-textarea-wrap");
            this.$textbox = this.$el.find(".db-textarea");
            this.$textClone = this.$el.find(".db-textarea-clone");
            this.$control = $('<div class="textbox-handles" />').appendTo(this.$el);
            this.$textWrap.find("textarea").css({
                "color": this.board.options.color,
                "font-size": this.board.options.fontSize
            })
            this.$textClone.css("height", this.$textbox.height());
            this.setMaxSize();
            this.creatHandles();
            this.$dragbar = this.$control.find(".dragbar");
            this.$handle = this.$control.find(".handle");
            this.$el.on("click mousedown", function (e) {
                e.stopPropagation();
            })
            this.$textbox
                .on("focus", function () {
                    that.setFocus(true);
                    that.addBox();
                })
                .on("blur", function () {
                    if ($(this).val() == "") {
                        that.destroy();
                        that.setFocus(false);
                    }
                })
                .on("input", $.proxy(this.resize, this))
                .focus();

            this.$dragbar.on("mousedown.textbox.drag", $.proxy(this.dragStart, this));
            this.$handle.on("mousedown.textbox.stretch", $.proxy(this.stretchStart, this));
            $document.on("mousemove.textbox.drag", $.proxy(this.dragging, this))
                .on("mousemove.textbox.stretch", $.proxy(this.stretching, this));
            $document.on("mouseup.textbox.drag", $.proxy(this.dragStop, this))
                .on("mouseup.textbox.stretch", $.proxy(this.stretchStop, this));

            $.subscribe("textboxFocus", $.proxy(this.removeBox, this));
        },

        resize: function () {
            this.$textClone.css("width", this.$textbox.width() + 17);
            this.$textClone.val(this.$textbox.val());
            this.$textbox.height(this.$textClone[0].scrollHeight);
        },

        setMaxSize: function () {
            var position = this.getPosition();
            this.$textWrap.css({
                "max-width": this.options.container.width() - position.left,
                "max-height": this.options.container.height() - position.top
            });
        },

        setFocus: function (isFocus) {
            this.board.isTextFocus = isFocus;
        },

        removeBox: function (e, obj) {
            if (!obj || obj !== this) {
                this.$el.removeClass('dash-border');
            }
        },

        addBox: function () {
            this.$el.addClass('dash-border');
            $.publish("textboxFocus", this);
        },

        /**
         * 创建句柄
         */
        creatHandles: function () {
            var handles = this.options.handles;
            var dragbars = this.options.dragbars;
            for (var i = 0; i < handles.length; i++) {
                this.insertHandle(handles[i]);
            }
            for (var i = 0; i < dragbars.length; i++) {
                this.insertDragbar(dragbars[i]);
            }
        },

        /**
         * 插入尺寸句柄
         */
        insertHandle: function (handle) {
            var jq = $('<div />').css({
                cursor: handle + '-resize'
            }).addClass('ord-' + handle + " handle");
            this.$control.append(jq);
        },

        /**
         * 插入拖动句柄
         */
        insertDragbar: function (dragbar) {
            var jq = $('<div />').css({
                cursor: 'move'
            }).addClass('ord-' + dragbar + " dragbar");
            this.$control.append(jq);
        },

        dragStart: function (e) {
            this.isDrag = true;
            this.oldCoords = this.board.getCoords(e);
            this.oldPosition = this.getPosition();
            e.stopPropagation();
            e.preventDefault();
        },

        dragging: function (e) {
            if (this.isDrag) {
                var moveOffset = this.getMoveOffset(e);
                this.$el.css({
                    "top": moveOffset.top,
                    "left": moveOffset.left
                })
                e.stopPropagation();
                e.preventDefault();
            }
        },

        dragStop: function () {
            this.isDrag = false;
        },

        stretchStart: function (e) {
            var $this = $(e.currentTarget);
            this.isStretch = true;
            this.oldCoords = this.board.getCoords(e);
            this.oldPosition = this.getPosition();
            this.oldWidth = this.$textWrap.width();
            this.minWidth = parseInt(this.$textWrap.css("min-width"));
            if ($this.hasClass("ord-e")) {
                this.stretchDir = "right";
            } else if ($this.hasClass("ord-w")) {
                this.stretchDir = "left";
            }
            e.stopPropagation();
            e.preventDefault();
        },

        stretching: function (e) {
            if (this.isStretch) {
                this.currentCoords = this.board.getCoords(e);
                var distance = this.currentCoords.x - this.oldCoords.x;
                if (this.stretchDir === "left" && distance < this.oldWidth - this.minWidth) {
                    this.$el.css("left", this.oldPosition.left + distance);
                    this.$textWrap.css("width", this.oldWidth - distance);
                    this.resize();
                    this.setMaxSize();
                } else if (this.stretchDir === "right" && distance > this.minWidth - this.oldWidth) {
                    this.$textWrap.css("width", this.oldWidth + distance);
                    this.resize();
                    this.setMaxSize();
                }
                e.stopPropagation();
                e.preventDefault();
            }
        },

        stretchStop: function () {
            this.isStretch = false;
        },

        getPosition: function () {
            return {
                top: parseInt(this.$el.css("top")),
                left: parseInt(this.$el.css("left"))
            }
        },


        /**
         * 获取文本框移动后的坐标
         * @return 返回对象
         */
        getMoveOffset: function (e) {
            var rectHeight = this.options.container.height() - this.$el.height(),
                rectWidth = this.options.container.width() - this.$el.width();
            this.currentCoords = this.board.getCoords(e);
            var distance = {
                x: this.currentCoords.x - this.oldCoords.x,
                y: this.currentCoords.y - this.oldCoords.y
            };
            var top = this.oldPosition.top + distance.y,
                left = this.oldPosition.left + distance.x;
            if (top < 0) {
                top = 0;
            } else if (top > rectHeight) {
                top = rectHeight;
            }
            if (left < 0) {
                left = 0;
            } else if (left > rectWidth) {
                left = rectWidth;
            }
            return {
                top: top,
                left: left
            }
        },

        /**
         * 获取鼠标相对画布左上角的位置
         * @return 返回对象
         */
        getCoords: function () {
            return {
                top: this.$textbox.offset().top - this.options.container.offset().top,
                left: this.$textbox.offset().left - this.options.container.offset().left
            }
        },

        /**
         * 获取textarea每一行字符
         * @return 返回值Array 每一行字符数组

         * 将获取的字符串优先根据手动换行符进行切割，
         * 再针对每个切割字符串以逐个加字符的方式判断长度是否超出，
         * 若超出，则添加自定义的换行标记，最后将得到的结果根据定义的换行标记切割
         */
        getText: function () {
            var result = "";
            var lineBreak = "/r@#$%^&/n";
            var value = this.$textbox.val();
            var textboxWidth = this.$textbox.width();
            var section = value.split("\n");
            var $valueCheck = $("<span style='visibility: hidden;white-space: pre' />").appendTo(this.$el);
            $valueCheck.css({
                "visibility": "hidden",
                "white-space": "pre",
                "position": "absolute",
                "top": "-10000px",
                "left": "-10000px",
                "font-size": this.$textbox.css("font-size")
            });
            $.each(section, function (index) {
                var textLen = this.length;
                if (!textLen) {
                    return result += lineBreak;
                } else {
                    for (var i = 0; i < textLen; i++) {
                        var valChar = this[i];
                        $valueCheck.text($valueCheck.text() + valChar);
                        if ($valueCheck.width() > textboxWidth) {
                            $valueCheck.text(valChar);
                            result += lineBreak + valChar;
                        } else {
                            result += valChar;
                        }
                        if (index != section.length - 1 && i == textLen - 1) {
                            result += lineBreak;
                            $valueCheck.text("");
                        }
                    }
                }
            });
            $valueCheck.remove();
            return result.split(lineBreak);
        },

        /**
         * 获取文字样式
         * @return 返回对象
         */
        getFontStyle: function () {
            return {
                fontWeight: this.$textbox.css("font-weight"),
                fontSize: this.$textbox.css("font-size"),
                lineHeight: this.$textbox.css("line-height"),
                fontFamily: this.$textbox.css("font-family"),
                color: this.$textbox.css("color")
            }
        },

        /**
         * 移出文本框，取消订阅
         */
        destroy: function () {
            $.unsubscribe("textboxFocus", this.removeBox);
            this.$el.remove();
        }
    }

})(jQuery, document);

/**
 * 观察者模式
 * 主要针对文本框选中时导致其他文本框隐藏边框
 */
(function ($) {
    var o = $({});

    $.subscribe = function () {
        o.on.apply(o, arguments);
    };

    $.unsubscribe = function () {
        o.off.apply(o, arguments);
    };

    $.publish = function () {
        o.trigger.apply(o, arguments);
    };
}(jQuery));
