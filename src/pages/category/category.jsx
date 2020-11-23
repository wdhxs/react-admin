import React from 'react';
import { Card,Button,Table, message, Modal } from 'antd';
import {
    PlusOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqCategorys ,reqUpdateCategory, reqAddCategory} from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';

// const dataSource = [
//     {
//       "parentId": "0",
//       "_id": "5c2ed631f352726338607046",
//       "name": "家用电器",
//       "__v": 0
//     },
//     {
//       "parentId": "0",
//       "_id": "5c2ed647f352726338607047",
//       "name": "电脑",
//       "__v": 0
//     },
//     {
//       "parentId": "0",
//       "_id": "5c2ed64cf352726338607048",
//       "name": "图书",
//       "__v": 0
//     },
//     {
//         "parentId": "0",
//         "_id": "5c2ed647f352726338607049",
//         "name": "服装",
//         "__v": 0
//     },
//     {
//         "parentId": "0",
//         "_id": "5c2ed647f352726338607050",
//         "name": "食品",
//         "__v": 0
//     },
//     {
//     "parentId": "0",
//     "_id": "5c2ed647f352726338607051",
//     "name": "玩具",
//     "__v": 0
//     },
//     {
//         "parentId": "0",
//         "_id": "5c2ed647f352726338607052",
//         "name": "化妆品",
//         "__v": 0
//     },
//     {
//     "parentId": "0",
//     "_id": "5c2ed647f352726338607053",
//     "name": "五金",
//     "__v": 0
//     },
//     {
//         "parentId": "0",
//         "_id": "5c2ed647f352726338607054",
//         "name": "化妆品",
//         "__v": 0
//     },
//     {
//     "parentId": "0",
//     "_id": "5c2ed647f352726338607055",
//     "name": "五金",
//     "__v": 0
//     },
//     {
//         "parentId": "0",
//         "_id": "5c2ed647f352726338607056",
//         "name": "化妆品",
//         "__v": 0
//     },
//     {
//     "parentId": "0",
//     "_id": "5c2ed647f352726338607057",
//     "name": "五金",
//     "__v": 0
//     }
// ];

// const subCat = [
//     {
//       "parentId": "5c2ed631f352726338607046",
//       "_id": "5c2ed65df352726338607049",
//       "name": "分类3333",
//       "__v": 0
//     },
//     {
//       "parentId": "5c2ed631f352726338607046",
//       "_id": "5c2ed66ff35272633860704a",
//       "name": "分类34",
//       "__v": 0
//     }];

export default class Category extends React.Component {

    state = {
        loading: false, // 是否在请求数据
        categories: [],
        subCategories: [], // 二级分类列表
        parentId: '0',
        parentName: '',
        showStatus: 0, // 0=>添加框和修改框都不显示 1=>显示添加 2=>显示修改
    }

    UNSAFE_componentWillMount() {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name'
            },
            {
                title: '操作',
                width: 300,
                render: (category)=>{
                    // category为每一行的对象数据
                    
                    return (
                        <span>
                            <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                            {this.state.parentId === '0' ? <LinkButton onClick={()=>this.showSubCategories(category)}>查看子分类</LinkButton> : null }
                            {/* 为了向事件回调函数传参数而不立即调用，在外面包含一层函数 */}
                        </span>
                    )
                }
            }
            
        ];
    }
    // 发ajax请求
    componentDidMount() {
        this.getCategories();
    }

    getCategories= async () => {
        // 请求前
        this.state.loading = true;
        const result = await reqCategorys(this.state.parentId);
        // 请求后
        this.setState({loading: false});

        if (result.status === 0) {
            // 一级或二级分类列表
            const categories = result.data;

            if (this.state.parentId === '0') {
                // 更新一级分类列表
                this.setState({
                    categories: categories
                });
                
            } else {
                this.setState({
                    subCategories: categories
                });
            }
        } else {
            message.error('获取分类列表失败');
        }
    }
    // 显示二级列表
    showSubCategories = (category) => {
        // 更新状态
        // !!!setState是异步的，不能马上就调用接口
        this.setState({
            parentId: category._id,
            parentName: category.name
        },()=>{
            // 获取二级列表
            this.getCategories();
        });
    }

    // 显示一级列表
    showCategories = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories: []
        });
    }

    // 隐藏模态框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        });

        // 重置form对象中所有字段，为了清除input中的缓存
        this.updateForm.resetFields();

    }
    // 添加分类
    addCategory = () => {
        this.updateForm.validateFields().then(async (values)=>{
            // 隐藏模态框
            this.setState({
                showStatus: 0
            });

            // 收集数据
            const {parentId, categoryName} = this.updateForm.getFieldsValue();
            
            const result = await reqAddCategory(categoryName, parentId);
            console.log('reqAddCategoryresult', result);
            if (result.status === 0) {
                // 重新获取分类列表
                this.getCategories();
            }

            // 重置form对象中所有字段，为了清除input中的缓存
            this.updateForm.resetFields();
        })
        .catch((err)=>{})
    }
    // 修改分类
    updateCategory = async () => {
        this.setState({
            showStatus: 0
        });

        const categoryId = this.category._id;
        const categoryName = this.updateForm.getFieldValue('categoryName');
        // console.log('getFieldValue(categoryName)', categoryName);
        // 重置form对象中所有字段，为了清除input中的缓存
        this.updateForm.resetFields();

        const result = await reqUpdateCategory({ categoryId, categoryName });
        if (result.status === 0) {
            this.getCategories();
        }
    }
    // 显示添加框
    showAdd = () => {
        this.setState({
            showStatus: 1
        });
    }
    // 显示修改框
    showUpdate = (category) => {
        // 保存表的行数据
        this.category = category;

        this.setState({
            showStatus: 2
        });
    }

    render() {
        // 表的行数据
        const category = this.category || {};

        // card的左侧
        const title = this.state.parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategories}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{marginRight: 5}} />
                <span>{this.state.parentName}</span>
            </span>
        );
        // card的右侧
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )
        // console.log('render', this.state.categories);
        return (
        <Card title={title} extra={extra} >
            <Table dataSource={this.state.parentId === '0' ? this.state.categories : this.state.subCategories}
            columns={this.columns}
            bordered
            rowKey='_id'
            loading={this.loading}
            pagination={{defaultPageSize:5}}
            />

        <Modal
          title="添加分类"
          visible={this.state.showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm categories={this.state.categories} parentId={this.state.parentId} setForm={(form)=>{this.updateForm = form}}></AddForm>
        </Modal>

        <Modal
          title="更新分类"
          visible={this.state.showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
            {/* 通过函数实现子组件向父组件传值 */}
            <UpdateForm categoryName={category.name || ''} setForm={(form)=>{this.updateForm = form}}></UpdateForm>
        </Modal>
        </Card>
        )
    }
}


  