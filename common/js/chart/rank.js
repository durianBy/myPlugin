/**
 * 排名图表
 * Created by zhangbiying on 2016/6/29.
 */
define(function(require,exports,module){
    var rank = function(option){ //id为选择器，data为请求到的数据
        this.opt = $.extend({},{
            id:"",//图标选择器
            inverse:false,
            data:[] //请求到的数据
        },option);
        this.init();
        this.render();

    };
    rank.prototype = {
        init:function(){
            var $this = this;
            //根据传回的参数，初始化图标配置项
            $this.chartOption = {
                /*title: {
                 text: '世界人口总量',
                 subtext: '数据来自网络'
                 },*/
                //鼠标悬浮效果
                tooltip: {
                    show:false
                    /*trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }*/
                },
                /*legend: {
                 data: ['2011年', '2012年']
                 },*/
                grid: {
                    left: '3%',
                    right: '0',
                    top: '3%',
                    bottom: '0'
                    /*containLabel: true*/
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    axisLine: {show: false},
                    axisLabel:{show:false},
                    axisTick:{show:false},
                    splitLine:{show:false},
                    inverse:this.opt.inverse,
                    data:this.opt.data
                },
                yAxis: {
                    type: 'category',
                    data: [],
                    axisTick:{show:false},
                    axisLine: {show: false},
                    splitLine:{show:false},
                    inverse:true
                },
                series: [
                    {
                        name: '2011年',
                        type: 'bar',
                        data: this.opt.data,
                        barCategoryGap:"70%",
                        label: {
                            normal: {
                                show: false,
                                /*position: 'right',
                                textStyle:{
                                    color:'#444',
                                    fontSize:'12px'
                                }*/
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#ccc'
                            }
                        }
                    }
                ]
            };
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
    module.exports = rank;
});