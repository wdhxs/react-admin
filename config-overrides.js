// const { override, fixBabelImports } = require('customize-cra');

// module.exports = override(
//     // 针对antd按需打包
//     fixBabelImports('import', {
//         libraryName: 'antd',
//         libraryDirectionary: 'es',
//         style: 'css' // 自动打包相关样式
//     })
// );
const { override, fixBabelImports, addLessLoader } = require('customize-cra');
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, // 处理源码文件
    }),
    // 使用less-loader对源码中的less变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' }, // 改默认颜色
    }),
);