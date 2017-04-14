seajs.config({
    base: "./",
    alias: {
        "bsTable": basePath + "/plugin/bootstrap-table/js/bootstrap-table.js",
        "bsTableCss": basePath + "/plugin/bootstrap-table/css/bootstrap-table.css",
        "bsTableThemeCss": basePath + "/views/common/css/bootstrap-table-theme.css",
        "citySelect": basePath + "/plugin/jquery.citySelect.js/js/jquery.citySelect.js",
        "citySelectCss": basePath + "/plugin/jquery.citySelect.js/css/citySelect.css",
        "datePicker": basePath + "/plugin/dateTimepicker/bootstrap-datetimepicker.js",
        "datePickerCss": basePath + "/plugin/dateTimepicker/bootstrap-datetimepicker.css",
        "validator": basePath + "/plugin/bootstrapValidator/bootstrapValidator.js",
        "sha256": basePath + "/plugin/sha256/sha256.js",
        "echarts": basePath + "/plugin/echarts/echarts.min.js",
        "rankChart": basePath + "/views/common/js/chart/rank.js",//等级图表
        "pieChart": basePath + "/views/common/js/chart/pie.js",//等级图表
        "lineChart": basePath + "/views/common/js/chart/line.js",//等级图表
        "uploadFile": basePath + "/plugin/ajaxFileUpload/ajaxfileupload.js",
        "infoWindow": basePath + "/plugin/InfoBox/InfoBox.js",
        "router": basePath + "/views/common/js/router.js",
        "mainMap": basePath + "/views/apply/js/mainMap.js",
        "platFormInfo": basePath + "/views/apply/js/platFormInfo.js",
        "iepMap": basePath + "/views/config/js/map.js",
        "platMenu": basePath + "/views/common/js/platMenu.js",
        "dateType": basePath + "/views/common/js/dateType.js",
        "lightBox":basePath + "/plugin/lightBox/js/lightbox.js",
        "lightBoxCss":basePath + "/plugin/lightBox/css/lightbox.css",
        "drawingboard": basePath + "/plugin/drawingboard/js/drawingboard.js",
        "drawingboardCss": basePath + "/plugin/drawingboard/css/drawingboard.css",
        "pageList": basePath + "/plugin/pageList/js/pageList.js"
        /*"fancyBox":basePath + "/plugin/source/jquery.fancybox.js?v=2.1.3",//图片展示控件
        "fancyBoxCss":basePath + "/plugin/source/jquery.fancybox.css?v=2.1.2"*/
    },
    paths: {
        "myMap": "http://api.map.baidu.com/api?v=2.0&ak=MFkHnlARzlVTEW66k7V4ybqtyW6gDHeV"
    }
});
