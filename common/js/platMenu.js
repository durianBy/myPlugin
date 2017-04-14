/**
 * Created by zhengjunling on 2016/5/30.
 */
(function ($) {
    var aboutPageFlag = false, changePwdPageFlag = false;
    var pwdLevel;//密码级别
    var fadeIn = "fadeIn animated fast",
        fadeOut = "fadeOut animated fast";
    var admin = true;

    //获取平台用户信息
    $.ajax({
        url:basePath + "/userAccount/getCurrentAccountInfo",
        plugin:true,
        type: "GET",
        success:function(data){
            if(data.success){
                data = data.data;
                if(data){
                    $(".userInfo .user").html(data.account);//账户名
                    $(".userInfo .due-date").html(data.endTime);//到期时间
                    $(".userInfo .userName").html(data.name);//账户姓名
                    $(".userInfo .telephone").html(data.phone);//电话
                    admin = data.admin;
                }
            }else{
                $(".userInfo .user").html("无");//账户名
                $(".userInfo .due-date").html("无");//到期时间
                $(".userInfo .userName").html("无");//账户姓名
                $(".userInfo .telephone").html("无");//电话
                admin = "";
                $.toast({
                    message:data.message,
                    state:false
                });
            }
        }
    });

    //获取平台任务信息
    $.ajax({
        url:basePath +　"/auth/getTaskInfo"/*"/views/common/json/task.json"*/,
        plugin:false,
        success:function(data){
            var $task = $("[data-module=task]");
            if(data.taskCount>0){
                $task.append('<span class="sup task-count"></span><div class="dropdown-menu pull-right dropdown-menu-scaleIn with-arrow task-dropdown-menu"><iframe id="task-iframe" src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="display:none;position:absolute; visibility:inherit;margin:-20px 0 0 -20px;height:100%; width:100%; z-Index:-1;"  filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)> </iframe><ul></ul></div>');
                $(".task-count",$task).html(data.taskCount>99?"99+":data.taskCount);
                var taskList = "";
                $(".task-dropdown-menu ul",$task).empty();
                $.each(data.taskItemList,function(n,el){
                    taskList += '<li><div class="task-title">'+el.title+'</div><div class="task-time">'+el.updateTime+'</div></li>';
                });
                taskList += '<a class="read-more" href="'+basePath+'/auth/task#/randomCorrect">查看更多</a>';
                $(".task-dropdown-menu ul",$task).empty().append(taskList);
            }
        }
    });

    /*头部菜单控制ocx显示隐藏*/
    $(".user-manage-wrap").on('show.bs.dropdown', function () {
        if($("#iframebar").length>0){
            $("#iframebar").css("display","block");
        }
    });
    $(".user-manage-wrap").on('hide.bs.dropdown', function () {
        if($("#iframebar").length>0){
            $("#iframebar").css("display","none");
        }
    });
    $("li[data-module=task]").hover(function(){
        if($("#task-iframe").length>0){
            $("#task-iframe").css("display","block");
        }
    },function(){
        if($("#task-iframe").length>0){
            $("#task-iframe").css("display","none");
        }
    });


    //获取平台版本信息
    function getVersion() {
        $.ajax({
            url: basePath + "/license/getVersionInfo",
            plugin: false,
            type: "GET",
            success: function (data) {
                $(".version-info").append('<div>平台版本：' + (typeof data != "undefined" && data.version ? data.version : "") + '</div>' +
                    '<div>项目信息：' + (typeof data != "undefined" && data.cunstomerName ? data.cunstomerName : "") + '</div>' +
                    '<div>到期时间：' + (typeof data != "undefined" && data.expireDate ? data.expireDate : "") + '</div>' +
                    '<div>最大社区数：' + (typeof data != "undefined" && data.estateMaxNum ? data.estateMaxNum : "") + '</div>');
            }
        })
    }

    //获取密码等级
    function getPwdLevel(callback) {
        $.ajax({
            url: basePath + "/auth/getPwdLevel",
            plugin: false,
            type: "GET",
            success: function (data) {
                pwdLevel = data.pwdLevel;
                callback();
            }
        })
    }

    //上传license
    function uploadLicense() {
        //判断是否为空
        if($("#iep-licenseUploadField").val().length === 0){
            $(".license-error").html("请选择要上传的license文件！").show();
        }else{
            $.mask({
                loading: true,
                msg: "正在导入……请稍后"
            });
            $.ajaxFileUpload({
                url: basePath + '/license/putUploadLicense',
                secureuri: false,
                fileElementId: 'iep-licenseUploadField',//file控件id
                dataType: 'json',
                type:'POST',
                success: function (data, status) {
                    $.unmask();

                    $(".license-error").html(data.message).show();
                    if (data.success) {
                        $(".license-error").hide();
                        window.location.href = basePath + "/auth/mainPage";
                    }
                },
                error: function (data, status, e) {
                }
            });
        }
    }

    //修改密码表单验证
    function changePwdValidate() {
        var $formPwdChange = $("#iep-changePwd-form");
        $formPwdChange.bootstrapValidator({
            fields: {
                oldPwd: {
                    validators: {
                        notEmpty: {
                            message: '请输入原密码'
                        }
                    }
                },
                newPwd: {
                    validators: {
                        notEmpty: {
                            message: '请输入新密码'
                        },
                        func: {
                            func: function (value) {
                                var rank = $.getPwdRank(value, "");
                                if (rank > pwdLevel) {
                                    return true;
                                } else return false;
                            },
                            message: function(){
                                var levelPwd = {};
                                switch(pwdLevel){
                                    case 0:
                                        levelPwd.describe = '密码需为大写字母、小写字母、数字中的两类字符组合，且长度为8-16位。';
                                        break;
                                    case 1:
                                        levelPwd.describe = '密码需选择以下组合中的任意一种，大小写字母组合、大写字母和特殊字符组合、小写字母和特殊字符组合、数字和特殊字符组合，且长度为8-16位。';
                                        break;
                                    case 2:
                                        levelPwd.describe = '密码需为大写字母、小写字母、数字、特殊字符中的三类字符组合，且长度为8-16位。';
                                        break;
                                }
                                return '当前密码等级过低'+'，请输入'+ levelPwd.describe
                            }
                        }
                    }
                },
                pwdIdentical: {
                    trigger:"focus keyup blur",
                    validators: {
                        identical: {
                            field: "newPwd",
                            message: '前后输入密码不一致'
                        }
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            e.preventDefault();

            //触发密码确认密码校验
            $formPwdChange.data("bootstrapValidator").updateStatus('pwdIdentical', 'NOT_VALIDATED');
            $formPwdChange.data("bootstrapValidator").validateField('pwdIdentical');

            //校验通过，则触发请求
            if($formPwdChange.data("bootstrapValidator").isValid()){
                var formResults = $formPwdChange.serializeJson();
                formResults.oldPwd = sha256_digest(formResults.oldPwd);
                formResults.newPwd = sha256_digest(formResults.newPwd);
                delete formResults.pwdIdentical;
                formResults.accountId = accountId;

                $.ajax({
                    url: basePath + "/auth/updatePassword",
                    data: formResults,
                    plugin: false,
                    success: function (data) {
                        $.toast({
                            message: data.message,
                            state: data.success
                        });
                        if (data.success) {
                            $("#iep-modal-changePwd").modal('hide');
                        }
                    }
                });
            }

        });
    }

    //复原关于对话框内容
    function aboutReset(self) {
        self.find(".upload-box,.license-error").hide();
        self.find(".modal-operate").show();
        //重置文本域输入框
        $.clearInputFile($("#iep-licenseUploadField")[0]);
        /*$("#iep-licenseUploadField").val("");*/
        $(".license-error").empty();
        /*$('[data-uploadUI]').uploadUI("cleanValue");*/
        self.modal('resetPosition');
    }

    //复原修改密码对话框内容
    function changePwdReset() {
        $("#iep-changePwd-form")[0].reset();
        $("#iep-changePwd-form").bootstrapValidator("destroy");
        $(".pwd-strength").hide();
    }

    //打开上传license
    $(document).on("click", "#iep-newLicenseBtn", function () {
        if(admin){
            $(this).parent().addClass(fadeOut).one(animateEndEvent, function () {
                $(this).removeClass(fadeOut).hide();
                $(".upload-box").show().addClass(fadeIn).one(animateEndEvent, function () {
                    $(this).removeClass(fadeIn);
                });
                $("#iep-modal-about").modal('resetPosition');
            });
        }else{
            $.toast({
                message:"非admin账户，无法上传license！",
                state:false
            })
        }
    });

    //关闭上传license
    $(document).on("click", ".upload-box .close", function () {
        $(".upload-box").addClass(fadeOut).one(animateEndEvent, function () {
            $(this).removeClass(fadeOut).hide();
            $(".modal-operate").show().addClass(fadeIn).one(animateEndEvent, function () {
                $(this).removeClass(fadeIn);
            })
            $("#iep-modal-about").modal('resetPosition');
            //重置文件域input框
            $('[name=license-fileValue]').val("");
            $.clearInputFile($("#iep-licenseUploadField")[0]);
            /*$("#iep-licenseUploadField").val("");*/
            $(".license-error").empty();
            /*$('[data-uploadUI]').uploadUI("cleanValue");*/
        })
    });

    //上传license
    $(document).on("click", "#iep-licenseUploadBtn", _.debounce( function () {
        //文件上传
        uploadLicense();
    }, 800 ) );

    //关于、修改密码
    $(document).on("click", ".user-manage-wrap [data-toggle='modal']", function () {
        var target = $(this).data("target");
        var $el = $(target);
        switch (target) {
            case "#iep-modal-about":
                if (!aboutPageFlag) {
                    $el.load(basePath + "/views/common/jsp/about.html", function () {
                        $el.modal('resetPosition');
                        getVersion();
                        /*$('[data-uploadUI]').uploadUI();*/
                        $el.on('hidden.bs.modal', function () {
                            aboutReset($el);
                        });
                        aboutPageFlag = true;
                    })
                }
                break;
            case "#iep-modal-changePwd":
                if (!changePwdPageFlag) {
                    $el.load(basePath + "/views/common/jsp/changePwd.html", function () {
                        $el.modal('resetPosition');

                        $("#newPwd").pwdStrength();
                        getPwdLevel(changePwdValidate);
                        $el.on('hidden.bs.modal', function () {
                            changePwdReset();
                        });
                        changePwdPageFlag = true;
                    })
                } else {
                    getPwdLevel(changePwdValidate);
                }
                break;
        }
    });

    //退出登录
    $(document).on("click", ".top-menu-logout", function () {
        //弹出提示框
        $.notice({
            message:"是否退出登录？",
            buttons: [{
                onclick: function () {
                    $.ajax({
                        url: basePath + "/auth/logout",
                        plugin: false,
                        type: "GET",
                        success: function () {
                            window.location.href = basePath + "/auth/loginPage";
                        }
                    })
                }
            }, {
                text: "取消"
            }]
        });

    })
})(jQuery);


