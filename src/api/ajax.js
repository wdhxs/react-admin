/**
 * 发送异步ajax请求的函数模块
 * 封装axios库
 * 函数返回promise对象
 * 1.优化统一处理请求异常
 */

import axios from 'axios';
import { message } from 'antd';

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise;
        if (type === 'GET') {
            promise = axios.get(url,
                // 配置对象
                {
                    params: data // 指定请求参数
                });
        } else {
            promise = axios.post(url, data);
        }

        promise.then((response) => {
            resolve(response.data);
        }).catch((err) => {
            message.error(err.message);
        })
    });

}