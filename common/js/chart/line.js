/**
 * 折线图表
 * Created by zhangbiying on 2016/7/5.
 */
define(function(require,exports,module){
    var echartOptions = {
        grid: {//直角坐标系网格
            show: true,
            borderColor: '#f0f0f0'
        },
        xAxis: {//x轴
            axisLine: {//x轴线
                lineStyle: {
                    color: '#f0f0f0'
                }
            },
            axisTick: {//坐标轴刻度
                show: false
            },
            splitLine: {//X轴竖线
                lineStyle: {
                    color: ['#f0f0f0']
                }
            }
        },
        yAxis: {
            nameTextStyle: {//坐标轴名称样式
                color: '#999'
            },
            axisLine: {
                lineStyle: {
                    color: '#f0f0f0'
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: ['#f0f0f0']
                }
            }
        }
    };
    var line = function(option){ //$id为选择器id，data为请求到的数据
        this.opt = $.extend(true,{},{
            xdata:[],//横坐标数据
            series:[],//纵坐标数据
            legend:[]//图例数组
        },option);
        this.init();
        /*this.render();*/
    };
    line.prototype = {
        init:function(){
            var $this = this;
            //根据传回的参数，初始化图标配置项
            $this.chartOption = $.extend(true,{},echartOptions,{
                tooltip: {
                    trigger: 'axis'
                },
                legend:{
                    right: '4%',
                    top:'0',
                    /*padding: 0,*/
                    data:$this.opt.legend,
                    textStyle:{
                        color: "#999",
                        fontStyle: 'normal',
                        fontWeight: "normal",
                        fontFamily: 'sans-serif',
                        fontSize: 12
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '1%',
                    top: '13%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: $this.opt.xdata
                },
                yAxis: {
                    type: 'value',
                    name: '（元）'
                },
                series: $this.opt.series/*[
                    {
                        name: '本期',
                        smooth: true,
                        type: 'line',
                        itemStyle: {normal: {color: 'rgba(84,205,174,0.5)'}},
                        areaStyle: {normal: {color: 'rgba(84,205,174,0.5)'}},
                        lineStyle: {normal: {width: 0}},
                        data: $this.opt.ydata
                    }
                ]*/
            });
            $this.chart = echarts.init(document.getElementById(this.opt.id));//初始化图标实例
        },
        render:function(){
            var $this = this;
            // 初始化echarts实例
            $this.chart.setOption(this.chartOption, true);
        },
        addData:function(){
            var $this = this;
            $this.chartOption.series.data = this.opt.data;
        }

    };
    module.exports = line;
});