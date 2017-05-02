"use strict";
var server;
var vm;
/** socket服务器地址 */
var socketServerUrl = location.protocol + "//" + location.host;
var vmData = {
    /** 登录用户名 */
    userName: new Date().getTime().toString().substr(5),
    loginUserName: "",
    /** 当前用户是否已经登录 */
    isLogin: false,
    /** 在线用户列表 */
    onLineUserArr: [],
    /** 日志消息数组 */
    logArr: [],
    penWidth: draw.penWidth,
    penColor: draw.penColor,
    JSON: JSON
};
var vmMethod = {
    /** 修改用户名 */
    changeUserName: function () {
        if (vm.userName == vm.loginUserName)
            return;
        if (vm.userName.trim().length == 0) {
            alert("请填写用户名");
            vm.userName = vm.loginUserName;
            return;
        }
        clientLogout();
        clinetLogin();
    }
};
var vmComputed = {};
var vmWatch = {
    penWidth: function (v) {
        draw.penWidth = vm.penWidth;
    },
    penColor: function (v) {
        draw.penColor = vm.penColor;
    }
};
vm = new Vue({
    el: "#main",
    data: vmData,
    methods: vmMethod,
    watch: vmWatch,
    computed: vmComputed,
    mounted: function () {
    },
    created: function () {
        console.log("created");
    },
    beforeMount: function () {
        console.log("beforeMount");
    }
});
clinetLogin();
draw.onDrawLine = function (startPoint, endPoint) {
    server.emit("drawLine", {
        startPoint: startPoint,
        endPoint: endPoint,
        color: draw.penColor,
        width: draw.penWidth
    }, function () { });
};
/**
 * 浏览器端发起用户登录
 *
 * @param {string} username 用户名
 */
function clinetLogin() {
    server = io(socketServerUrl, {});
    server.emit("login", {
        name: vm.userName
    }, function (data) {
        log("当前用户登录成功");
        // vm.currentUser = data.user;
        vm.onLineUserArr = data.onLineUserArr;
        vm.isLogin = true;
        vm.loginUserName = data.user.name;
    });
    server.on("login", onServerLogin);
    server.on("logout", onServerLogout);
    server.on("drawLine", onServerDrawLine);
}
function clientLogout() {
    server.emit("logout", {}, function () { });
}
/**
 * 接受到其他用户登录操作
 *
 * @param {wb.serverEmitLogin} d
 */
function onServerLogin(d) {
    console.log("onServerLogin", d);
    vm.onLineUserArr = d.onLineUserArr;
    log("新用户<" + d.user.name + ">登录");
}
/**
 * 接收到其他用户退出操作
 *
 * @param {wb.serverEmitLogout} d
 */
function onServerLogout(d) {
    console.log("onServerLogout", d);
    vm.onLineUserArr = d.onLineUserArr;
    log("用户<" + d.user.name + ">退出");
}
/**
 * 接收到其他用户的划线操作
 *
 * @param {wb.serverEmitDrawLine} d
 */
function onServerDrawLine(d) {
    console.log("onServerDrawLine", d);
    draw.serverDrawLine(d.startPoint, d.endPoint, d.color, d.width);
}
function log(str) {
    vm.logArr.unshift(str);
    console.log(str);
}
//# sourceMappingURL=index.js.map