import React from 'react';
import {
    Form,
    Input
} from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;
// const Option = Select.Option;

export default class UpdateForm extends React.Component {
    formRef = React.createRef();

    // 规定props类型
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    UNSAFE_componentWillMount() {

    }

    componentDidMount() {
        // 因为WillMount在render之前，所以不能获取formRef
        const {setForm} = this.props;
        // 通过setForm方法将form对象传给父组件
        setForm(this.formRef.current);
    }

    render() {
        const {categoryName} = this.props;
        // console.log(this.formRef);
        return (
            <Form ref={this.formRef}>
                <Item name='categoryName' initialValue={''}>
                    <Input placeholder={categoryName}></Input>
                </Item>
            </Form>
        )
    }
}