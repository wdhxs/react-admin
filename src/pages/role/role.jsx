import React from 'react';
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd';
import {reqRoles, reqAddRole, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from './auth-form';
import memoryUtils from '../../utils/memoryUtils';
import {formateDate} from '../../utils/dateUtils';
import storageUtils from '../../utils/storageUtils';

const dataSource = [
    {
        "menus": [
            "/role",
            "/charts/bar",
            "/home",
            "/category"
        ],
        "_id": "5ca9eaa1b49ef916541160d3",
        "name": "测试",
        "create_time": 1554639521749,
        "__v": 0,
        "auth_time": 1558679920395,
        "auth_name": "test007"
    },
    {
        "menus": [
            "/role",
            "/charts/bar",
            "/home",
            "/charts/line",
            "/category",
            "/product",
            "/products"
        ],
        "_id": "5ca9eab0b49ef916541160d4",
        "name": "经理",
        "create_time": 1554639536419,
        "__v": 0,
        "auth_time": 1558506990798,
        "auth_name": "test008"
    },
    {
        "menus": [
            "/home",
            "/products",
            "/category",
            "/product",
            "/role"
        ],
        "_id": "5ca9eac0b49ef916541160d5",
        "name": "角色1",
        "create_time": 1554639552758,
        "__v": 0,
        "auth_time": 1557630307021,
        "auth_name": "admin"
    }
]

export default class Role extends React.Component {

    state = {
        roles: dataSource, // 所有的角色
        role: {}, // 选中的角色
        isShowAdd : false,
        isShowAuth: false, 
    }

    constructor(props) {
        super(props);

        this.auth = React.createRef();
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }

    onRow = role => {
        return {
            // 点击行
            onClick: event =>{
                this.setState({
                    role
                })
            }
        }
    }

    getRoles = async () => {
        const results = await reqRoles();
        if (results.status === 0) {
            const roles = results.data;
            this.setState({
                roles
            });
        }
    }

    addRole = () => {
        this.form.validateFields().then(async (values)=>{

            const {roleName} = values;
            // 重置输入数据
            this.form.resetFields();
            // 发送请求
            const result = await reqAddRole(roleName);

            if (result.status === 0) {
                message.success('添加角色成功！');
                // 重新获取角色列表
                this.getRoles();
                // 隐藏对话框
                this.setState({
                    isShowAdd: false
                });
            } else {
                message.error('添加角色失败！');
            }
        })
    }
    // 更新权限
    updateRole = async () => {
        const role = this.state.role;
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        role.auth_name = memoryUtils.user.username;

        const results = await reqUpdateRole(role);
        if (results.status === 0) {
            
            // 若当前更新的是自己的角色权限，强制退出
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {};
                storageUtils.removeUser();
                this.props.history.replace('/login');
            } else {
                message.success('设置角色权限成功！');
                this.setState({
                    isShowAuth: false
                });
    
                // 重新获取列表
                this.getRoles();
            }
            
        } else {
            message.error('设置角色权限失败！')
        }
    }

    handleCancel = () => {
        this.setState({
            isShowAdd: false
        });
        this.form.resetFields();
    }

    UNSAFE_componentWillMount () {
        this.initColumns();
    }

    componentDidMount() {
        this.getRoles();
    }

    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state;

        const title = (
            <span>
                <Button 
                type="primary"
                onClick={()=>{this.setState({isShowAdd: true})}}
                >创建角色
                </Button>
                <Button type="primary"
                disabled = {!role._id}
                style={{
                    marginLeft: 20
                }}
                onClick={()=>{this.setState({isShowAuth: true})}}
                >设置角色权限
                </Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table 
                dataSource={roles}
                columns={this.columns}
                // 将数据的_id作为rowKey
                rowKey="_id"
                bordered
                rowSelection={{type: 'radio', 
                selectedRowKeys:[role._id],
                onSelect: (role) => {
                    this.setState({
                        role
                    });
                }
            }}
                onRow={this.onRow}
                // pagination={{defaultPageSize: PAGE_SIZE,
                //             total,
                //             // 该回调函数会传递pageNum，pageSize
                //             onChange: this.getProducts,
                // }}
                >
                </Table>
                <Modal
                title="添加角色"
                visible={isShowAdd}
                onOk={this.addRole}
                onCancel={this.handleCancel}
                >
                    <AddForm setForm={(form)=>{this.form = form}}></AddForm>
                </Modal>
                <Modal
                title="设置角色权限"
                visible={isShowAuth}
                onOk={this.updateRole}
                onCancel={()=>{this.setState({isShowAuth: false})}}
                >
                    <AuthForm role={role} ref={this.auth}></AuthForm>
                </Modal>
            </Card>
        )
    }
}