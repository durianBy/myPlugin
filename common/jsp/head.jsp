<%--
    Created by zhengjunling on 2016/6/18.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<link rel="stylesheet" type="text/css" href="<%= baseurl %>/views/common/css/head.css"/>
<header class="header-container bg-primary">
    <div class="logo">
        <span class="logo-icon icon-LOGO"></span>
        <h1 class="logo-text"></h1>
    </div>
    <script>
        document.getElementsByClassName("logo-text")[0].innerText = platName;
    </script>
    <%--用户菜单div模块START--%>
    <div class="user-manage-wrap right">
        <a class="icon-user-management js-user-manage head-nav" data-toggle="dropdown"></a>

        <div class="dropdown-menu pull-right dropdown-menu-scaleIn with-arrow ">
            <iframe id='iframebar' src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0
                    style="display:none;position:absolute; visibility:inherit;margin:-20px 0 0 -20px;height:100%;  width:100%; z-Index:-1;"  filter=progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)>
            </iframe>
            <div class="userInfo">

                <div class="user-header">
                    <span class="user">zhangsan</span><span class="due-date">2099-12-31到期</span>
                </div>
                <div class="user-content">
                    <span class="userName">张三</span><span class="telephone">18865652512</span>
                </div>
            </div>
            <ul class="user-menu clearfix">
                <li><a href="<%=baseurl %>/views/common/file/user-guide.pdf"><i class="icon-Warning"></i> 帮助</a></li>
                <li><a data-toggle="modal" data-target="#iep-modal-about"><i class="icon-fengxian"></i> 关于</a></li>
                <li><a data-toggle="modal" data-target="#iep-modal-changePwd" data-lock><i class="icon-password"></i> 修改密码</a></li>
                <li><a class="top-menu-logout"><i class="icon-Sign-out"></i> 退出登录</a></li>
            </ul>

        </div>
    </div>
    <%--用户菜单div模块END--%>
    <ul class="top-right clearfix">
        <%--<c:forEach var="list" items="${speedDtoList }">
            <li><a class="${list.iconName}" href="<%=baseurl %>${list.moduleUrl}" &lt;%&ndash;target="${list.moduleName}"&ndash;%&gt;
                   title="${list.moduleName}"></a></li>
        </c:forEach>--%>
        <c:forEach var="list" items="${speedDtoList }">
            <li class="${list.checked}" data-module="${list.moduleEnName}"><a href="<%=baseurl %>${list.moduleUrl}" <%--target="${list.moduleName}"--%>
                   title="${list.moduleName}">${list.moduleName}</a>
                <%--<c:if test="${list.moduleEnName == 'task'}"><span class="sup task-count"></span><div class="dropdown-menu pull-right dropdown-menu-scaleIn with-arrow task-dropdown-menu"><ul></ul></div></c:if>--%>
                <%--<% if("task".equals(list.moduleEnName) ){%><span class="sup task-count">99</span><%}%>--%>
            </li>
        </c:forEach>
        <%--<li data-module="task">
            <a title="任务" data-toggle="dropdown">任务</a>
            <span class="sup task-count">99</span>
            <div class="dropdown-menu pull-right dropdown-menu-scaleIn with-arrow task-dropdown-menu">
                <ul class="">
                    <li>
                        <div class="task-title">金隆花园1月第三次考评</div>
                        <div class="task-time">2016-10-27 11:03:30</div>
                    </li>
                    <li>
                        <div class="task-title">金隆花园1月第三次考评</div>
                        <div class="task-time">2016-10-27 11:03:30</div>
                    </li>
                    <li>
                        <div class="task-title">金隆花园1月第三次考评</div>
                        <div class="task-time">2016-10-27 11:03:30</div>
                    </li>
                    <li>
                        <div class="task-title">金隆花园1月第三次考评</div>
                        <div class="task-time">2016-10-27 11:03:30</div>
                    </li>
                </ul>
                <div class="read-more">查看更多</div>
            </div>
        </li>--%>
    </ul>
</header>
