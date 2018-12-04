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
    const _this = this;
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
    const _wrapText = function (text, x, y, maxWidth, lineHeight) {
        if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
            return;
        }

        let context = _this.ctx;
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
    const _convertCanvasToImage = function () {
        var image = new Image();
        // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
        // 指定格式 PNG
        image.src = _this.canvas.toDataURL('image/png');
        // 以下两行是为了防止 canvas 进行高清屏适配时引起的放大
        image.style.width = _this.opts.width + 'px';
        image.style.height = _this.opts.height + 'px';
        return image;
    };

    // 校验参数
    const _checkParams = function () {
        // 校验 imgSrc
        if (!_this.opts.imgSrc) {
            const err = new Error('imgSrc 不能为空');
            throw err;
        }

        // 校验 width 和 height
        _this.opts.width = _this.opts.width || DEFAULT_OPTS.WIDTH;
        _this.opts.height = _this.opts.height || DEFAULT_OPTS.HEIGHT;
        if (isNaN(parseFloat(_this.opts.width))) {
            const err = new Error('无效的选项：width');
            throw err;
        }
        if (isNaN(parseFloat(_this.opts.height))) {
            const err = new Error('无效的选项：height');
            throw err;
        }

        // 校验 textFont
        _this.opts.textStyle = _this.opts.textStyle || DEFAULT_OPTS.TEXT_STYLE;
        _this.opts.textSize = _this.opts.textSize || DEFAULT_OPTS.TEXT_SIZE;
        _this.opts.textFamily = _this.opts.textFamily || DEFAULT_OPTS.TEXT_FAMILY;
        // 新生成的属性：textFont
        _this.opts.textFont = [
            _this.opts.textStyle,
            _this.opts.textSize,
            _this.opts.textFamily
        ].join(' ');

        // 校验 textColor
        _this.opts.textColor = _this.opts.textColor || DEFAULT_OPTS.TEXT_COLOR;
        
        // 校验 textHeight
        _this.opts.textHeight = parseFloat(_this.opts.textHeight || DEFAULT_OPTS.TEXT_HEIGHT);

        // 校验 textLineHeight
        if (_this.opts.textLineHeight && isNaN(parseFloat(_this.opts.textLineHeight))) {
            throw new Error('无效的选项：textLineHeight');
        } else if (!_this.opts.textLineHeight) {
            _this.opts.textLineHeight = parseFloat(_this.opts.textSize);
        }
        console.log(JSON.stringify(_this.opts));
    };

    // 初始化
    const _init = function () {
        // 校验入参
        _checkParams();

        // src 可以为 url 也可以为 dataurl
        const imgSrc = _this.opts.imgSrc;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const prm = new Promise(function (resolve, reject) {
            img.onload = function () {
                resolve(img);
            };
            img.onerror = function () {
                reject('图片加载失败！');
            };
        });

        // 初始化配置参数
        _this.ctx = ctx;
        _this.canvas = canvas;
        _this.img = img;

        img.setAttribute('crossOrigin', 'Anonymous');
        img.src = imgSrc;

        return prm.then(function (m) {
            // 如果没有传入 width，则默认使用图片的 width
            if (!_this.opts.width) {
                _this.opts.width = parseFloat(img.width);
            } else {
                _this.opts.width = parseFloat(_this.opts.width);
            }

            // 如果没有传入 height，则默认使用图片的 height
            if (!_this.opts.height) {
                _this.opts.height = parseFloat(img.height);
            } else {
                _this.opts.height = parseFloat(_this.opts.height);
            }
            const ratio = _getScreenDefRatio(_this.ctx);
            console.log(ratio);
            canvas.width = _this.opts.width * ratio + '';
            canvas.height = _this.opts.height * ratio + '';
            canvas.style.width = _this.opts.width + 'px';
            canvas.style.height = _this.opts.height + 'px';
        }).catch(function (err) {
            console.error(err);
        });
    };

    // 渲染 canvas
    const _render = function () {
        return _this._prm.then(function () {
            const textHeight = _this.opts.textHeight;
            const cntrWidth = _this.opts.width;
            const cntrHeight = _this.opts.height - textHeight;
            let imgWidth = 0;
            let imgHeight = 0;

            console.log('执行渲染');
            imgWidth = parseFloat(_this.img.width);
            imgHeight = parseFloat(_this.img.height);

            const ratio = _getScreenDefRatio(_this.ctx);
            const loc = _adaptImgContain(cntrWidth, cntrHeight, imgWidth, imgHeight);
            _this.ctx.scale(ratio, ratio);
            _this.ctx.drawImage(_this.img, loc.x, loc.y, loc.width, loc.height);
            _this.ctx.font = _this.opts.textFont;
            _this.ctx.fillStyle = _this.opts.textColor;
            _this.ctx.textAlign = 'center';
            _this.ctx.textBaseline = 'top';
            _wrapText(_this.opts.text, cntrWidth / 2, loc.y + loc.height, undefined, _this.opts.textLineHeight);
        }).catch(function (err) {
            throw err;
        });
    };

    // 将 canvas 挂载到页面上
    const mount = function (el) {
        _render().then(function () {
            console.log('执行挂载');
            let elm = null;
            if (typeof el === 'string') {
                elm = _query(el);
            } else if (el && el.nodeType === 1) {
                elm = el;
            }

            const m = _convertCanvasToImage();

            if (elm) {
                elm.appendChild(_this.canvas);
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
