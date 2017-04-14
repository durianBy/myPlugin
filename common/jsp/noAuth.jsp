<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" import="com.hikvision.cloud.iep.auth.dto.UserModuleDTOResult" pageEncoding="UTF-8"%>
<%
    final String baseurl = request.getContextPath();//获取项目基础路径
    final String userModuel = (String)session.getAttribute("userModuleDtoResultJson");
    final UserModuleDTOResult userAllModule = (UserModuleDTOResult)session.getAttribute("userModuleDtoResultObj");
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta content="IE=edge">
    <title>社区大联网平台</title>
    <link rel="stylesheet" href="<%= baseurl %>/modules/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" href="<%= baseurl %>/plugin/bootstrap-table/css/bootstrap-table.css">
    <link rel="stylesheet" href="<%= baseurl %>/plugin/jquery.citySelect.js/css/citySelect.css">
    <link rel="stylesheet" type="text/css" href="<%= baseurl %>/views/common/css/normalize.css"/>
    <link rel="stylesheet" type="text/css" href="<%= baseurl %>/views/common/css/animate.css"/>
    <link rel="stylesheet" type="text/css" href="<%= baseurl %>/views/common/css/base.css"/>
    <script>
        window.basePath = '<%=baseurl %>';//将项目路径保存为全局变量
        window.usermoduel = JSON.parse('<%=userModuel %>');//缓存项目权限变量
    </script>
</head>
<body >
<div class="noAuth-wrapper">
    <div class="content">NO AUTH</div>
</div>
<script src="<%= baseurl %>/modules/jquery/jquery.min.js"></script>
<script src="<%= baseurl %>/modules/bootstrap/js/bootstrap.min.js"></script>
<script src="<%= baseurl %>/modules/underscore/underscore-min.js"></script>
<script src="<%= baseurl %>/modules/backbone/backbone-min.js"></script>
<script src="<%= baseurl %>/modules/seajs/sea.js"></script>
<script src="<%= baseurl %>/views/common/js/loader.js"></script>
<script src="<%= baseurl %>/views/common/js/common.js"></script>
<script src="<%= baseurl %>/views/common/js/plugin.js"></script>
<%--<script type="text/javascript">
    seajs.use(basePath + "/views/config/js/config", function (conFig) {
        var config = new conFig();
    });
</script>--%>

</body>
</html>


