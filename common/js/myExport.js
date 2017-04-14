/**导出窗口逻辑实现
 * Created by zhangbiying on 2016/5/24.
 */
define(function (require, exports, module) {
    var dataParam = $("#dataForm").serializeJson();
    var myExport = Backbone.View.extend({
        initialize: function (cfg) {
            this.render();
            //文件下载请求
            $.ajax({
                url: basePath + dataParam.actionUrl,
                data: dataParam,
                mask:false,
                plugin: false,
                success: function (data) {
                    if (data) {
                        $(".foot-text").html("导出数据准备完毕！文件大小为" + data.fileSize);
                        $(".loading-wrapper img").attr("src", basePath + "/views/common/img/canLoad.png");
                        $(".loading-wrapper").attr("href", basePath + data.fileUrl);
                    }
                }
            })
        },
        render: function () {
            //初始化显示内容
            //初始化头部title
            switch (dataParam.typeCode) {
                case "00"://临时车导出报表
                    $(".type-name").html("固定车导出报表");
                    break;
                case "01"://固定车导出报表
                    $(".type-name").html("临时车导出报表");
                    break;
                case "02"://导出报表
                    $(".type-name").html("导出报表");
                    break;
            }

            //初始化时间范围
            switch (dataParam.countTimeType) {
                case"0"://日
                    $(".time .content").html(dataParam.startTime.replace(/-/g, "/"));
                    break;
                case"1"://周
                    $(".time .content").html(dataParam.startTime.replace(/-/g, "/") + "-" + dataParam.endTime.replace(/-/g, "/"));
                    break;
                case"2"://月
                    $(".time .content").html(dataParam.month.replace(/-/g, "/"));
                    break;
                case"3"://季
                    $(".time .content").html(dataParam.year + "年第" + dataParam.season + "季度");
                    break;
                case"4"://年
                    $(".time .content").html(dataParam.year + "年");
                    break;
            }
        }
    });
    module.exports = myExport;
})