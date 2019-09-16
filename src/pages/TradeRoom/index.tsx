import React, { Component } from 'react'
import './index.less'
import { RouteComponentProps } from 'react-router-dom'

import Header from '../../Components/Header/index'
import Footer from '../../Components/Footer/index'
import TradeRoomChart from '../../Components/traderoomchart/traderoomchart'
import Market from './components/Market'
import Operate from './components/Operate'

import { getQuote, getKline } from '../../service/serivce'
import { changeNumber } from '../../utils/utils'



const minuteData = [
    { title: '1 minute', value: '1 m', period: 1 },
    { title: '5 minute', value: '5 m', period: 2 },
    { title: '15 minute', value: '15 m', period: 3 },
    { title: '30 minute', value: '30m', period: 4 },
    { title: '1 Hour', value: '1 H', period: 5 },
    { title: '1 Day', value: '1 D', period: 6 },
    { title: '7 Day', value: '7 D', period: 7 },
    { title: '1 Month', value: '1 M', period: 8 },
]


interface IState {
    quote: any;
    stockDate: any;
}
type Iprops = RouteComponentProps<{ id: string }>

class TradeRoom extends Component<Iprops> {
    state: IState = {
        quote: {},
        stockDate: [],
    }
    UNSAFE_componentWillMount() {
        const id = this.props.match.params.id
        this.onGetQuote(id)
        this.onGetKline(id, 6)
    }
    //股票行情数据
    onGetQuote(code: string) {
        getQuote({ code }).then(res => {
            this.setState({ quote: res[0] })
        })
    }
    //K线图数据
    onGetKline(prod_code: string, period: number) {
        getKline({ prod_code, period }).then(res => {
            let data = res.data.candle[prod_code]
            data = changeNumber(data, 2)
            this.setState({ stockDate: data })
        })
    }
    //切换周期
    periodCallback(e: { title: string, value: string, period: number }) {
        const id = this.props.match.params.id
        this.onGetKline(id, e.period)
    }
    render() {
        const { quote, stockDate } = this.state
        const code = this.props.match.params.id
        return (
            <div className="trade-room-wrapper">
                <Header {...this.props} trade={true} />
                <div className="trade-room-body">
                    <Market />
                    <TradeRoomChart
                        data={stockDate}
                        width={800}
                        height={680}
                        minuteData={minuteData}  //可根据股票或者外汇来设定
                        periodCallback={this.periodCallback.bind(this)} //周期回调
                        quote={quote}
                    />
                    <Operate quote={quote} code={code}/>
                </div>
                <Footer />
            </div>
        )
    }
}

export default TradeRoom