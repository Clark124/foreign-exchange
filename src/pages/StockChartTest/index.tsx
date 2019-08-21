import React, { Component } from 'react';
import { message, Button } from 'antd'
import { RouteComponentProps } from 'react-router-dom'
import TradeRoomChart from '../../Components/traderoomchart/traderoomchart'
import { getQuote, getKline } from '../../service/serivce'
import { changeNumber } from '../../utils/utils'

import './index.less'

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

type IProps = RouteComponentProps


interface IState {
    isChecked: boolean;
    content: string;
    number: number;
    quote: any;
    stockDate: any;

}
class StockChart extends Component<IProps>{
    state: IState = {
        content: "",
        isChecked: false,
        number: 1,
        quote: {},
        stockDate: [],
    }
    UNSAFE_componentWillMount() {
        this.onGetQuote('000001.SS')
        this.onGetKline('000001.SS', 6)
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
    submibt() {
        console.log(this.state.number)
        message.success('hahahah')
    }
    nav() {
        this.props.history.push('/edit')
    }

    periodCallback() {

    }

    render() {
        const { quote, stockDate } = this.state

        return (
            <div className="home">
                <div className="number">{this.state.number}</div>
                <div className="username">
                    <span>哈哈哈哈</span>
                </div>
                <button onClick={this.submibt.bind(this)}>点击</button>
                <div>
                    <Button type="primary" onClick={this.submibt.bind(this)}>Button</Button>
                    <Button type="primary" onClick={this.nav.bind(this)}>跳转</Button>
                </div>
                <TradeRoomChart
                    data={stockDate}
                    width={1200}
                    height={565}
                    minuteData={minuteData}  //可根据股票或者外汇来设定
                    periodCallback={this.periodCallback.bind(this)} //周期回调
                    quote={quote}
                />
            </div>
        )
    }
}



export default StockChart;
