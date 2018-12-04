// 根据选择器查询元素
const _query = function (el) {
    return document.querySelector(el);
};

// 以 contain 的模式计算自适应坐标和宽高
const _adaptImgContain = function (cntrWidth, cntrHeight, imgWidth, imgHeight) {
    cntrWidth = parseFloat(cntrWidth);
    cntrHeight = parseFloat(cntrHeight);
    imgWidth = parseFloat(imgWidth);
    imgHeight = parseFloat(imgHeight);

    const res = {};
    const imgScale = imgWidth / imgHeight;
    const cntrScale = cntrWidth / cntrHeight;
    /**
     * 1. imgScale > cntrScale 时：
     * - img 的宽必须撑满容器
     * 2. imgScale < cntrScale 时：
     * - img 的高必须撑满容器
     */
    if (imgScale >= cntrScale) {
        res.width = cntrWidth;
        res.height = res.width / imgScale;
        res.x = 0;
        res.y = (cntrHeight - res.height) / 2;
    } else {
        res.height = cntrHeight;
        res.width = res.height * imgScale;
        res.y = 0;
        res.x = (cntrWidth - res.width) / 2;
    }

    return res;
};

// 自适应不同屏幕清晰度
const _getScreenDefRatio = function (context) {
    // 屏幕的设备像素比
    const devicePixelRatio = window.devicePixelRatio || 1;

    // 浏览器在渲染canvas之前存储画布信息的像素比
    const backingStoreRatio = context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;

    // canvas的实际渲染倍率
    const ratio = devicePixelRatio / backingStoreRatio;
    return ratio;
};

// 类
function ImgRemarker (opts) {
    /**
     * 下划线开头的都是私有方法
      */
    // const this = this;
    const DEFAULT_OPTS = {
        WIDTH: '0px',
        HEIGHT: '0px',
        IMG_SRC: '',
        TEXT_HEIGHT: '30px',
        TEXT_STYLE: 'normal',
        TEXT_SIZE: '14px',
        TEXT_FAMILY: 'sans-serif',
        TEXT_COLOR: '#000000'
    };

    // canvas 绘字自动换行
    const _wrapText = (text, x, y, maxWidth, lineHeight) => {
        if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
            return;
        }

        let context = this.ctx;
        let canvas = context.canvas;

        if (typeof maxWidth === 'undefined') {
            maxWidth = (canvas && canvas.width) || 300;
        }
        if (typeof lineHeight === 'undefined') {
            lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
        }

        const arrTexts = text.split('\n');

        for (let i = 0; i < arrTexts.length; i++) {
            // 字符分隔为数组
            let arrText = arrTexts[i].split('');
            let line = '';

            for (let n = 0; n < arrText.length; n++) {
                let testLine = line + arrText[n];
                let metrics = context.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y);
                    line = arrText[n];
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }

            context.fillText(line, x, y + lineHeight * i);
        }
    };

    // 转 canvas 到 img
    const _convertCanvasToImage = () => {
        var image = new Image();
        // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
        // 指定格式 PNG
        image.src = this.canvas.toDataURL('image/png');
        // 以下两行是为了防止 canvas 进行高清屏适配时引起的放大
        image.style.width = this.opts.width + 'px';
        image.style.height = this.opts.height + 'px';
        return image;
    };

    // 校验参数
    const _checkParams = () => {
        // 校验 imgSrc
        if (!this.opts.imgSrc) {
            const err = new Error('imgSrc 不能为空');
            throw err;
        }

        // 校验 width 和 height
        this.opts.width = this.opts.width || DEFAULT_OPTS.WIDTH;
        this.opts.height = this.opts.height || DEFAULT_OPTS.HEIGHT;
        if (isNaN(parseFloat(this.opts.width))) {
            const err = new Error('无效的选项：width');
            throw err;
        }
        if (isNaN(parseFloat(this.opts.height))) {
            const err = new Error('无效的选项：height');
            throw err;
        }

        // 校验 textFont
        this.opts.textStyle = this.opts.textStyle || DEFAULT_OPTS.TEXT_STYLE;
        this.opts.textSize = this.opts.textSize || DEFAULT_OPTS.TEXT_SIZE;
        this.opts.textFamily = this.opts.textFamily || DEFAULT_OPTS.TEXT_FAMILY;
        // 新生成的属性：textFont
        this.opts.textFont = [
            this.opts.textStyle,
            this.opts.textSize,
            this.opts.textFamily
        ].join(' ');

        // 校验 textColor
        this.opts.textColor = this.opts.textColor || DEFAULT_OPTS.TEXT_COLOR;

        // 校验 textHeight
        this.opts.textHeight = parseFloat(this.opts.textHeight || DEFAULT_OPTS.TEXT_HEIGHT);

        // 校验 textLineHeight
        if (this.opts.textLineHeight && isNaN(parseFloat(this.opts.textLineHeight))) {
            throw new Error('无效的选项：textLineHeight');
        } else if (!this.opts.textLineHeight) {
            this.opts.textLineHeight = parseFloat(this.opts.textSize);
        }
        console.log(JSON.stringify(this.opts));
    };

    // 初始化
    const _init = () => {
        // 校验入参
        _checkParams();

        // src 可以为 url 也可以为 dataurl
        const imgSrc = this.opts.imgSrc;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const prm = new Promise(function (resolve, reject) {
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                reject(new Error('图片加载失败'));
            };
        });

        // 初始化配置参数
        this.ctx = ctx;
        this.canvas = canvas;
        this.img = img;

        img.setAttribute('crossOrigin', 'Anonymous');
        img.src = imgSrc;

        return prm.then((m) => {
            // 如果没有传入 width，则默认使用图片的 width
            if (!this.opts.width) {
                this.opts.width = parseFloat(img.width);
            } else {
                this.opts.width = parseFloat(this.opts.width);
            }

            // 如果没有传入 height，则默认使用图片的 height
            if (!this.opts.height) {
                this.opts.height = parseFloat(img.height);
            } else {
                this.opts.height = parseFloat(this.opts.height);
            }
            const ratio = _getScreenDefRatio(this.ctx);
            console.log(ratio);
            canvas.width = this.opts.width * ratio + '';
            canvas.height = this.opts.height * ratio + '';
            canvas.style.width = this.opts.width + 'px';
            canvas.style.height = this.opts.height + 'px';
        }).catch((err) => {
            console.error(err);
            throw err;
        });
    };

    // 渲染 canvas
    const _render = () => {
        return this._prm.then(() => {
            const textHeight = this.opts.textHeight;
            const cntrWidth = this.opts.width;
            const cntrHeight = this.opts.height - textHeight;
            let imgWidth = 0;
            let imgHeight = 0;

            console.log('执行渲染');
            imgWidth = parseFloat(this.img.width);
            imgHeight = parseFloat(this.img.height);

            const ratio = _getScreenDefRatio(this.ctx);
            const loc = _adaptImgContain(cntrWidth, cntrHeight, imgWidth, imgHeight);
            this.ctx.scale(ratio, ratio);
            this.ctx.drawImage(this.img, loc.x, loc.y, loc.width, loc.height);
            this.ctx.font = this.opts.textFont;
            this.ctx.fillStyle = this.opts.textColor;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            _wrapText(this.opts.text, cntrWidth / 2, loc.y + loc.height, undefined, this.opts.textLineHeight);
        }).catch((err) => {
            console.error(err);
            throw err;
        });
    };

    // 将 canvas 挂载到页面上
    const mount = (el) => {
        _render().then(() => {
            console.log('执行挂载');
            let elm = null;
            if (typeof el === 'string') {
                elm = _query(el);
            } else if (el && el.nodeType === 1) {
                elm = el;
            }

            const m = _convertCanvasToImage();

            if (elm) {
                // elm.appendChild(this.canvas);
                elm.appendChild(m);
            } else {
                console.warn('你传入的不是一个有效的选择器或者一个元素对象');
            }
        });
    };

    this.canvas = null;
    this.ctx = null;
    this.img = null;
    this.opts = opts;
    this._prm = _init();
    // 只给外部暴露 mount 方法
    this.mount = mount;
};

export default ImgRemarker;
