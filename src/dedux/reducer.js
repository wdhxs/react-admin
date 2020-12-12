/**
 * 根据旧的state和指定的action生成并返回新的state的函数
 */

// const { default: storageUtils } = require("../utils/storageUtils");

import { combineReducers } from 'redux';
import storageUtils from '../utils/storageUtils';
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_USER_ERROR, RESET_USER } from './action-types';
/**
 * 用来管理头部标题的reducer函数
 */
const initHeadTitle = '首页';

function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data;
        default:
            return state;
    }
}

/**
 * 用来管理当前登录用户的reducer函数
 */
const initUser = storageUtils.getUser();

function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user;
        case SHOW_USER_ERROR:
            const errMsg = action.errMsg;
            return {...state, errMsg };
        case RESET_USER:
            return {};
        default:
            return state;
    }
}

/**
 * 默认向外暴露合并后的reducer函数
 * 管理总的state的结构：
 * {
 *    headTitle：'首页',
 *    user: {}
 * }
 */

export default combineReducers({
    headTitle,
    user
})