(function (window, $) {
    var CitySelect = function (selector, options) {
        var defaults = {
            url: undefined,                             //请求数据链接
            params: {},                            //请求参数
            typeLength: 3,                         //层级数量
            jsonFormat: {
                type: "type",                      //所处关联层级
                id: "id",                          //对象唯一标识
                value: "shortName",                //对象名称
                parentId: "parentId"               //上层对象标识
            },
            data: undefined,                           //直接引入json数据，不需要请求
            initValue: null,                      //初始化控件的值
            defaultChooseAll: false,              //true:默认全部地区，false:默认无选中值
            toggleDropdown: true,                 //true:允许下拉列表的切换，false:始终显示下拉列表
            multipleSelect: false,                 //true:多选,false:单选,仅限最后一级
            limit: null,
            wholeSelect: false,                   //true:允许全选,如全国、全省，false:不允许全选
            typeTxt: ["省", "市", "区", "社区"],  //若设置了最后一级多选，需设置最后一级类型名称
            wholeSelectText: ["全国", "全省", "全市", "全区"],
            cancelSelect: function () {
                return false;
            },
            afterSelect: function () {           //每做一次选择之后执行的回调
                return false;
            },
            success: function () {               //全部选择完成后执行的回调
                return false;
            }
        };
        this.$el = (typeof selector == "string") ? $(selector) : selector;
        this.settings = $.extend(defaults, options); //参数
        this.init(); //初始化
    };
    CitySelect.prototype = {
        init: function () {
            var that = this;
            //选择结果
            that.result = [];
            that.multiResult = [];
            //初始化HTML结构
            that.$el.addClass("citySelect").prepend('<div class="city-select-wrap"></div><div class="city-list-wrap"></div>');
            for (var i = 0; i < that.settings.typeLength; i++) {
                that.$el.find(".city-select-wrap").append(
                    '<div class="city-select' + (i == 0 ? "" : " disabled") + '" data-type=' + i + '>' +
                    '<span class="select-content">' + that.settings.typeTxt[i] + '</span>' +
                    '<i class="select-dropdown"></i>' +
                    '</div>'
                );
                that.$el.find(".city-list-wrap").append('<ul class="city-list" data-type=' + i + '></ul>');
            }
            that.dom = {
                $selectWrap: that.$el.find(".city-select-wrap"),
                $select: that.$el.find(".city-select"),
                $dropdown: that.$el.find(".city-list-wrap"),
                $list: that.$el.find(".city-list")
            };
            if (!that.settings.toggleDropdown) {
                that.dom.$dropdown.show();
                that.$el.addClass("opening")
            }
            that.dom.$list.eq(0).show();
            that.events();
            if (typeof that.settings.url == "undefined" && typeof that.settings.data != "undefined") {
                that.jsonData = that.settings.data;
                that.setDropList();
            }
            else {
                that.getData(that.settings.params, function (data) {
                    that.jsonData = data;
                    that.setDropList();
                });
            }
        },

        //请求数据
        getData: function (params, func) {
            var that = this;
            if (typeof(that.settings.url) == "string") {
                $.ajax({
                    url: that.settings.url,
                    plugin: false,
                    data: params,
                    dataType: "json",
                    success: func
                })
            } else if (typeof(that.settings.url) == "object") {
                func(that.settings.url);
            }
        },

        //初始化选择框的值
        initValue: function (value, callback) {
            var that = this;
            var status = true;
            if (!value || value.length == 0) return false;
            var hasData = setInterval(function () {
                if (!that.jsonData) return false;
                clearInterval(hasData);
                var valueText = "";
                $.each(value, function (index, obj) {
                    var cityObj = that.getCity(obj);
                    if (cityObj) {
                        valueText += cityObj.name;
                        that.setSingleSelectBox(cityObj, cityObj.type);
                        that.setDropActive(cityObj.type, this.id);
                        that.setResult();
                    }
                    else {
                        status = false;
                    }
                })
                if (callback) {
                    callback(valueText, status);
                }
            }, 100);
        },

        //设置单选框状态
        setSingleSelectBox: function (select, type) {
            var that = this;
            var $select = that.dom.$select;
            var $list = that.dom.$list;
            that.overFlag = false;
            $select.eq(type).find(".select-content").text(select[that.settings.jsonFormat.value]);
            if (type == that.settings.typeLength - 1) {
                this.overFlag = true;
                return;
            }
            var currentType = that.setDropList(select.id);
            if (select.id && currentType) {
                if (currentType > type + 1) {
                    $select.slice(type + 1, currentType).hide();
                }
                var afterSelect = $select.slice(currentType);
                $list.eq(currentType).show();
                $select.eq(currentType).removeClass("disabled");
                $select.slice(currentType + 1).addClass("disabled");
                afterSelect.show();
                $.each(afterSelect, function (index) {
                    $(this).find(".select-content").text(that.settings.typeTxt[index + currentType]);
                })
                if (that.settings.wholeSelect) {
                    that.chooseAll(currentType);
                }
                if (type >= this.settings.typeLength) {
                    this.overFlag = true;
                }
            }
            else {
                $select.slice(type + 1).hide();
                $list.slice(type + 1).hide();
                this.overFlag = true;
            }
        },
        //设置多选框状态
        setMultipleSelectBox: function () {
            var that = this;
            var type = that.settings.typeLength - 1;
            var $content = that.$el.find(".city-select:last .select-content");
            var mulActive = that.dom.$list.eq(type).find(".active");
            var len = mulActive.length;
            if (!len) {
                $content.text(that.settings.typeTxt[type]);
            } else if (len == 1) {
                $content.text(mulActive.text());
            } else {
                $content.text(mulActive.eq(0).text() + "等" + len + "个" + that.settings.typeTxt[type]);
            }
            this.overFlag = true;
        },

        //选择全部
        chooseAll: function (type) {
            var text = this.dom.$list.eq(type).find('[data-all="true"]').addClass("active").html();
            this.dom.$select.eq(type).find(".select-content").text(text);
            this.dom.$select.slice(type + 1).hide();
        },

        getCity: function (obj) {
            var that = this;
            var selfId = that.settings.jsonFormat.id;
            var type = that.settings.jsonFormat.type;
            var cityObj = null;
            $.each(that.jsonData, function () {
                if (this[selfId] == obj.id && this[type] == obj.type) {
                    cityObj = this;
                    return false;
                }
            })
            return cityObj;
        },

        //获取地区列表
        getDropList: function (pId) {
            var that = this,
                dropList = [],
                parentId = this.settings.jsonFormat.parentId;
            pId = typeof pId == "undefined" ? 0 : pId;
            $.each(that.jsonData, function () {
                if (!that.settings.wholeSelect && this.id < 0) {
                    return;
                }
                if (this[parentId] == pId) dropList.push(this);
            })
            return dropList;
        },

        //设置下拉框列表
        setDropList: function (pId) {
            var that = this;
            var jsonFormat = that.settings.jsonFormat;
            var list = this.getDropList(pId);
            //type = typeof type == "undefined" ? 0 : type;
            if (!list.length) {
                return false;
            }
            var currentType = list[0].type;
            var $dropdown = that.dom.$list.eq(currentType);
            $dropdown.empty();
            $.each(list, function () {
                var temp = $('<li><a title=' + this[jsonFormat.value] + ' data-id=' + this[jsonFormat.id] + '>' + this[jsonFormat.value] + '</a></li>');
                temp.find("a").data("cityInfo", this);
                $dropdown.append(temp);
            })
            if (currentType != 0 && that.settings.wholeSelect) {
                $dropdown.prepend('<li><a title=' + that.settings.wholeSelectText[currentType] + ' data-all="true">' + that.settings.wholeSelectText[currentType] + '</a></li>')
            }
            if (currentType == that.settings.typeLength - 1)that.multiLimit();
            return currentType;
        },

        //设置下拉列表选中状态
        setDropActive: function (type, id) {
            if (!this.settings.multipleSelect) {
                this.dom.$list.eq(type).find("a").removeClass("active");
            }
            this.dom.$list.eq(type).find("a[data-id=" + id + "]").addClass("active").removeClass("disabled");
        },

        //设置下拉列表不可选状态
        setDropDisabled: function (type, id) {
            this.dom.$list.eq(type).find("a[data-id=" + id + "]").addClass("disabled").removeClass("active");
        },

        //取消选中
        cancelSelect: function (type, id) {
            this.dom.$list.eq(type).find("a[data-id=" + id + "]").removeClass("active");
            this.setMultipleSelectBox();
            this.multiRemove(id);
            this.multiLimit();
        },

        //清空下拉列表
        cleanList: function (type) {
            for (var i = type + 1; i < this.settings.typeLength; i++) {
                this.dom.$list.eq(i).empty();
            }
        },

        //设置选择结果
        setResult: function () {
            var that = this;
            that.result = [];
            that.dom.$list.find("a.active").each(function () {
                var cityInfo = $(this).data("cityInfo");
                if (cityInfo) {
                    that.result.push(cityInfo);
                }
            })
        },

        //获取选择结果
        getResult: function () {
            if (this.overFlag || this.settings.wholeSelect) {
                return this.result;
            }
        },

        //获取选择
        isSelected: function () {
            return this.overFlag;
        },

        //添加多选结果
        multiAdd: function (value) {
            this.multiResult.push(value);
            this.settings.success(this.multiResult);
        },

        //移除多选的某一项
        multiRemove: function (id) {
            var that = this;
            if (that.multiResult.length) {
                $.each(that.multiResult, function (index) {
                    if (this.id == id) {
                        that.multiResult.splice(index, 1);
                    }
                })
            }
            this.settings.success(that.multiResult);
        },

        //多选最大数量限制
        multiLimit: function () {
            var $mullist = this.dom.$list.eq(this.settings.typeLength - 1);
            var activeCount = this.multiResult.length;
            if (this.settings.limit == null) {
                return false;
            }
            if (activeCount >= this.settings.limit) {
                $mullist.find("a").addClass("disabled");
                $mullist.find(".active").removeClass("disabled");
            } else {
                $mullist.find("a").removeClass("disabled");
            }
        },

        //事件绑定
        events: function () {
            var that = this;

            //点击选择框弹出下拉框
            that.$el.on("click", ".city-select", function (e) {
                if (that.settings.toggleDropdown) {
                    $(".city-list-wrap").hide();
                    //that.dom.$dropdown.hide();
                }
                if (!$(this).hasClass('disabled')) {
                    var type = $(this).attr("data-type");
                    that.dom.$dropdown.show();
                    that.dom.$list.eq(type).show().siblings("ul").hide();
                }
                e.stopPropagation();
            });
            //点击下拉框列表
            that.dom.$dropdown.on("click", ".city-list a", function () {
                if ($(this).hasClass("disabled")) {
                    return false;
                }
                var $list = $(this).closest(".city-list");
                var cityInfo = $(this).data("cityInfo");
                var type = $(this).closest("ul").data("type");
                var id = $(this).data("id");
                that.cleanList(type);
                if (type == that.settings.typeLength - 1 && that.settings.multipleSelect) {
                    var selectList = new Array();
                    $(this).toggleClass("active");
                    if (!$(this).hasClass("active")) {
                        that.multiRemove(id);
                        that.settings.cancelSelect($(this).data("cityInfo"));
                    } else {
                        that.multiAdd(cityInfo);
                    }
                    $list.find(".active").each(function () {
                        selectList.push($(this).data("cityInfo"));
                    })
                    that.setMultipleSelectBox();
                    that.multiLimit();
                    return;
                }
                if (typeof $(this).data("all") == "undefined") {
                    if (type != that.settings.typeLength - 1 && id != "-1") {
                        $list.hide();
                    }
                    $list.find("a").removeClass("active");
                    $list.find("a[data-id=" + cityInfo.id + "]").addClass("active");
                    that.setSingleSelectBox(cityInfo, type);
                } else {
                    that.chooseAll(type);
                    $list.find("a").removeClass("active");
                    $(this).addClass("active");
                    that.overFlag = true;
                }
                if (that.settings.toggleDropdown && that.overFlag) {
                    that.dom.$dropdown.hide();
                }
                that.setResult();
                if (that.overFlag) {
                    that.settings.success(that.result);
                } else {
                    that.settings.afterSelect(that.result);
                }
            });
            that.dom.$dropdown.on("click", function (e) {
                e.stopPropagation();
            });
            $(document).click(function () {
                if (that.settings.toggleDropdown) {
                    that.dom.$dropdown.hide();
                }
            })
        }
    }

    window.CitySelect = typeof window !== "undefined" ? CitySelect : {};
})(window, jQuery)