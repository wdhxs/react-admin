import React from 'react';
import './login.less'
import logo from '../../assets/images/logo.png';
import { Form, Input, Button } from 'antd';
import {UserOutlined, EyeInvisibleOutlined} from '@ant-design/icons';

// import memoryUtils from '../../utils/memoryUtils';
// import storageUtils from '../../utils/storageUtils';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from '../../dedux/actions';

// 登录的路由组件
class Login extends React.Component {

    formRef = React.createRef();

    componentDidMount() {
        
    }

    handleSubmit =  (event) => {
        console.log('submit');
        
    }

    // 表单验证成功后调用的回调函数
    onFinish = async (values)=> {
        // 必须给表单项设置name属性
        // values就是表单对象中的各个表单项的值
        // console.log(values);
        // // 也可以通过this.formRef.current.getFieldsValue()获取
        // console.log(this.formRef.current.getFieldValue('username'));
        // // validateFields()触发表单验证
        // this.formRef.current.validateFields().then(values => console.log(values));
        const {username, password} = values;
        // 这里涉及到跨域，用代理服务器解决跨域问题
        // 在package.json中配置proxy
        // result是response.data

        // 使用redux进行异步请求
        console.log(login);
        this.props.login(username, password);

        // const result = await reqLogin(username, password);
        // // {status:0,data:user} {status:1,msg:...}
        // // const result = response.data;
        // if (result.status === 0) { // 登陆成功
        //     message.success('登录成功');
        //     const user = result.data;
        //     // 保存在内存中
        //     memoryUtils.user = user;
        //     // 保存在local中
        //     storageUtils.saveUser(user);
        //     // 跳转到管理界面
        //     this.props.history.replace('/home');
        // } else {
        //     message.error(result.msg);
        // }
    }

    onFinishFailed = (values) =>{
        // console.log(values);
    }

    validatorPwd = (rule, value)=> {
        if (!value) {
            return Promise.reject('密码不能为空');
        } else if (value.length < 4) {
            return Promise.reject('密码长度不能小于4');
        } else if (value.length > 12) {
            return Promise.reject('密码长度不能大于12');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject('密码必须由英文字母、数字和下划线组成');
        }
        return Promise.resolve();
    }

    render() {
        const user = this.props.user;
        // 判断是否登录
        if (user && user._id) {
            return <Redirect to="/home"></Redirect>;
        }

        return (
            <div className="login">
                <header className="login-header">
                    {/* 在react中不支持在标签src中写相对路径 */}
                    <img src={logo} alt="logo"/>
                    <h1>React项目 后台管理系统</h1>
                </header>
                <section className="login-content">
                <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form ref={this.formRef} className="login-form"
                        onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}
                        
                    >
                        <Form.Item name="username" rules={[
                            {
                                required: true,
                                message: '请输入用户名!'
                            },
                            {
                                min: 4,
                                message: '最小长度为4'
                            },
                            {
                                max: 12,
                                message: '最大长度为12'
                            },
                            {
                                pattern: /^[a-zA-Z0-9_]+$/,
                                message: '用户名必须由英文字母、数字和下划线组成'
                            }
                        ]}>
                            <Input  prefix={<UserOutlined />} placeholder="用户名" />
                        </Form.Item>

                        <Form.Item name="password" rules={
                            [
                                {
                                    validator: this.validatorPwd
                                }
                            ]
                        }>
                            <Input type="password" placeholder="密码" prefix={<EyeInvisibleOutlined />} />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login);