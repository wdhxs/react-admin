import React from 'react';
import memoryUtils from '../../utils/memoryUtils';
import {Redirect, Switch, Route} from 'react-router-dom';
import { Layout } from 'antd';
import Header from '../../components/header/header';
import LeftNav from '../../components/left-nav/left-nav';
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout;

// 后台管理页面的路由组件
export default class Admin extends React.Component {
    render() {
        const user = memoryUtils.user;
        // console.log(user);
        if (!user || !user._id) {
            // 自动跳转到登录（在render中）
            return <Redirect to='/login'></Redirect>
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{backgroundColor: 'white',margin:20}}>

                        <Switch>
                            {/* 用下面的方式转到home不能再外面加Switch,大概是因为，
                            switch只能匹配一次，而redirect要进行二次匹配 */}
                            {/* <Route path="/" render={()=>(
                                <Redirect to="/home"></Redirect>
                            )}></Route> */}
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home'/>
                        </Switch>
                    
                    </Content>
                    <Footer style={{textAlign: "center"}}>推荐使用谷歌浏览器</Footer>
                </Layout>
            </Layout>
        )
    }
}