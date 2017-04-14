/**
 * 饼图模块组件化
 * Created by zhangbiying on 2017/4/12.
 */
+function($){
    var PieModule = function(element,options){
        this.$el = $(element);
        this.opt = $.extend(true,{},pieModule.DEFAULT,options);
    };
    PieModule.DEFAULT = {
        chartOpt:{
            id:"zby",
            label:true,//饼图中间显示的名称
            tooltip:false,//是否显示鼠标移到饼图上悬浮的tooltip
            color:['#54CDAf', '#eec32e'],//颜色
            data:[]//数据
        },
        legendOpt:{
            color:['#54CDAf', '#eec32e'],
            lengendList:[{name: "固定车", value: 0, bValue: "0", unit: "元", percent: 0},{name: "临时车", value: 0, bValue: "0", unit: "元", percent: 0}]
        }
    };
    PieModule.Template = {
        legendTemp:_.template([
            '<div class="col-md-6 col-lg-7 h100p">',
            '    <div class="chart-box pie-chart" id="iep-apply-incomePie"></div>',
            '</div>',
            '<div class="col-md-6 col-lg-5 h100p">',
            '    <div class="lengend-wrap">',
            '        <div class="lengend-head">',
            '            <div class="name"><%=data.%></div>',
            '            <div class="data"></div>',
             '       </div>',
             '       <div class="chart-legend"></div>',
             '   </div>',
            '</div> '
        ].join(''))
    };
    PieModule.prototype = {
        render: function(){
            //插入饼图图表html模板
            this.$el.append(PieModule.Template.legendTemp({data:this.opt.legendOpt}));

            //初始化饼图图表
            this.initPieChart();

            //初始化饼图图例
            this.initlegend();
        },
        //初始化饼图图表
        initPieChart: function(){
            var _this = this;
            var pieOption = {
                tooltip: {
                    show:_this.opt.chartOpt.tooltip,
                    formatter: "{b}:{c}元"
                },
                series: [
                    {
                        type: 'pie',
                        center:['50%','50%'],
                        radius: ['45%', '65%'],
                        avoidLabelOverlap: false,
                        hoverAnimation:false,
                        legendHoverLink:false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        data:_this.opt.chartOpt.data
                    }
                ],
                color: _this.opt.chartOpt.color
            };
            //配置label
            if(_this.opt.chartOpt.label){
                pieOption.series.label = {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14',
                            fontWeight: 'bold'
                        }
                    }
                }
            }
            _this.pieChart = echarts.init(document.getElementById(_this.opt.chartOpt.id));//初始化图标实例
        }
    }
}(jQuery)














