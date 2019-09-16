import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';
import './index.less'

import { RouteComponentProps } from 'react-router-dom'

import Header from '../../Components/Header/index'
import Footer from '../../Components/Footer/index'
import Build from './components/Build/index'

type IProps = RouteComponentProps

export default class AiTrade extends Component<IProps>{
    render() {
        return (
            <div className="ai-trade">
                <Header {...this.props} />
                <div className="container">
                    <Switch>
                        <Route exact path="/aiTrade/build" component={Build} />
                     
                    </Switch>
                </div>
                <Footer />
            </div>
        )
    }
}