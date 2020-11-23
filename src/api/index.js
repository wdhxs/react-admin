/**
 * 包含所有请求方法的模块,返回promise对象
 */

import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST');

export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        jsonp(`http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`, {}, (err, data) => {
            // console.log('weather', err, data);
            if (!err && data.status === 'success') {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                resolve({ dayPictureUrl, weather });
            } else {
                message.error('获取天气信息失败');
            }
        });
    });
};
// 获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list', { parentId });
// 添加
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', { categoryName, parentId }, 'POST');
// 更新
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax('/manage/category/update', { categoryId, categoryName });
// 获取商品分页列表
export const reqProducts = (pageNume, pageSize) => ajax('/manage/product/list', { pageNume, pageSize });
// 获取一个分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', { categoryId });
// 产品上架/下架
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST');

// 搜索商品分页列表
// searchType: productName/productDesc
export const reqSearchProducts = ({ pageNume, pageSize, searchName, searchType }) => ajax('/manage/product/search', {
    pageNume,
    pageSize,
    [searchType]: searchName
});

// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', { name }, 'POST');

// 添加/修改商品 
// !!! (product._id ? 'update' : 'add') 三元表达式要用括号括起来
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST');
// // 修改商品
// export const reqUpdateProduct = (product) => ajax('/manage/product/update', product, 'POST');
// 获取角色列表
export const reqRoles = () => ajax('/manage/role/list');
// 添加角色列表
export const reqAddRole = (roleName) => ajax('/manage/role/add', { roleName }, 'POST');
// 更新角色列表
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST');
// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list');
// 删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST');
// 添加用户请求
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST');