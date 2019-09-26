import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';
import './index.less'

import { RouteComponentProps } from 'react-router-dom'

import Header from '../../Components/Header/index'
import Footer from '../../Components/Footer/index'
import Build from './components/Build/index'
import Intelli from './components/Intelli/index'
import List from './components/List/index'

type IProps = RouteComponentProps

export default class AiTrade extends Component<IProps>{
    render() {
        const isIntelli = this.props.location.pathname.includes('intelli')
        return (
            <div className="ai-trade">
                <Header {...this.props} trade={isIntelli ? true : false} />
                <Switch>
                    <Route exact path="/aiTrade/build" component={Build} />
                    <Route exact path="/aiTrade/intelli" component={Intelli} />
                    <Route exact path="/aiTrade/intelli/:id" component={Intelli} />
                    <Route exact path="/aiTrade/list" component={List} />
                </Switch>
                <Footer />
            </div>
        )
    }
}