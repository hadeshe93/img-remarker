/**
 * 若除了 export 之外还需要支持其他的 es6 语法
 * 则要检查下自己的 node 环境
 */

import COMMON from './common.config.js';
import { uglify } from 'rollup-plugin-uglify';

const config = { ...COMMON.CONFIG };

const x = {
    ...config,
    ...{
        plugins: [
            ...config.plugins,
            uglify(),
        ] 
    },
};
console.log(x);

export default x;