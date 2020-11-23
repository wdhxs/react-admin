import React from 'react';
import {
    Card,
    List
} from 'antd';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {BASE_URL} from '../../utils/constants';
import {reqCategory} from '../../api';

const Item = List.Item;

export default class ProductDetail extends React.Component {
    state = {
        cName1: '', // 一级分类名称
        cName2: ''  // 二级分类名称
    }

    async componentDidMount() {
        const {pCategoryId, categoryId} = this.props.location.state;

        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId);
            if (result.status === 0) {
                const cName1 = result.data.name;
                this.setState({
                    cName1
                });
            }
        } else {
            /*
            const result1 = await reqCategory(pCategoryId);
            const result2 = await reqCategory(categoryId);
            这样写效率较低
            */
           
            // 一次发多个请求，只有都成功了，才正常处理
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
            const cName1 = results[0].data && results[0].data.name;
            const cName2 = results[1].data && results[1].data.name;

            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        const {name, desc, price, detail, imgs} = this.props.location.state;
        const {cName1, cName2} = this.state;
        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined 
                        style={{color: 'green',
                                marginRight: 15,
                                fontSize: 20
                        }}
                        onClick={()=>{this.props.history.goBack()}}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        );

        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item className="product-list-item">
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item className="product-list-item">
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item className="product-list-item">
                        <span className="left">商品价格：</span>
                        <span>{'￥' + price}</span>
                    </Item>
                    <Item className="product-list-item">
                        <span className="left">所属分类：</span>
                        <span>{cName1}--{cName2}</span>
                    </Item>
                    <Item className="product-list-item">
                        <span className="left">商品图片：</span>
                        <span>
                            {
                                imgs.map((img)=>{
                                    return (
                                        <img key={img}
                                        src={BASE_URL + img} 
                                        alt="图片"
                                        className="product-img"
                                        />
                                    )
                                })
                            }
                        </span>
                    </Item>
                    <Item className="product-list-item">
                        <span className="left">商品详情：</span>
                        {/* dangerouslySetInnerHTML相当于innerHtml */}
                            <span dangerouslySetInnerHTML={{__html: detail}}>
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}