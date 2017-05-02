var draw;
(function (draw) {
    //-------配置对象------
    /** 画笔颜色 */
    draw.penColor = "#000000";
    /** 画笔宽度直径 */
    draw.penWidth = 4;
    /** 每次绘制长度阈值（值越小绘制频率越高，曲线越平滑） */
    draw.drawDistance = draw.penWidth / 2;
    /** 线帽类型 */
    draw.lineCap = "round";
    //------全局变量-------
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    /** 最后一次绘制的坐标点 */
    var lastPoint = createPoint();
    /** 当前绘制的坐标点 */
    var currPoint = createPoint();
    /** 是否鼠标按下 */
    var isMouseDown = false;
    //----可由外部注册的事件----
    draw.onMouseDown = function (e) { };
    draw.onMouseMove = function (e) { };
    draw.onMouseUp = function (e) { };
    draw.onDrawCurveStart = function (startPoint) { };
    draw.onDrawCurveEnd = function (endPoint) { };
    draw.onDrawLine = function (startPoint, endPoint) { };
    init();
    function init() {
        bind();
        resetCanvasSize();
    }
    function bind() {
        //canvas鼠标事件
        canvas.addEventListener("mousedown", mousedown, false);
        canvas.addEventListener("mousemove", mousemove, false);
        canvas.addEventListener("mouseup", mouseup, false);
        canvas.addEventListener("mouseout", mouseout, false);
        canvas.addEventListener("mouseleave", mouseleave, false);
        // 监听浏览器窗口宽高变更
        window.onresize = resetCanvasSize;
    }
    /**
     * 创建一个Point点
     *
     * @returns {Point}
     */
    function createPoint() {
        return { x: 0, y: 0 };
    }
    /**
     * 重设canvas的宽高，会清空canvas
     *
     */
    function resetCanvasSize() {
        var canvasBox = document.querySelector(".main-right");
        canvas.width = canvasBox.clientWidth;
        canvas.height = canvasBox.clientHeight;
    }
    /**
     * 计算两点间距离
     *
     * @param {Point} pt
     * @param {Point} pt2
     * @returns
     */
    function distance(pt, pt2) {
        return Math.sqrt(Math.pow(pt2.x - pt.x, 2) + Math.pow(pt2.y - pt.y, 2));
    }
    /**
     * 绘制一条线
     *
     * @param {boolean} [isForce=false] 是否强制绘制，会忽略最小绘制间距设定
     * @returns
     */
    function drawLine(isForce) {
        if (isForce === void 0) { isForce = false; }
        if (!isMouseDown)
            return;
        var d = distance(lastPoint, currPoint);
        // console.log(d);
        if (isForce || d >= draw.drawDistance) {
            draw.onDrawLine(lastPoint, currPoint);
            context.beginPath();
            context.lineCap = draw.lineCap;
            context.strokeStyle = draw.penColor;
            context.lineWidth = draw.penWidth;
            context.moveTo(lastPoint.x, lastPoint.y);
            context.lineTo(currPoint.x, currPoint.y);
            context.stroke();
            context.closePath();
            lastPoint.x = currPoint.x;
            lastPoint.y = currPoint.y;
        }
    }
    function dratPoint(pt) {
        context.beginPath();
        context.fillStyle = draw.penColor;
        context.arc(pt.x, pt.y, draw.penWidth / 2, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
    function mousemove(e) {
        draw.onMouseMove(e);
        currPoint.x = e.offsetX;
        currPoint.y = e.offsetY;
        drawLine();
    }
    function mousedown(e) {
        draw.onMouseDown(e);
        isMouseDown = true;
        currPoint.x = lastPoint.x = e.offsetX;
        currPoint.y = lastPoint.y = e.offsetY;
        drawCurveStart(new Point(e.offsetX, e.offsetY));
    }
    function mouseup(e) {
        draw.onMouseUp(e);
        drawCurveEnd(new Point(e.offsetX, e.offsetY));
    }
    function mouseleave(e) {
        drawCurveEnd();
    }
    function mouseout(e) {
        drawCurveEnd();
    }
    /**
     * 开始绘制一条曲线，即连续的线（从按下鼠标开始绘制到抬起鼠标结束）
     *
     */
    function drawCurveStart(startPoint) {
        draw.onDrawCurveStart(startPoint);
        drawLine(true);
    }
    /**
     * 结束绘制一条连续的线
     *
     */
    function drawCurveEnd(endPoint) {
        draw.onDrawCurveEnd(endPoint);
        isMouseDown = false;
    }
    //-----------------外部调用方法-----------------
    /**
     * 绘制一条从服务器发来线段
     *
     * @param {Point} startPoint 开始绘制点
     * @param {Point} endPoint 结束绘制点
     * @param {string} color 颜色
     * @param {number} width 宽度
     */
    function serverDrawLine(startPoint, endPoint, color, width) {
        context.beginPath();
        context.lineCap = draw.lineCap;
        context.strokeStyle = color;
        context.lineWidth = width;
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.stroke();
        context.closePath();
    }
    draw.serverDrawLine = serverDrawLine;
    /**
     * 一个坐标点
     *
     * @interface Point
     */
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    draw.Point = Point;
})(draw || (draw = {}));
//# sourceMappingURL=draw.js.map