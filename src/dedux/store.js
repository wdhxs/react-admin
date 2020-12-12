import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reducer';
import thunk from 'redux-thunk';

// 默认向外暴露store
// applyMiddleware用来装插件的
// thunk实现在redux中实现异步操作

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));