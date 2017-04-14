/**
 * Created by zhengjunling on 2016/7/1.
 */
define(function (require, exports, module) {
    var _modulePath = "";
    var Router = function (path) {
        _modulePath = path ? path : "";
        new NavRouter;
    };
    var NavRouter = Backbone.Router.extend({
        routes: {
            "platForm(/:opera)": "platForm",//平台接入
            "platForm/:opera/:id": "platForm",//平台接入
            "userManage(/:opera)": "userManage",//用户管理
            "userManage/:opera/:id": "userManage",//用户管理
            "logManage": "logManage",//日志管理
            "paramConfig": "paramConfig", //参数配置
            "safeNetwork": "safeNetwork", //安防联网配置
            "roleManage": "roleManage", //角色管理
            "qualityControl/patrolPositionEdit/:id": "patrolPositionEdit",//巡查点位编辑操作
            "qualityControl/testLabel/testLabel":"testLabel",
            "qualityControl/testLabel/addTestLabel": "addTestLabel",//考评标签,具体名称到时修改
            "qualityControl/testLabel/updateTestLabel/:id": "updateTestLabel",//修改考评标签
            "qualityControl/planConfig/planConfig" : "planConfig",
            "qualityControl/planConfig/planConfigAdd":"planConfigAdd",
            "qualityControl/planConfig/planConfigUpdate/:id":"planConfigUpdate",
            "qualityControl/qualityControlTask/qualityControlTask":"qualityControlTask",
            "qualityControl/qualityControlTask/addTask":"addTask",
            "qualityControl/qualityControlTask/updateTask/:id":"updateTask",
            "*action/:subnav" : "subNav",
            "*action": "home"
        },
        url: null,
        //跳转到导航第一个菜单
        home: function () {
            var $nav = $(".sidebar-nav");
            var $firstNav = $nav.children("li:first-child");
            if ($firstNav.find("ul").length) {
                this.url = $firstNav.find("ul>li:first-child>a").attr("href");
            } else {
                this.url = $firstNav.children("a").attr("href");
            }
            $.resetNav();
            this.navigate(this.url, {trigger: true});
        },

        //跳转到父级菜单下的第一个子菜单
        subHome: function ($parent) {
            this.url = $parent.parent().find("ul>li:first-child>a").attr("href");
            $.resetNav();
            this.navigate(this.url, {trigger: true});
        },

        //跳转到二级菜单
        subNav: function (action, sub) {
            var $nav = $(".sidebar-nav");
            var $parent = $nav.find("[href='#/" + action + "']");
            var $child = $nav.find("[href='#/" + action + "/" + sub + "']");
            if (!$parent.length) {
                this.home();
            } else if (!$child.length) {
                this.subHome($parent);
            } else {
                $parent.parent().addClass("is-open").find("ul").show();
                $child.parent().addClass("active").siblings().removeClass("active");
                require.async(_modulePath + action + "/" + sub, function (module) {
                    new module("#tab1");
                });
            }
        },

        //平台接入
        platForm: function (opera, id) {
            $("[href='#/platForm']").parent().addClass("active").siblings().removeClass("active");
            var url;
            switch (opera) {
                case null :
                    url = _modulePath + 'platForm/platForm';
                    break;
                case 'add' :
                case 'edit' :
                    url = _modulePath + 'platForm/platFormAdd';
                    break;
                case 'imp' :
                    url = _modulePath + 'platForm/platFormImport';
                    break;
            }
            require.async(url, function (platFormOpera) {
                var platformopera = new platFormOpera(opera, id);
            })
        },

        //用户管理
        userManage: function (opera, id) {
            $("[href='#/userManage']").parent().addClass("active").siblings().removeClass("active");
            var url;
            switch (opera) {
                case null :
                    url = _modulePath + 'userManage/userManage';
                    break;
                case 'add' :
                case 'edit' :
                    url = _modulePath + 'userManage/userManageAdd';
                    break;
            }
            require.async(url, function (userManageOpera) {
                var usermanageopera = new userManageOpera(opera, id);
            })
        },

        //日志管理
        logManage: function () {
            $("[href='#/logManage']").parent().addClass("active").siblings().removeClass("active");
            require.async(_modulePath + 'logManage/logManage', function (logManage) {
                var logManage = new logManage;
            })
        },

        //参数配置
        paramConfig: function () {
            $("[href='#/paramConfig']").parent().addClass("active").siblings().removeClass("active");
            require.async(_modulePath + 'paramConfig/paramConfig', function (paramConfig) {
                var paramConfig = new paramConfig;
            })
        },
        //安防联网配置
        safeNetwork: function () {
            $("[href='#/safeNetwork']").parent().addClass("active").siblings().removeClass("active");
            require.async(_modulePath + 'safeNetwork/safeNetwork', function (safeNetwork) {
                var safeNetwork = new safeNetwork;
            })
        },
        //角色管理
        roleManage: function () {
            $("[href='#/roleManage']").parent().addClass("active").siblings().removeClass("active");
            require.async(_modulePath + 'roleManage/roleManage', function (roleManage) {
                var roleManage = new roleManage;
            })
        },
        //巡查点位编辑操作
        patrolPositionEdit:function(id){
            var url = _modulePath + 'qualityControl/patrolPositionEdit';
            require.async(url, function (patrolPoaitionEdit) {
                var patrolPoaitionEdit = new patrolPoaitionEdit(id);
            })
        },
        testLabel : function(id){
            var url = _modulePath + 'qualityControl/testLabel/testLabel';
            require.async(url, function (testLabel) {
                var testLabel = new testLabel(id);
            });
        },
        addTestLabel:function(id){
            var url =_modulePath + 'qualityControl/testLabel/addTestLabel';
            require.async(url, function (addTestLabel) {
                var addTestLabel = new addTestLabel(id);
            });
        },
        updateTestLabel : function(id){
            var url =_modulePath + 'qualityControl/testLabel/updateTestLabel';
            require.async(url, function (updateTestLabel) {
                var updateTestLabel = new updateTestLabel(id);
            });
        },
        planConfig : function(id){
            var url =_modulePath + 'qualityControl/planConfig/planConfig';
            require.async(url, function (planConfig) {
                var planConfig = new planConfig(id);
            });
        },
        planConfigAdd : function(id){
            var url =_modulePath + 'qualityControl/planConfig/planConfigAdd';
            require.async(url, function (planConfigAdd) {
                var planConfigAdd = new planConfigAdd(id);
            });
        },
        planConfigUpdate : function(id){
            var url =_modulePath + 'qualityControl/planConfig/planConfigUpdate';
            require.async(url, function (planConfigUpdate) {
                var planConfigUpdate = new planConfigUpdate(id);
            });
        },
        qualityControlTask : function(){
            var url =_modulePath + 'qualityControl/qualityControlTask/qualityControlTask';
            require.async(url, function (qualityControlTask) {
                var qualityControlTask = new qualityControlTask();
            });
        },
        addTask : function(){
            var url =_modulePath + 'qualityControl/qualityControlTask/addTask';
            require.async(url, function (addTask) {
                var addTask = new addTask();
            });
        },
        updateTask : function(id){
            var url =_modulePath + 'qualityControl/qualityControlTask/updateTask';
            require.async(url, function (updateTask) {
                var updateTask = new updateTask(id);
            });
        }
    });

    module.exports = Router;
});
