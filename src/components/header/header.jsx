import React from 'react';
import {withRouter} from 'react-router-dom';
import {formateDate} from '../../utils/dateUtils';
// import memoryUtils from '../../utils/memoryUtils';
// import storageUtils from '../../utils/storageUtils';
import {reqWeather} from '../../api';
import menuList from '../../config/menuConfig';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../link-button';
import './index.less';
import { connect } from 'react-redux';
import {logout} from '../../dedux/actions';

const { confirm } = Modal;

class Header extends React.Component {

    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '', // 天气图片url
        weather: '', // 天气文本
    };

    getTime = ()=>{
        // 每隔一秒获取当前时间,并赋值
        this.intervalId =  setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({currentTime});
        }, 1000);
    }

    getWeather = async () =>{
        const { dayPictureUrl, weather } = await reqWeather('北京');
        // 设置天气信息
        this.setState({dayPictureUrl, weather});
    }

    getTitle = () => {
        const pathName = this.props.location.pathname;
        // 广度优先遍历？
        // 1.先把menuList concat进去/
        let queue = [];
        for (let i = 0; i < menuList.length; i++) {
            queue.push(menuList[i]);
        }
        let title;
        while(queue.length) {
            const topObj = queue.shift();
            // 当前元素匹配pathName
            // if (topObj.key === pathName) {
            //     title = topObj.title;
                
            //     break;
            // } else if(topObj.children) {
            //     // 如果有children则把children放进队列
            //     queue = queue.concat(topObj.children);
            // }

            if (pathName.indexOf(topObj.key) === 0) {
                // console.log('topObj.key', topObj.key);
                title = topObj.title;
                
                break;
            } else if(topObj.children) {
                // 如果有children则把children放进队列
                queue = queue.concat(topObj.children);
            }
        }
        // return 'not Found';
        return title;
    }

    logout = (event) => {
        // event.preventDefault();
        confirm({
            title: '确定退出登录?',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                // 删除user数据
                // memoryUtils.user = {};
                // storageUtils.removeUser();
                // redux 
                // user 变为 {} 后 admin组件会重新跳转到login
                this.props.logout();
                // 这里面的this不是组件对象，使用箭头函数
                // this.props.history.replace('/login');
            },
            onCancel: () => {
            //   console.log('Cancel');
            },
          });
    }

    UNSAFE_componentWillMount() {
        // 设置title
        // this.getTitle();
    }
    
    // 一般在componentDidMount完成异步操作：ajax/启动定时器
    componentDidMount() {
        // 更新当前时间
        this.getTime();
        // 获取天气信息
        this.getWeather();
    }
    // 组件卸载前，要清除定时器，不然会内存泄漏
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const {currentTime, dayPictureUrl, weather} = this.state;
        const userName = this.props.user.username;
        // let title = this.getTitle();
        let title = this.props.headTitle;

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{userName}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
// 会接受一个headTitle的属性
export default connect(
    state => ({headTitle: state.headTitle, user: state.user}),
    {logout}
)(withRouter(Header));