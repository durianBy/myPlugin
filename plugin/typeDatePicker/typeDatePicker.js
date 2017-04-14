/**
 * Created by zhangbiying on 2016/5/17. 时间类型选择：日周季月年
 */
define(function (require, exports, module) {
    /*var $elObject = {
     "day":"#iep-revenue-day",
     "month":"#iep-revenue-month",
     "year":"#iep-revenue-year",
     "week":"#iep-revenue-week",
     "weekHide":"#iep-revenue-weekHide"
     };*/

    function initTypeDatePicker($elObject) {
        //初始化日
        if ($elObject["day"]) {
            $($elObject["day"]).click(function () {
                WdatePicker({
                    maxDate: '%y-%M-{%d-1}',
                    enableInputMask: false,
                    /*isShowClear: false,*/
                    firstDayOfWeek: 1,
                    dateFmt: 'yyyy-MM-dd'
                });
            });
        }
        //初始化月
        if ($elObject["month"]) {
            $($elObject["month"]).click(function () {
                WdatePicker({
                    firstDayOfWeek: 1,
                    enableInputMask: false,
                    isShowClear: false,
                    maxDate: '%y-%M-%d',
                    dateFmt: 'yyyy-MM'
                });
            });
        }


        //初始化年
        if ($elObject["year"]) {
            $($elObject["year"]).click(function () {
                WdatePicker({
                    firstDayOfWeek: 1,
                    enableInputMask: false,
                    maxDate: '%y-%M-%d',
                    isShowClear: false,
                    dateFmt: 'yyyy',
                    onpicked: function () {
                        initSeason($elObject, $($elObject["year"]).val());
                    }
                });
            });
        }


        //初始化周
        if ($elObject["week"]) {
            $($elObject["week"]).click(function () {
                WdatePicker({
                    el: "iep-revenue-weekHide",
                    enableInputMask: false,
                    firstDayOfWeek: 1,
                    isShowWeek: true,
                    maxDate: '%y-%M-%d',
                    isShowClear: false,
                    onpicked: function () {
                        weekChangeEvent($($elObject["week"]), $($elObject["weekHide"]));
                    }
                });
            });
        }

        //输入框的值初始化
        initDateVal($elObject);

        $("#iep-revenue-dateType li").on("click", function (e) {
            $(e.currentTarget).addClass("active").siblings().removeClass("active");//修改active
            var type = $(e.currentTarget).attr("type");
            $("#iep-revenue-" + type).show().siblings().hide();//根据类型显示日期选择器
            $($elObject["year"]).hide();
            switch (type) {
                case "year" :
                    $(".date-input input").hide();
                    $($elObject["year"]).show();
                    $(".date-input .select-box").hide();
                    break;
                case "season" :
                    $(".date-input input").hide();
                    $($elObject["year"]).show();
                    $(".date-input .select-box").css("display", "inline-block");
                    /*initSeason($elObject,$($elObject["year"]).val());*/
                    break;
            }
        });
    }

    //初始化时间input的值
    function initDateVal($elObject) {
        var day = $.dateToString($.now()-(24*60*60*1000));
        var month = day.slice(0, 7);
        var year = day.slice(0, 4);

        $($elObject["day"]).val(day);

        $($elObject["month"]).val(month);

        $($elObject["year"]).val(year);

        //季选择框赋值
        initSeason($elObject, year);
        //周赋值
        var weekDate = new Date();
        var weekTime = weekDate.getTime();
        var weekDay = weekDate.getDay() || 7;
        var beginWeekTime = $.dateToString(weekTime - 24 * 60 * 60 * 1000 * (weekDay - 1));
        var endWeekTime = $.dateToString(weekTime + 24 * 60 * 60 * 1000 * (7 - weekDay));
        $($elObject["week"]).val(beginWeekTime + '至' + endWeekTime);
        $($elObject["weekHide"]).val(beginWeekTime);
    }

    function initSeason($elObject, year) {
        //根据当前年份显示季度
        var month = 12;
        if (year == (new Date).getFullYear()) {
            month = (new Date).getMonth() + 1;//获取当前月

        }
        //插入季度select选项
        season = Math.ceil(month / 3);//向上取整
        $($elObject["season"]).empty();
        for (var i = 0; i < season; i++) {
            var n = i + 1;
            $($elObject["season"]).append('<option value="' + n + '">' + n + '季度</option>');
        }
    }

    function weekChangeEvent($input, $hiddenInput) {
        var date = new Date($hiddenInput.val().replace(/-/g, '/'));
        var time = date.getTime();
        var day = date.getDay() || 7;

        var beginTime = $.dateToString(time - 24 * 60 * 60 * 1000 * (day - 1));
        var endTime = $.dateToString(time + 24 * 60 * 60 * 1000 * (7 - day));

        $input.val(beginTime + '至' + endTime);
    }

    module.exports = {
        initTypeDatePicker: initTypeDatePicker
    };
});
