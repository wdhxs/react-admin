import React from 'react';
import {
    Form,
    Input,
    Select
} from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;
const Option = Select.Option;

export default class UserForm extends React.PureComponent {
    formRef = React.createRef();

    // 规定props类型
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentDidMount() {
        // 因为WillMount在render之前，所以不能获取formRef
        const {setForm} = this.props;
        // 通过setForm方法将form对象传给父组件
        setForm(this.formRef.current);
    }

    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 12 },
            },
        };
        const {roles, user} = this.props;
        console.log(user);

        return (
            <Form ref={this.formRef}
            {...formItemLayout}
            >
                <Item 
                label='用户名'
                name='username' 
                initialValue={user.username || ''}
                value={user.username || ''} 
                rules={[
                        {
                            required: true,
                            message: 'required'
                        }
                    ]}>
                    <Input placeholder="请输入用户名"></Input>
                </Item>
                {
                    // 如果是更新，不显示密码
                    user._id ? null : (
                        <Item 
                        label='密码'
                        name='password' 
                        initialValue={user.password  || ''} 
                        rules={[
                                {
                                    required: true,
                                    message: 'required'
                                }
                            ]}>
                            <Input type="password" placeholder="请输入密码"></Input>
                        </Item>
                    )
                }
                
                <Item 
                label='手机号'
                name='phone' 
                initialValue={user.phone  || ''}
                value={user.phone  || ''}
                rules={[
                        {
                            required: true,
                            message: 'required'
                        }
                    ]}>
                    <Input type="number" placeholder="请输入手机号"></Input>
                </Item>
                <Item 
                label='邮箱'
                name='email' 
                initialValue={user.email  || ''}
                value={user.email  || ''} 
                rules={[
                        {
                            required: true,
                            message: 'required'
                        }
                    ]}>
                    <Input type="email" placeholder="请输入邮箱"></Input>
                </Item>
                <Item 
                label='角色'
                name='role_id' 
                initialValue={user.role_id  || ''}
                value={user.role_id  || ''} 
                rules={[
                        {
                            required: true,
                            message: 'required'
                        }
                    ]}>
                    <Select>
                        {
                            roles.map((role) => <Option
                            key={role._id}
                            value={role._id}
                            >
                                {role.name}
                            </Option>)
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}
