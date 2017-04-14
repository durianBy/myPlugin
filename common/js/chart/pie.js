/**
 * 排名图表
 * Created by zhangbiying on 2016/7/21.
 */
define(function(require,exports,module){
    var pie = function(option){ //selector为选择器，data为请求到的数据
        this.opt = $.extend({},{
            id:{},//图表容器id
            label:true,//饼图中间显示的名称
            tooltip:false,//是否显示鼠标移到饼图上悬浮的tooltip
            color:['#F96868', '#62A9EB', '#CCD5DB'],
            data:[]
        },option);
        this.init();
        /*this.render();*/

    };
    pie.prototype = {
        init:function(){
            var _this = this;
            //根据传回的参数，初始化图标配置项
            _this.chartOption = {
                tooltip: {
                    show:_this.opt.tooltip,
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
                        data:_this.opt.data/*[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'}
                        ]*/
                    }
                ],
                color: _this.opt.color
            };
            //配置label
            if(_this.opt.label){
                _this.chartOption.series.label = {
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
            _this.chart = echarts.init(document.getElementById(_this.opt.id));//初始化图标实例
        },
        render:function(){
            var _this = this;
            // 初始化echarts实例
            _this.chart.setOption(this.chartOption, true);
        },
        addData:function(){
            var _this = this;
            _this.chartOption.series.data = this.opt.data;
        }

    };
    module.exports = pie;
});