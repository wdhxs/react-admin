import React from 'react';
import ReactDom from 'react-dom';
import App from './App.jsx';
import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';

// 启动app时就获取用户信息，放到内存中去，这样以后从内存中读取就更快了
const user = storageUtils.getUser();
memoryUtils.user = user;

ReactDom.render(<App></App>, document.getElementById('root'));