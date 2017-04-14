/**
 * 幻灯片
 * Created by wangzhipei on 2017/4/7/0007.
 * version 1.0 目前用于社区云里幻灯片功能；
 */
;(function($){
    jQuery.fn.extend({
        "slideShow": function(options){
            // 设置默认参数
            var o = $.extend({
                "slPrev": '.js-prev',
                "slNext": '.js-next',
                "slPage": '.pic-pages'
            }, options);

            this.each(function(){
                var sum = $('li', this).length,
                    curIndex = 1,
                    $s_box = $(this), // 当前幻灯片元素
                    $s_content = $(this).parents('li'); // 当前幻灯片最外层的盒子
                // 绘制索引
                function drawPage(){
                    $(o.slPage, $s_content).html(curIndex+ '/<em>'+sum+'</em>');
                }
                $(o.slPrev,$s_content).addClass('disabled');
                sum == 1 && $(o.slNext,$s_content).addClass('disabled');
                // 上一张
                $(o.slPrev,$s_content).click(function(){
                    var c_width = $($s_content).width();
                    if($s_box.is(":animated")) return;
                    if(curIndex == 1){
                        return $(this).addClass("disabled");
                    }

                    $(this).removeClass("disabled");
                    $(o.slNext,$s_content).removeClass("disabled");
                    curIndex--;
                    $s_box.animate({left: '+='+c_width }, "slow");
                    drawPage();
                    if(curIndex == 1){
                        $(this).addClass("disabled");
                    }
                });
                // 下一张
                $(o.slNext, $s_content).click(function(){
                    var c_width = $($s_content).width();
                    if($s_box.is(":animated")) return;
                    if(curIndex == sum){
                        return $(this).addClass("disabled");
                    }

                    $(this).removeClass("disabled");
                    $(o.slPrev,$s_content).removeClass("disabled");
                    curIndex++;
                    $s_box.animate({left: '-='+c_width }, "slow");
                    drawPage();
                    if(curIndex == sum){
                        $(this).addClass("disabled");
                    }
                });
            });

            return this; // 返回this，使方法可链
        }
    });

    jQuery.fn.extend({
        "slideShow": jQuery.fn.slideShow
    });
})(jQuery);