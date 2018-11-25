# img-remarker
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

## License
MIT © [Hades He](mailto:hadeshe93@gmail.com) 
