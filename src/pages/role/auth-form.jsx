import React from 'react';
import {
    Form,
    Input,
    Tree
} from 'antd';
import PropTypes from 'prop-types';
import menuList from '../../config/menuConfig';

const Item = Form.Item;

export default class AuthForm extends React.PureComponent {
    formRef = React.createRef();

    // 规定props类型
    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props);
        const {menus} = this.props.role;
        // console.log('menus', menus);

        this.state = {
            checkedKeys: menus
        }
    }

    getTreeData = (menuList) => {
        const results = [];
        if (!menuList) return results;
        const n = menuList.length;
        if (n < 1) return results;

        // 遍历，将menuList中的title，key，children给results
        for (let i = 0; i < n; i++) {
            const current = menuList[i];
            const menuItem = {
                title: current.title,
                key: current.key,
                disabled: false
            }
            if (current.children) {
                menuItem.children = [...this.getTreeData(current.children)];
            }
            results.push(menuItem);
        }

        return results;
    }

    // 选中某个选择框时
    onCheck = (checkedKeys, info) => {
        this.setState({
            checkedKeys
        })
    };
    // 返回选中的menus
    getMenus = () => {
        return this.state.checkedKeys;
    }

    UNSAFE_componentWillMount() {
        this.treeData = this.getTreeData(menuList);
        // console.log('this.treeData', this.treeData);
    }
    
    // 在组件接受到新的prop时被调用
    // 初始显示不会调用
    UNSAFE_componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus;
        // 在这里调用setState不会去渲染两次
        this.setState({
            checkedKeys: menus
        })
    }

    render() {
        const {role} = this.props;
        const {checkedKeys} = this.state;
        // console.log('checkedKeys', checkedKeys);

        return (
            <div>
                <Item 
                label='角色名称：'
                rules={[
                        {
                            required: true,
                            message: 'required'
                        }
                    ]}>
                    <Input value={role.name} disabled></Input>
                </Item>

                <Item>
                    <Tree
                        checkable
                        defaultExpandAll
                        treeData={this.treeData}
                        checkedKeys={checkedKeys}
                        onCheck={this.onCheck}
                    />
                </Item>
            </div>
        )
    }
}