import React from 'react';
import {
    Form,
    Select,
    Input
} from 'antd';
import PropTypes from 'prop-types';

const Item = Form.Item;
const Option = Select.Option;

export default class AddForm extends React.Component {
    formRef = React.createRef();

    // 规定props类型
    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categories: PropTypes.array.isRequired, // 一级分类的数组
        parentId: PropTypes.string.isRequired // 父分类id
    }

    componentDidMount() {
        // 因为WillMount在render之前，所以不能获取formRef
        const {setForm} = this.props;
        // 通过setForm方法将form对象传给父组件
        setForm(this.formRef.current);
    }

    render() {
        const {categories, parentId} = this.props;

        return (
            <Form ref={this.formRef}>
                <Item name='parentId' initialValue={parentId}>
                    <Select>
                        <Option value="0">一级分类</Option>
                        {
                            categories.map((c) => <Option key={c._id} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Item>

                <Item name='categoryName' initialValue='' rules={[
                        {
                            required: true,
                            message: 'required'
                        }
                    ]}>
                    <Input placeholder="请输入分类名称"></Input>
                </Item>
            </Form>
        )
    }
}