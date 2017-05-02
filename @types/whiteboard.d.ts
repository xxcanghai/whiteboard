declare namespace wb {
    /**
     * 用户socket对象
     */
    interface socketClient extends SocketIO.Socket {
        /**
         * 当前用户GUID
         * 
         * @type {string}
         */
        uid: string;
    }

    /**
     * 用户实体基类
     */
    interface baseUser {
        /**
         * 用户名 
         * 
         * @type {string}
         */
        name: string;

        /**
         * 用户的uid，随机字符串
         * 
         * @type {string}
         */
        uid: string;
        /**
        * 当前用户鼠标光标位置
        * 
        * @type {Point}
        */
        position: Point;
    }

    /**
     * 在服务器端的一个用户实体
     * 
     * @interface serverUser
     * @extends {baseUser}
     */
    interface serverUser extends baseUser {
        /**
         * 当前用户的socket连接对象
         * 
         * @type {wb.socketClient}
         */
        socket: wb.socketClient;
    }

    /**
     * 在浏览器端的一个用户实体
     * 
     * @interface clientUser
     * @extends {baseUser}
     */
    interface clientUser extends baseUser {

    }

    /**
     * 用户发起的login事件传输实体。用户登录操作
     * 
     * @interface clientLogin
     */
    interface clientEmitLogin {
        /**
         * 当前要登录的用户名
         * 
         * @type {string}
         */
        name: string;
    }

    /**
     * 服务器端发起的login事件传输实体。有新用户登录操作
     * 
     * @interface serverLogin
     */
    interface serverEmitLogin {
        /**
         * 只包含用户名和uid的在线用户数组
         * 
         * @type {wb.user[]}
         */
        onLineUserArr: wb.clientUser[];

        /**
         * 当前登录的用户对象
         * 
         * @type {clientUser}
         */
        user: clientUser;
    }

    /**
     * 服务器端发起的login确认事件传输实体。通知当前用户登录成功
     * 
     * @interface serverLogin
     */
    interface serverEmitLoginACK extends serverEmitLogin {
    }

    /**
     * 浏览器端发起Logout操作传输实体，有用户主动退出登录
     * 
     * @interface clientLogout
     */
    interface clientEmitLogout {

    }

    /**
     * 服务器端发起的Logout事件传输实体，有用户退出登录操作
     * 
     * @interface serverLogout
     */
    interface serverEmitLogout extends serverEmitLogin {
    }

    /**
     * 客户端发起的drawLine事件传输实体，发送画线数据
     * 
     * @interface clientEmitDrawLine
     */
    interface clientEmitDrawLine extends DrawLine {
    }

    /**
     * 服务器端发起的drawLine事件的传输实体，向所有人通知有人发送了划线数据
     * 
     * @interface serverEmitDrawLine
     */
    interface serverEmitDrawLine extends DrawLine {
        /**
         * 当前发出画线的用户对象
         * 
         * @type {wb.clientUser}
         */
        user: wb.clientUser;
    }

    interface clientEmitPenMove {
        /**
         * 画笔坐标X
         * 
         * @type {number}
         */
        x: number;
        /**
         * 画笔坐标Y
         * 
         * @type {number}
         */
        y: number;
    }

    interface serverEmitPenMove {
        /**
        * 当前发出画线的用户对象
        * 
        * @type {wb.clientUser}
        */
        user: wb.clientUser;
    }

    interface DrawLine {

        /**
         * 绘制线条开始坐标点
         * 
         * @type {Point}
         */
        startPoint: Point;
        /**
         * 绘制线条结束坐标点
         * 
         * @type {Point}
         */
        endPoint: Point;
        /**
         * 线条颜色
         * 
         * @type {string}
         */
        color: string;
        /**
         * 线条宽度
         * 
         * @type {number}
         */
        width: number;
    }

    interface Point {
        x: number;
        y: number;
    }

}