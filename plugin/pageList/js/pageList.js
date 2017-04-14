/**
 * 分页列表功能
 * Created by zhangbiying
 * on 2017/3/16.
 */

+ function($){
    'use strict';

    var PageList = function(element,options){
        this.$el = $(element);
        this.opt = $.extend({},PageList.DEFAULT,options);
    };

    PageList.DEFAULT = {
        data: [],
        pageSize: 5
    };
    PageList.prototype = {
        render: function(){
            var _this = this;
            var data = this.opt.data;
            var len = data.length;
            var pageData = [];
            this.$el.empty();
            //分页插入list
            for(var i = 0;i < len;i+=_this.opt.pageSize){
                pageData.push(data.slice(i,i+_this.opt.pageSize));
            }
            var template = '<li class="pagination-list-item video-score-negative" id="<&=index.id&>">'+
                                '<span class="text"><&=index.content&></span>'+
                                '<span class="check-icon icon-on-line"></span>'+
                            '</li>';
            //插入内容list
            $.each(pageData,function(n,list){
                _this.$el.append("<ul class='pagination-list-content "+ (n?'hide':'') +"' name='pageList"+(n+1)+"'></ul>");
                var arryHtml = "";
                $.each(list,function(m,el){
                    arryHtml += $.template(template,{index:el});
                });
                $("[name=pageList"+(n+1)+"]",_this.$el).append(arryHtml);
            });

            //初始化底部分页信息
            _this.initPagination();

            //绑定鼠标点击下一页事件
            $(".pagination .forward-btn",_this.$el).on("click",function(e){
                //修改底部分页信息
                var nowPage = (_this.nowPage+1)%_this.pageNum;
                _this.nowPage = nowPage?nowPage:_this.pageNum;
                $(".pagination .nowPage",_this.$el).html(_this.nowPage);

                //显示隐藏对应页)
                $("[name=pageList"+(_this.nowPage-1?_this.nowPage-1:_this.pageNum)+"]",_this.$el).addClass("hide");
                $("[name=pageList"+(_this.nowPage)+"]",_this.$el).removeClass("hide");
            });

            //绑定鼠标点击上一页事件
            $(".pagination .back-btn",_this.$el).on("click",function(e){
                //修改底部分页信息
                var nowPage = (_this.nowPage-1)%_this.pageNum;
                _this.nowPage = nowPage?nowPage:_this.pageNum;
                $(".pagination .nowPage",_this.$el).html(_this.nowPage);

                //显示隐藏对应页)
                var page = (_this.nowPage+1)%_this.pageNum;
                $("[name=pageList"+(page?page:_this.pageNum)+"]",_this.$el).addClass("hide");
                $("[name=pageList"+(_this.nowPage)+"]",_this.$el).removeClass("hide");
            });

            //绑定鼠标点击选中事件
            $(".pagination-list-item",_this.$el).on("click",function(e){
                $(this).toggleClass("checked");
            })
        },
        initPagination: function(){
            var _this = this;
            _this.totalNum = _this.opt.data.length;
            _this.pageNum = Math.ceil( _this.totalNum/_this.opt.pageSize);
            _this.nowPage = 1;
            var paginationHtml = '<div class="pull-right pagination">'+
                                      '<a class="back-btn page-btn"><i class="icon-L-Carousel"></i></a>'+
                                      '<span class="nowPage">'+_this.nowPage+'</span><span class="totalPage">/'+_this.pageNum+'</span>'+
                                      '<a class="forward-btn page-btn"><i class="icon-R-carousel"></i></a>'+
                                  '</div>';
            _this.$el.append(paginationHtml);
        },
        getChecked: function(){
            var _this = this;
            var ids = [];
            $(".pagination-list-item.checked",_this.$el).each(function(n,el){
                ids.push($(el).attr("id"));
            });
            return ids;
        }
    };

    function plugin(option){
        var $this = $(this),
            options = typeof option && option;

        var pageList = new PageList($this,options);
        //抛出方法
        $this.pageList.getChecked = pageList.getChecked;

        pageList.render();
    }

    var old = $.fn.pageList;

    $.fn.pageList = plugin;
    $.fn.pageList.Constructor = PageList;

    $.fn.pageList.noConflict = function(){
        $.fn.pageList = old;
        return this;
    }

}(jQuery);








