"use strict";
var socketio = require("socket.io");
var _ = require("underscore");
module.exports = function chatroomio(httpServer) {
    /** 所有房间字典，内为当前房间的在线登录用户数组 */
    var onLineUserArr = [];
    var server = socketio(httpServer);
    server.on("connection", function (client) {
        console.log("socket.io on connection!一个用户进入");
        //监听新用户加入
        client.on('login', function (data, ack) {
            //创建全新的一个服务器端User用户
            var user = createServerUser(data.name, client, getGUID());
            //将uid写入socket对象中
            client.uid = user.uid;
            onLineUserArr.push(user);
            //向当前用户所在的房间的所有用户广播有新用户加入
            var serverLoginData = {
                onLineUserArr: onLineUserArr.map(function (u) { return getClientUserByServerUser(u); }),
                user: getClientUserByServerUser(getUser(client))
            };
            ack(serverLoginData);
            client.broadcast.emit('login', serverLoginData); //向所有连接进来的客户端发送有新用户登录通知
            // client.broadcast.emit("login",serverLoginData);//向除了自己以外的所有客户端发送事件
            console.log(data.name + ' 加入了多人白板');
        });
        //监听用户链接断开
        client.on('disconnect', function (data) {
            console.log("disconnect");
            var user = getUser(client);
            if (user == null)
                return;
            logout(user.socket, function () { });
            client.leaveAll();
        });
        //监听用户退出
        client.on('logout', function (data, ack) {
            console.log("logout");
            var user = getUser(client);
            if (user == null)
                return;
            logout(user.socket, ack);
        });
        //监听用户发送的画线数据
        client.on('drawLine', function (data, ack) {
            //向所有客户端广播发布的消息
            var serverChatData = _.extend({
                user: getClientUserByServerUser(getUser(client))
            }, data);
            ack(serverChatData);
            client.broadcast.emit('drawLine', serverChatData);
        });
    });
    /**
     * 根据Socket返回当前用户信息
     *
     * @param {wb.socketClient|string} client
     * @returns {wb.user}
     */
    function getUser(client) {
        var userArr = [];
        var uid;
        if (client.uid === undefined)
            return null;
        uid = client.uid;
        userArr = onLineUserArr.filter(function (u) { return u.socket === client; });
        if (userArr.length > 0) {
            return userArr[0];
        }
        else {
            return null;
        }
    }
    /**
     * 创建一个服务器的用户实体
     *
     * @param {string} name
     * @param {wb.socketClient} socket
     * @param {string} uid
     * @returns
     */
    function createServerUser(name, socket, uid) {
        var user = {
            name: name,
            socket: socket,
            uid: uid
        };
        return user;
    }
    /**
     * 根据一个服务器用户返回一个浏览器用户对象
     *
     * @param {wb.serverUser} serverUser 服务器用户对象
     * @returns {wb.clientUser}
     */
    function getClientUserByServerUser(serverUser) {
        var clientUser = _.extend({}, serverUser);
        delete clientUser.socket;
        return clientUser;
    }
    function logout(client, ack) {
        var user = getUser(client);
        if (user == null)
            return false;
        onLineUserArr.splice(onLineUserArr.indexOf(user), 1);
        //向所有客户端广播有用户退出
        var logoData = {
            onLineUserArr: onLineUserArr.map(function (u) { return getClientUserByServerUser(u); }),
            user: getClientUserByServerUser(user)
        };
        ack(logoData);
        client.broadcast.emit('logout', logoData);
        client.disconnect();
        console.log(user.name + '退出了多人白板');
        return true;
    }
    /**
     * 获得一个不重复的随机数字符串
     */
    function getGUID() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 89999 + 10000);
    }
    ;
};
//# sourceMappingURL=whiteboard.js.map