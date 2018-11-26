# img-remarker

[![LICENSE](https://img.shields.io/github/license/hadeshe93/img-remarker.svg?style=flat)](https://github.com/hadeshe93/img-remarker/blob/master/LICENSE.md)


Remark a img as canvas.

## Installation
```sh
$ npm install --save img-remarker
```

## Usage
In script way:
```html
<!-- app/src/index.html -->
<body>
    <div id="app"></div>
    <!-- ... -->
    <script src="../node_modules/img-remarker/dist/ImgRemarker.min.js"></script>
    <script>
        const m = new ImgRemarker({
            width: '300px',
            height: '350px',
            text: 'HelloWorld',
            textHeight: '50px',
            textStyle: 'normal',
            textSize: '20px',
            textFamily: '黑体',
            textColor: '#333',
            imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-K60SA0cvvaFJEXlH60k98JjYOvlidFZJSq_aiI5bFGstxp3k4Q'
        });
        m.mount('#app');
    </script>
</body>
```

In es6 way:
```js
// main.js
import ImgRemarker from 'img-remarker';

const m = new ImgRemarker({
    width: '300px',
    height: '350px',
    text: 'HelloWorld',
    textHeight: '50px',
    textStyle: 'normal',
    textSize: '20px',
    textFamily: '黑体',
    textColor: '#333',
    imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-K60SA0cvvaFJEXlH60k98JjYOvlidFZJSq_aiI5bFGstxp3k4Q'
});
m.mount('#app');
```

And yes, the npm package supports the UMD format.

## Options
You can pass an configuring obejct to `ImgRemarker` instance.

| Name | Default | Description |
| ---- | ------- | ----------- |
| width | (the width of original img, px) | the width of remarked img which generated |
| height | (the height of original img, px) | the height of remarked img which generated |
| text | '' | string that you wanna remark on the original img, and the character '\n' will indicate that text should wrap |
| textHeight | '30px' | the height of rigion where you wanna put the text |
| textStyle | 'normal' | the style of text |
| textSize | '14px' | the size of text |
| textLineHeight | '14px' | the line height of text, if not defined, it will equal textSize |
| textFamily | 'SimHei' | the font-family of text |
| textColor | '#000000' | the color of text |
| imgSrc | '' | the src of original img, could be normal or baseurl |


## License
MIT © [Hades He](mailto:hadeshe93@gmail.com) 
