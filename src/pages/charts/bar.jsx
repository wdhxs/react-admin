/**
 * 柱状图
 */
import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'
/*后台管理的柱状图路由组件
*/
export default class Bar extends Component {

    state = {
        sales: [5, 20, 36, 10, 10, 20],
        stores: [10, 10, 10, 16, 10, 5]
    }

    update = () => {
        this.setState(state => ({
            sales: state.sales.map(sale => sale + 1),
            stores: state.stores.map(store => store - 1)
        }));
    }

    getOption = (sales, stores) => {
        return {
            title: {
                text: '销量库存图'
            },
            tooltip: {},
            legend: {
                data: ['销量', '库存']
            },
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: sales
            }, {
                name: '库存',
                type: 'bar',
                data: stores
            }]
        }
    }
    
    render() {

        const { sales, stores } = this.state;

        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                    </Card>
                    <Card title='柱状图'>
                    <ReactEcharts option={this.getOption(sales, stores)} style={{height: 300}}/>
                </Card>
            </div>
            )
        }
}