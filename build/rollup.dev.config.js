/**
 * 若除了 export 之外还需要支持其他的 es6 语法
 * 则要检查下自己的 node 环境
 */

import browsersync from 'rollup-plugin-browsersync';
import COMMON from './common.config.js';
// import resolve from './utils/resolve';
// import fs from 'fs';

const config = { ...COMMON.CONFIG };

export default {
    ...config,
    ...{
        plugins: [
            ...config.plugins,
            browsersync({
                server: {
                    directory: true,
                    baseDir: [
                        COMMON.PATH.TEST,
                        COMMON.PATH.DIST
                    ],
                    middleware: [
                        function (req, res, next) {
                            console.log(1);
                            if (req.url.match(/^\/dist\/(.*)/)) {
                                // 方法1
                                // const content = fs.readFileSync(resolve(COMMON.PATH.DIST, RegExp.$1));
                                // res.end(content);

                                // 方法2
                                res.writeHead(301, {'Location': '/'+RegExp.$1});
                                res.end();
                            }
                            next();
                        },
                    ]
                }
            }),
        ] 
    },
    watch: {
        include: 'src/**',
    }
};