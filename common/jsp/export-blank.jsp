<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ page language="java" import="com.hikvision.cloud.iep.auth.dto.UserModuleDTOResult" pageEncoding="UTF-8" %>
<%
    final String baseurl = request.getContextPath();//获取项目基础路径
%>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta content="IE=edge">
    <title>社区大联网平台</title>
    <script>
        window.basePath = '<%=baseurl %>';//将项目路径保存为全局变量
    </script>
</head>
<body>
</body>


<script src="<%= baseurl %>/modules/jquery/jquery.min.js"></script>
</body>
</html>


