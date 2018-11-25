import babel from 'rollup-plugin-babel';
import clear from 'rollup-plugin-clear';
import { eslint } from "rollup-plugin-eslint";

import resolve from './utils/resolve';

/**
 * 只 reslove 第一层目录
 */
const ROOT = resolve(__dirname, '../');
const SRC = resolve(ROOT, 'src');
const DIST = resolve(ROOT, 'dist');
const TEST = resolve(ROOT, 'test');
const BUILD = resolve(ROOT, 'build');

/**
 * 判断当前构建环境
 */
const isEnvDev = function () {
    return process.env.NODE_ENV === 'development';
};
const isEnvStg = function () {
    return process.env.NODE_ENV === 'staging';
};
const isEnvPrd = function () {
    return process.env.NODE_ENV === 'production';
};

/**
 * 生成最终文件名
 */
const PKG_NAME = 'ImgRemarker';
const genOutputFilename = function () {
    let f = '';
    switch (process.env.NODE_ENV) {
        case 'staging':
            f = resolve(DIST, PKG_NAME + '.stg.js');
            break;
        case 'production':
            f = resolve(DIST, PKG_NAME + '.min.js');
            break;
        case 'development':
        default:
            f = resolve(DIST, PKG_NAME + '.dev.js');
            break;    
    }
    return f;
};

/**
 * 通用配置
 */
const CONFIG = {
    input: resolve(SRC, 'main.js'),
    output: {
      file: genOutputFilename(),
      name: 'ImgRemarker',
      format: 'umd'
    },
    plugins: [
        clear({
            targets: [ DIST ],
            // watch: true,
        }),
        eslint({}),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        }),
    ]
};

export default {
    PATH: {
        ROOT,
        SRC,
        DIST,
        TEST,
        BUILD
    },

    CONFIG,
};

