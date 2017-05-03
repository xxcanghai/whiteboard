namespace draw {
    //-------配置对象------
    /** 画笔颜色 */
    export var penColor = "#000000";
    /** 画笔宽度直径 */
    export var penWidth = 4;
    /** 每次绘制长度阈值（值越小绘制频率越高，曲线越平滑） */
    export var drawDistance = penWidth * 2;
    /** 线帽类型 */
    export var lineCap = "round";


    //------全局变量-------
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    var context: CanvasRenderingContext2D = canvas.getContext("2d");
    /** 最后一次绘制的坐标点 */
    var lastPoint: Point = createPoint();
    /** 当前绘制的坐标点 */
    var currPoint: Point = createPoint();
    /** 是否鼠标按下 */
    var isMouseDown = false;

    //----可由外部注册的事件----
    export var onMouseDown = function (e: MouseEvent) { };
    export var onMouseMove = function (e: MouseEvent) { };
    export var onMouseUp = function (e: MouseEvent) { };
    export var onDrawCurveStart = function (startPoint: Point) { };
    export var onDrawCurveEnd = function (endPoint: Point) { };
    export var onDrawLine = function (startPoint: Point, endPoint: Point) { }


    init();

    function init() {
        bind();
        resetCanvasSize();
    }

    // canvas.addEventListener("mouseout", mouseout, false);
    function bind() {
        //canvas鼠标事件
        canvas.addEventListener("mousedown", mousedown, false);
        canvas.addEventListener("mousemove", mousemove, false);
        canvas.addEventListener("mouseup", mouseup, false);
        // canvas.addEventListener("mouseleave", mouseleave, false);

        // 监听浏览器窗口宽高变更
        window.onresize = resetCanvasSize;
    }

    /**
     * 创建一个Point点
     * 
     * @returns {Point} 
     */
    function createPoint(): Point {
        return { x: 0, y: 0 }
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
    function distance(pt: Point, pt2: Point) {
        return Math.sqrt(Math.pow(pt2.x - pt.x, 2) + Math.pow(pt2.y - pt.y, 2));
    }

    /**
     * 绘制一条线
     * 
     * @param {boolean} [isForce=false] 是否强制绘制，会忽略最小绘制间距设定
     * @returns 
     */
    function drawLine(isForce: boolean = false) {
        if (!isMouseDown) return;
        var d = distance(lastPoint, currPoint);
        // console.log(d);

        if (isForce || d >= drawDistance) {
            onDrawLine(lastPoint, currPoint);
            context.beginPath();
            context.lineCap = lineCap;
            context.strokeStyle = penColor;
            context.lineWidth = penWidth;
            context.moveTo(lastPoint.x, lastPoint.y);
            context.lineTo(currPoint.x, currPoint.y);
            context.stroke();
            context.closePath();
            lastPoint.x = currPoint.x;
            lastPoint.y = currPoint.y;
        }
    }

    function dratPoint(pt: Point) {
        context.beginPath();
        context.fillStyle = penColor;
        context.arc(pt.x, pt.y, penWidth / 2, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }

    function mousemove(e: MouseEvent) {
        onMouseMove(e);
        // debounce(drawOnMouseMove, 100, 300);
        currPoint.x = e.offsetX;
        currPoint.y = e.offsetY;
        drawLine();
    }

    function mousedown(e: MouseEvent) {
        onMouseDown(e);
        isMouseDown = true;
        currPoint.x = lastPoint.x = e.offsetX;
        currPoint.y = lastPoint.y = e.offsetY;
        drawCurveStart(new Point(e.offsetX, e.offsetY));
    }

    function mouseup(e: MouseEvent) {
        onMouseUp(e);
        drawCurveEnd(new Point(e.offsetX, e.offsetY));
    }
    function mouseleave(e: MouseEvent) {
        // console.log(e);
        // var leaveElement: Element = <any>(e.relatedTarget || e.toElement);
        // if (leaveElement.parentElement || leaveElement.parentElement.className.indexOf("cursor") >= 0) {
        //     // leaveElement.parentElement.style.display="none";
        //     return;
        // };
        drawCurveEnd(new Point(e.offsetX, e.offsetY));
    }
    function mouseout(e: MouseEvent) {
        drawCurveEnd(new Point(e.offsetX, e.offsetY));
    }

    /**
     * 开始绘制一条曲线，即连续的线（从按下鼠标开始绘制到抬起鼠标结束）
     * 
     */
    function drawCurveStart(startPoint: Point) {
        onDrawCurveStart(startPoint);
        drawLine(true);
    }

    /**
     * 结束绘制一条连续的线
     * 
     */
    function drawCurveEnd(endPoint: Point) {
        onDrawCurveEnd(endPoint);
        isMouseDown = false;
    }


    /**
     * 函数防抖
     * 
     * @param {Function} fn 要执行的函数
     * @param {number} delay 多少毫秒内的重复调用都不触发
     * @param {number} mustRunDelay 多少毫秒以上必须触发一次
     * @returns 
     */
    function debounce(fn: Function, delay: number, mustRunDelay: number) {
        var timer = null;
        var t_start;
        return function () {
            var context = this, args = arguments, t_curr = +new Date();
            clearTimeout(timer);
            if (!t_start) {
                t_start = t_curr;
            }
            if (t_curr - t_start >= mustRunDelay) {
                fn.apply(context, args);
                t_start = t_curr;
            }
            else {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            }
        };
    };
    //-----------------外部调用方法-----------------

    /**
     * 绘制一条从服务器发来线段
     * 
     * @param {Point} startPoint 开始绘制点
     * @param {Point} endPoint 结束绘制点
     * @param {string} color 颜色
     * @param {number} width 宽度
     */
    export function serverDrawLine(startPoint: Point, endPoint: Point, color: string, width: number) {
        context.beginPath();
        context.lineCap = lineCap;
        context.strokeStyle = color;
        context.lineWidth = width;
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.stroke();
        context.closePath();
    }

    /**
     * 一个坐标点
     * 
     * @interface Point
     */
    export class Point {
        public x: number;
        public y: number;
        constructor(x: number = 0, y: number = 0) {
            this.x = x;
            this.y = y;
        }
    }
}