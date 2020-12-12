import React from 'react';
import ReactDom from 'react-dom';
import App from './App.jsx';
// import storageUtils from './utils/storageUtils';
// import memoryUtils from './utils/memoryUtils';
import { Provider } from 'react-redux';
import store from './dedux/store.js';

// 启动app时就获取用户信息，放到内存中去，这样以后从内存中读取就更快了
// 有了redux就不用了
// const user = storageUtils.getUser();
// memoryUtils.user = user;

ReactDom.render((
    <Provider store={store}>
        <App></App>
    </Provider>
), document.getElementById('root'));