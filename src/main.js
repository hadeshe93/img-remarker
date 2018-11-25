function ImgRemarker (opts) {
    /**
     * 下划线开头的都是私有方法
      */
    const _this = this;
    const DEFAULT_OPTS = {
        TEXT_HEIGHT: '30px',
        TEXT_STYLE: 'normal',
        TEXT_SIZE: '14px',
        TEXT_FAMILY: '黑体',
        TEXT_COLOR: '#666'
    };
    const _init = function (opts) {
        // src 可以为 url 也可以为 dataurl
        const imgSrc = opts.imgSrc;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        // img.setAttribute('crossOrigin', 'anonymous');
        const prm = new Promise(function (resolve, reject) {
            img.onload = function () {
                resolve(img);
            };
        });

        _this.ctx = ctx;
        _this.canvas = canvas;
        _this.imgSrc = imgSrc;
        _this.img = img;
        _this.opts.textFont = [
            _this.opts.textStyle || DEFAULT_OPTS.TEXT_STYLE,
            _this.opts.textSize || DEFAULT_OPTS.TEXT_SIZE,
            _this.opts.textFamily || DEFAULT_OPTS.TEXT_FAMILY
        ].join(' ');
        _this.opts.textColor = _this.opts.textColor || DEFAULT_OPTS.TEXT_COLOR;
        _this.opts.textHeight = parseFloat(_this.opts.textHeight || DEFAULT_OPTS.TEXT_HEIGHT);

        img.setAttribute('crossOrigin', 'Anonymous');
        img.src = imgSrc;

        return prm.then(function (m) {
            if (!opts.width) {
                opts.width = parseFloat(img.width);
            } else {
                opts.width = parseFloat(opts.width);
            }

            if (!opts.height) {
                opts.height = parseFloat(img.height);
            } else {
                opts.height = parseFloat(opts.height);
            }


            canvas.width = opts.width + '';
            canvas.height = opts.height + '';
            canvas.style.width = opts.width + 'px';
            canvas.style.height = opts.height + 'px';
        }).catch(function () {});
    };

    // 根据选择器查询元素
    const _query = function (el) {
        return document.querySelector(el);
    };

    // 控制台打印 warn
    const _warn = function (text) {
        console.warn(text);
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

    // canvas 绘字自动换行
    const _wrapText = function (text, x, y, maxWidth, lineHeight) {
        if (typeof text !== 'string' || typeof x !== 'number' || typeof y !== 'number') {
            return;
        }

        var context = _this.ctx;
        var canvas = context.canvas;
        console.log(canvas);

        if (typeof maxWidth === 'undefined') {
            maxWidth = (canvas && canvas.width) || 300;
        }
        if (typeof lineHeight === 'undefined') {
            lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
            if (!lineHeight) {
                lineHeight = parseFloat(_this.opts.textSize);
            }
        }

        // 字符分隔为数组
        var arrText = text.split('');
        var line = '';

        for (var n = 0; n < arrText.length; n++) {
            var testLine = line + arrText[n];
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = arrText[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
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

            const loc = _adaptImgContain(cntrWidth, cntrHeight, imgWidth, imgHeight);
            _this.ctx.drawImage(_this.img, loc.x, loc.y, loc.width, loc.height);
            _this.ctx.font = _this.opts.textFont;
            _this.ctx.fillStyle = _this.opts.textColor;
            _this.ctx.textAlign = 'center';
            _this.ctx.textBaseline = 'top';
            _wrapText(_this.opts.text, cntrWidth / 2, loc.y + loc.height);
        });
    };

    // 转 canvas 到 img
    const _convertCanvasToImage = function () {
        var image = new Image();
        // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
        // 指定格式 PNG
        image.src = _this.canvas.toDataURL('image/png');
        return image;
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
                // elm.appendChild(_this.canvas);
                elm.appendChild(m);
            } else {
                _warn('你传入的不是一个有效的选择器或者一个元素对象');
            }
        });
    };

    this.mount = mount;
    this.canvas = null;
    this.ctx = null;
    this.img = null;
    this.opts = opts;
    this._prm = _init(opts);
};

ImgRemarker.getDataUrlFromFile = function (file, onloadFn) {
    if (!FileReader || !file) return false;
    const reader = new FileReader();
    reader.onloadend = function (evt) {
        onloadFn(evt);
    };
    reader.readAsDataURL(file);
};

export default ImgRemarker;
