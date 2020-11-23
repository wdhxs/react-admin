import React from 'react';
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    message
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqCategorys, reqAddOrUpdateProduct} from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';

// const PicturesWallWithRef = React.forwardRef((props, ref) => (
//     <div {...props} forwardedRef={ref}>
//         <PicturesWall ref={forwardedRef}></PicturesWall>
//     </div>
// ));

const {Item} = Form;
const {TextArea} = Input;
const options = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      isLeaf: false,
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      isLeaf: false,
    },
  ];

export default class ProductAddUpdate extends React.Component {
    
    state = {
        options: [],
    };

    constructor(props) {
        super(props);

        // this.pwRef = React.createRef();
        this.editor = React.createRef();
    }
    pwRef = React.createRef();
    // 表单对象
    formRef = React.createRef();

    // 生成options数组
    initOptions = (categorys)=>{
        const options = categorys.map((c)=>({
                value: c._id,
                label: c.name,
                isLeaf: false,
            })
        );

        this.setState({
            options
        });
    }

    // 获取一级/二级列表
    // async函数返回一个新的Promise对象
    getCategorys = async (parentId)=>{
        const result = await reqCategorys(parentId);
        if (result.status === 0) {
            const categorys = result.data;
            // debugger
            if (parentId === '0') {
                this.initOptions(categorys);
            } else {
                return categorys;
            }
            
        }
    }

    submit = ()=>{
        const formObj = this.formRef.current;
        // 验证通过
        formObj.validateFields().then(async (value)=>{
            const {categoryIds, desc, name, price} = value;
            let pCategoryId, categoryId;
            if (categoryIds.length === 1) {
                pCategoryId = '0';
                categoryId = categoryIds[0];
            } else {
                pCategoryId = categoryIds[0];
                categoryId = categoryIds[1];
            }
            const imgs = this.pwRef.current.getImgs();
            const detail = this.editor.current.getDetail();

            // 封装成product对象
            const product = { desc, name, price, imgs, detail, pCategoryId, categoryId };
            // 如果是更新
            if (this.isUpdate) {
                product._id = this.product._id;
            }

            const result = await reqAddOrUpdateProduct(product);
            if (result.status === 0) {
                message.success(`${this.isUpdate ? '更新' : '添加'}成功！`);
                this.props.history.goBack();
            } else {
                message.error(`${this.isUpdate ? '更新' : '添加'}失败！`);
            }

        }).catch((errInfo)=>{
            console.log(errInfo);
            message.error('表单验证失败!');
        })
    }

    // 价格验证函数
    validatorPrice = (rule, value)=>{
        // value为字符串
        if (value * 1 > 0) {
            return Promise.resolve();
        } else {
            return Promise.reject('输入的数字必须大于0');
        }
    }

    // 点击时加载下一级数据
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];

        // 请求二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value);
        if (subCategorys && subCategorys.length > 0) {
            // 有二级分类
            const childOptions = subCategorys.map((c)=>({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }));

            targetOption.children = childOptions;            
        } else {
            targetOption.isLeaf = true;
        }

        this.setState({
            options: [...this.state.options]
        });
        
      };

    UNSAFE_componentWillMount() {
        const product = this.props.location.state;
        // 保存是否更新的标志
        this.isUpdate = !!product;
        this.product = product || {};
    }

    componentDidMount() {
        this.getCategorys('0');
    }

    render() {
        const {pCategoryId, categoryId, imgs, detail} = this.product;
        const categoryIds = [];
        if (this.isUpdate) {
            // 一级分类商品
            if (pCategoryId === '0') {
                categoryIds.push(categoryId);
            } else {
                categoryIds.push(pCategoryId);
                categoryIds.push(categoryId);
            }
            
        }

        const title = (
            <span>
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <ArrowLeftOutlined
                        style={{color: 'green',
                        marginRight: 15,
                        fontSize: 20
                        }}
                    />
                </LinkButton>
                <span>{this.isUpdate ? '更新商品' : '添加商品'}</span>
            </span>
        );
        
        // Grid布局 共24格
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 8 },
            },
        };

        return (
            <Card title={title}>
                <Form
                    ref={this.formRef}
                    {...formItemLayout}
                >
                    <Item label="商品名称"
                        // 必须给item指定name，否则rules都用不了
                        name='name'
                        initialValue={this.product.name}
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品名称'
                            }
                        ]}
                    >
                        <Input placeholder="商品名称"></Input>
                    </Item>
                    <Item label="商品描述"
                        initialValue={this.product.desc}
                        name='desc'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品描述'
                            }
                        ]}
                    >
                        <TextArea placeholder="商品描述" autoSize></TextArea>
                    </Item>
                    <Item label="商品价格"
                        initialValue={this.product.price}
                        name='price'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品价格'
                            },
                            {
                                validator: this.validatorPrice
                            }
                        ]}
                    >
                        <Input type="number" 
                        placeholder="商品价格" 
                        addonAfter="元"></Input>
                    </Item>
                    <Item label="商品分类"
                        initialValue={categoryIds}
                        name="categoryIds"
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pwRef} imgs={imgs}></PicturesWall>
                    </Item>
                    
                    <Item label="商品详情" 
                    labelCol={{xs: { span: 24 },
                            sm: { span: 2 },}}
                    wrapperCol = {
                        {
                            xs: { span: 24 },
                            sm: { span: 20 }
                        }
                    }
                    >
                        <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}