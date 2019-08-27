import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { connect } from 'react-redux'

import Bundle from './bundle';
// const History = require('history')
// const history = History.createBrowserHistory()
// const location = history.location.pathname
// console.log(location)

// let isLogin = localStorage.getItem('userinfo');
// let userInfo = ""
// if (isLogin) {
//     userInfo = JSON.parse(isLogin)
// }
//判断是否是登录状态
// const nextRoute = ['/', '/home','/postcard','/searchcode','/information','/recentchat','/contractuser','/goldreward','/myAnswer','/redpackage']
// if (nextRoute.indexOf(location) >= 0 || location.includes('chatRoom') || location.includes('questionDetail')|| location.includes('userdetail') ) {
//     if (!isLogin) {
//         history.push('/')
//     } else {
//         if (location === '/') {
//             history.push('/home')
//         } else {
//             history.push(location)
//         }

//     }
// } else {
//     history.push('/')
// }

//stockchart
const StockChart = (props) => (
    <Bundle load={() => import('../pages/StockChartTest/index')}>
        {(StockComponent) => <StockComponent {...props} />}
    </Bundle>
)


//首页
const Home = (props) => (
    <Bundle load={() => import('../pages/Home/index')}>
        {(HomeComponent) => <HomeComponent {...props} />}
    </Bundle>
)

//交易室
const TradeRoom = (props) => (
    <Bundle load={() => import('../pages/TradeRoom/index')}>
        {(TradeRoomComponent) => <TradeRoomComponent {...props} />}
    </Bundle>
)



const routerMap = [
    { path: '/', component: Home, exact: true },
    { path: '/tradeRoom', component: TradeRoom, exact: true },
    { path: '/stockchart', component: StockChart, exact: true },
]


class Routers extends Component {
    UNSAFE_componentWillMount() {
        // this.props.getUserInfo(userInfo)
    }
    render() {
        return (
            <Router>
                <Switch>
                    {routerMap.map((router) =>
                        <Route key={router.path} exact={router.exact} path={router.path} component={router.component} />
                    )}
                </Switch>
            </Router>
        )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(null, mapDispatchToProps)(Routers);

