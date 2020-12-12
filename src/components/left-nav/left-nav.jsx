import React from 'react';
import './index.less';
import logo from '../../assets/images/logo.png';
import {Link, withRouter} from 'react-router-dom';
import menuList from '../../config/menuConfig';
import { Menu } from 'antd';
import {
    PieChartOutlined,
    MailOutlined,
  } from '@ant-design/icons';
import {connect} from 'react-redux';
import {setHeadTitle} from '../../dedux/actions';


const { SubMenu } = Menu;
class LeftNav extends React.Component {

    // 判断当前登录用户是否对item有权限
    hasAuth = (item) => {
        const {key, isPublic} = item;
        const {user} = this.props;
        const menus = user.role.menus;
        const username = user.role.username;

        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true;
        } else if (item.children) { // 如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1);
        }

        return false;
    }

    getMenuList(menuList) {
        const path = this.props.location.pathname;
        // 1.使用map生成标签数组
        // debugger
        return menuList.map((obj, index)=>{
            // 判断当前用户是否有obj这个权限
            if (this.hasAuth(obj)) {
                // 1.1如果没有children属性=>menuItem
                if (!obj.children) {

                    if (obj.key === path || path.indexOf(obj.key) === 0) {
                        this.props.setHeadTitle(obj.title);
                    }

                    return (
                    <Menu.Item key={obj.key} icon={<PieChartOutlined />}>
                        <Link to={obj.key}
                        onClick={() => {this.props.setHeadTitle(obj.title)}}
                        >{obj.title}</Link>
                    </Menu.Item>);
                } else {
                    // 获取要展开的SubMenu
                    const item = obj.children.find((ele, index)=>{
                        return path.indexOf(ele.key) === 0;    
                    });
                    // 如果有这么一个元素
                    if (item) {
                        this.openKey = obj.key;
                    }
                    // 1.2如果有children属性=>SubMenu
                    return (
                        <SubMenu key={obj.key} icon={<MailOutlined />} title={obj.title}>
                            {this.getMenuList(obj.children)}
                        </SubMenu>
                    )
                }
            }
        })
        
        
        // 1.3然后children再渲染到SubMenu里
    }

    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuList(menuList);
    }

    render() {
        // 只有路由组件会接受到props.history,.location,.match属性
        // 想要获得这三个属性就在组件外面包装一层<Route />
        // 这是withRouter的原理

        let path = this.props.location.pathname;
        if (path.indexOf('/product') === 0) { //是product或者其子路由
            path = '/product';
        }
        const openKey = this.openKey;

        return (<div className="left-nav">
            <Link to="/">
                <header className="left-nav-header">
                    <img src={logo} alt="logo"/>
                    <h1>后台管理</h1>
                </header>
            </Link>

            <Menu
            // 相比defaultSelectedKeys
            // selectedKeys是动态的
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
            mode="inline"
            theme="dark"
            >
                {/* 根据menuList动态生成 */}
                {this.menuNodes}

                {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                    <Link to="/home">首页</Link>
                </Menu.Item>
                <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                    <Menu.Item key="/category" icon={<DesktopOutlined />}>
                        <Link to="/category">品类管理</Link>
                    </Menu.Item>
                    <Menu.Item key="/product" icon={<ContainerOutlined />}>
                        <Link to="/product">商品管理</Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="/user" icon={<PieChartOutlined />}>
                    <Link to="/user">用户管理</Link>
                </Menu.Item>
                <Menu.Item key="/role" icon={<PieChartOutlined />}>
                    <Link to="/role">角色管理</Link>
                </Menu.Item> */}
            </Menu>
        </div>)
    }
}

export default connect(
    state => ({user: state.user}),
    {setHeadTitle}
)(withRouter(LeftNav));