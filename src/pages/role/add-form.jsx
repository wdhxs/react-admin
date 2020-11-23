import React from 'react';
import {
    Form,
    Input
} from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;

export default class AddForm extends React.Component {
    formRef = React.createRef();

    // 规定props类型
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        // 因为WillMount在render之前，所以不能获取formRef
        const {setForm} = this.props;
        // 通过setForm方法将form对象传给父组件
        setForm(this.formRef.current);
    }

    render() {

        return (
            <Form ref={this.formRef}>
                <Item 
                label='角色名称：'
                name='roleName' 
                initialValue='' 
                rules={[
                        {
                            required: true,
                            message: 'required'
                        }
                    ]}>
                    <Input placeholder="请输入角色名称"></Input>
                </Item>
            </Form>
        )
    }
}