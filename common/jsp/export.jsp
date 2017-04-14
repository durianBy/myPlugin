<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" import="com.hikvision.cloud.iep.auth.dto.UserModuleDTOResult" pageEncoding="UTF-8" %>
<%
    final String baseurl = request.getContextPath();//获取项目基础路径
    final String userModuel = (String) session.getAttribute("userModuleDtoResultJson");
    final UserModuleDTOResult userAllModule = (UserModuleDTOResult) session.getAttribute("userModuleDtoResultObj");
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta content="IE=edge">
    <title>社区大联网平台</title>
    <link rel="stylesheet" type="text/css" href="<%= baseurl %>/modules/bootstrap/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="<%= baseurl %>/views/common/css/normalize.css"/>
    <link rel="stylesheet" type="text/css" href="<%= baseurl %>/views/common/css/base.css"/>
    <link rel="stylesheet" type="text/css" href="<%= baseurl %>/views/common/iconFont/style.css"/>
    <script>
        window.basePath = '<%=baseurl %>';//将项目路径保存为全局变量
        window.usermoduel = JSON.parse('<%=userModuel %>');//缓存项目权限变量
    </script>
</head>
<body class="exportWin">
<%--${condition.countTimeType }
${condition.startTimeStr }
${condition.endTimeStr }
${condition.monthStr }
${condition.year }
${condition.season }
${condition.regionId }
${condition.regionType }
统计区域名称：${reginName}
名称id：${condition.typeCode}}
action的url：${condition.actionUrl}--%>


<%--<fmt:parseDate value="${condition.startTime}" var="date" pattern="yyyy-MM-dd HH:mm:ss"/>--%>
<div class="export-wrap">
    <div class="export-content">
        <div class="type-name"></div>
        <div class="area">
            <span class="title">统计区域：</span>
            <span class="content">${reginName}</span>
        </div>
        <div class="time">
            <span class="title">时间范围：</span>
            <span class="content"></span>
        </div>
    </div>
    <div class="export-footer">
        <div class="foot-text">
            正在导出数据，请稍候…
        </div>
    </div>
    <a class="loading-wrapper">
        <img src="<%= baseurl %>/views/common/img/load-export.gif" alt="正在加载...">
    </a>
    <c:choose>
        <c:when test="${condition.type==0}">
            <form id="dataForm" class="hide">
                <input name="countTimeType" value="${condition.countTimeType }">
                <input name="startTime" value="${condition.startTimeStr }">
                <input name="endTime" value="${condition.endTimeStr }">
                <input name="month" value="${condition.monthStr }">
                <input name="year" value="${condition.year }">
                <input name="season" value="${condition.season }">
                <input name="regionId" value="${condition.regionId }">
                <input name="regionType" value="${condition.regionType }">
                <input name="reginName" value="${reginName }">
                <input name="typeCode" value="${condition.typeCode }">
                <input name="actionUrl" value="${condition.actionUrl }">
                <input name="picture" value="${condition.picture }">
                <%--<input name="fixedPicture" value="${condition.fixedPicture }">
                <input name="tempPicture" value="${condition.tempPicture }">--%>
            </form>
        </c:when>
        <c:otherwise>
            <form id="dataForm" class="hide">
                <input name="reginName" value="${reginName }">
                <input name="actionUrl" value="${condition.actionUrl }">
                <input name="startDate" value="${condition.startDate }">
                <input name="endDate" value="${condition.endDate }">
                <input name="pageNo" value="${condition.pageNo }">
                <input name="pageSize" value="${condition.pageSize }">
                <input name="estateId" value="${condition.estateId }">
                <input name="countTimeType" value="${condition.countTimeType }">
                <input name="queryType" value="${condition.queryType }">
                <input name="startTime" value="${condition.startTimeStr }">
                <input name="endTime" value="${condition.endTimeStr }">
                <input name="month" value="${condition.monthStr }">
                <input name="year" value="${condition.year }">
                <input name="season" value="${condition.season }">
                <input name="fixedPicture" value="${condition.fixedPicture }">
                <input name="tempPicture" value="${condition.tempPicture }">
            </form>
        </c:otherwise>
    </c:choose>


</div>
</body>


<script src="<%= baseurl %>/modules/jquery/jquery.min.js"></script>
<script src="<%= baseurl %>/modules/bootstrap/js/bootstrap.min.js"></script>
<script src="<%= baseurl %>/modules/underscore/underscore-min.js"></script>
<script src="<%= baseurl %>/modules/backbone/backbone-min.js"></script>
<script src="<%= baseurl %>/modules/seajs/sea.js"></script>
<script src="<%= baseurl %>/views/common/js/loader.js"></script>
<script src="<%= baseurl %>/views/common/js/common.js"></script>
<script src="<%= baseurl %>/views/common/js/plugin.js"></script>
<script type="text/javascript">
    seajs.use(basePath + "/views/common/js/myExport.js", function (myexport) {
        var myexport = new myexport();
    });
</script>
</body>
</html>


