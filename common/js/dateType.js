/**
 * Created by zhengjunling on 2016/6/28.
 * option增加startTime和endTime选项
 */
define(function (require, exports, module) {
    var DateType = function (options) {
        this.opts = $.extend({}, {
            container: ".date-select"
        }, options);
        this.$el = $(this.opts.container);
        this.dateFields = {
            $day: this.$el.find(".date-day"),
            $week: this.$el.find(".date-week"),
            $month: this.$el.find(".date-month"),
            $season: this.$el.find(".date-season [date-type=season]"),
            $yForSeason: this.$el.find(".date-season [date-type=year]"),
            $year: this.$el.find(".date-year")
        };
        this.dom = {
            $typeList: this.$el.find("ul.dateType")
        };
        this.init();
    };

    DateType.prototype = {
        //初始化日期选择控件
        init: function () {
            var that = this;
            var fields = that.dateFields;
            var today = new Date();
            fields.$day.datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                minView: 2,
                endDate: new Date(today.getTime()),
                initialDate: function () {
                    return new Date(today.getTime());
                }
            });
            fields.$week.datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                minView: 2,
                endDate: today,
                forceParse: false,
                weekInterval: true
            });
            fields.$month.datetimepicker({
                format: "yyyy-mm",
                autoclose: true,
                startView: 3,
                minView: 3,
                endDate: today
            });
            fields.$year.datetimepicker({
                format: "yyyy",
                autoclose: true,
                startView: 4,
                minView: 4,
                endDate: today
            });
            fields.$yForSeason.datetimepicker({
                format: "yyyy",
                autoclose: true,
                startView: 4,
                minView: 4,
                endDate: today
            }).on("changeDate", function () {
                that.setSeasonValue();
            });
            if (fields.$season) {
                that.setSeasonValue();
            }

            that.$el.on("click", ".dateType>li>a", function (e) {
                that.typeChange(e);
            })
        },

        //设置季度下拉选项
        setSeasonValue: function () {
            var year = this.dateFields.$yForSeason.val();
            var month = 12;
            if (year == (new Date).getFullYear()) {
                month = (new Date).getMonth() + 1;
            }
            var season = Math.ceil(month / 3);
            this.dateFields.$season.empty();
            for (var i = 1; i <= season; i++) {
                this.dateFields.$season.append('<option value=' + i + '>第' + i + '季度</option>');
            }
        },

        //日期类型选择切换
        typeChange: function (e) {
            var $this = $(e.currentTarget);
            if ($this.parent().hasClass("active")) {
                return;
            }
            $this.parent().addClass("active").siblings().removeClass("active");
            var type = $this.attr("type");
            this.$el.find(".datepicker-wrap").children().addClass("hide");
            this.$el.find(".datepicker-wrap .date-" + type).removeClass("hide");
        },

        //获取选择结果
        getDate: function () {
            var fields = this.dateFields;
            var typeCode = this.dom.$typeList.find(".active>a").attr("typeCode");
            var type = this.dom.$typeList.find(".active>a").attr("type");
            var startTime = "",
                endTime = "",
                month = "",
                year = "",
                season = "";
            switch (type) {
                case "day":
                    startTime = fields.$day.val();
                    break;
                case "week":
                    var weekDate = fields.$week.val().split("~");
                    startTime = weekDate[0];
                    endTime = weekDate[1];
                    break;
                case "month":
                    month = startDate = fields.$month.val();
                    break;
                case "season":
                    year = fields.$yForSeason.val();
                    season = fields.$season.val();
                    break;
                case "year":
                    year = fields.$year.val();
                    break;
            }
            return {
                month: month,
                season: season,
                year: year,
                dateType: typeCode,
                startTime: startTime,
                endTime: endTime
            }
        }
    };

    module.exports = DateType;
});
