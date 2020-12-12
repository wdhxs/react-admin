/**
 * 包含多个action creator函数的模块
 */

import { reqLogin } from '../api';
import storageUtils from '../utils/storageUtils';
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_USER_ERROR, RESET_USER } from './action-types';

// 设置头部标题
export const setHeadTitle = (headTitle) => ({
    type: SET_HEAD_TITLE,
    data: headTitle
});

// 接受用户的同步action
export const receiveUser = (user) => ({
    type: RECEIVE_USER,
    user
});

// 登录用户错误同步action
export const showUserError = (errMsg) => ({
    type: SHOW_USER_ERROR,
    errMsg
});

// 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        // 1. 执行异步ajax请求
        const result = await reqLogin(username, password) // {status: 0, data: user} {status: 1, msg: 'xxx'}
            // 2.1. 如果成功, 分发成功的同步action
        if (result.status === 0) {
            const user = result.data
                // 保存local中
            storageUtils.saveUser(user)
                // 分发接收用户的同步action
            dispatch(receiveUser(user))
        } else { // 2.2. 如果失败, 分发失败的同步action
            const msg = result.msg
                // message.error(msg)
            dispatch(showUserError(msg))
        }

    }
}

// 退出登录
export const logout = () => {
    // 清除local中的user
    storageUtils.removeUser();

    return { type: RESET_USER };
}