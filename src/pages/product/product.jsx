import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import ProductHome from './home';
import ProductDetail from './detail';
import ProductAddUpdate from './add-update';
import './product.less';

export default class Product extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path="/product" component={ProductHome}></Route>
                <Route path="/product/detail" component={ProductDetail}></Route>
                <Route path="/product/addupdate" component={ProductAddUpdate}></Route>
                <Redirect to="/product"></Redirect>
            </Switch>
        )
    }
}