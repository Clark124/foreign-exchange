import React, { Component } from 'react'
import './index.less'
import { RouteComponentProps } from 'react-router-dom'

import Header from '../../Components/Header/index'
import Footer from '../../Components/Footer/index'
import TradeRoomChart from '../../Components/traderoomchart/traderoomchart'
import Market from './components/Market'
import Operate from './components/Operate'

import { getQuote, getKline, addOptional, deleteOptional, optionalList, getLastKline } from '../../service/serivce'
import { changeNumber } from '../../utils/utils'
import { message } from 'antd'

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}

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

interface optionItem {
    symbol: string;
    id: number;
}

interface IState {
    quote: any;
    stockDate: any;
    optionalList: optionItem[];
    period:number;
}
type Iprops = RouteComponentProps<{ id: string }>

class TradeRoom extends Component<Iprops> {
    state: IState = {
        optionalList: [],
        quote: {},
        stockDate: [],
        period:6,
    }
    timer: NodeJS.Timeout | undefined
    UNSAFE_componentWillMount() {
        const id = this.props.match.params.id
        this.onGetQuote(id)
        this.onGetKline(id, 6)
        this.refreshData(id,6)
        this.getOptionalList()
    }

    componentWillUnmount() {
        if(this.timer){
            clearInterval(this.timer)
        }
    }
    //自选列表
    getOptionalList() {
        const token = getToken()
        optionalList({}, token).then(res => {
            if (res.data.LWORK) {
                this.setState({ optionalList: res.data.LWORK })
            } else {
                this.setState({ optionalList: [] })
            }
        })
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
            if (res.data) {
                let data = res.data.candle[prod_code]
                
                data = changeNumber(data, 6)
                console.log(data)
                this.setState({ stockDate: data })
            }

        })
    }

    onGetLastKline(prod_code: string, period: number) {
        let { stockDate } = this.state
        const len = stockDate.length
        if (stockDate.length > 0) {
            getLastKline({ prod_code, period }).then(res => {

                let result = res.data.candle[prod_code]
                result = changeNumber(result, 6)
                result = result[1]

                if (stockDate[len - 1].date.toLocaleString() === result.date.toLocaleString()) {
                    stockDate[len - 1] = { ...stockDate[len - 1], ...result }
                } else {
                    stockDate.push(result)
                }
                this.setState({ stockDate })
            })
        }

    }

    refreshData(code:string, period:number){
        this.timer = setInterval(() => {
            if (period === 1) {
                this.onGetKline(code, period)
            } else {
                this.onGetLastKline(code, period)
            }
            this.onGetQuote(code)
        }, 3000)
    }


    //切换周期
    periodCallback(e: { title: string, value: string, period: number }) {
        if(this.timer){
            clearInterval(this.timer)
        }
        this.setState({stockDate:[]})
        const id = this.props.match.params.id
        this.onGetKline(id, e.period)
        this.refreshData(id,e.period)
        this.setState({ period: e.period})
    }

    //添加自选
    addOptional(id: string) {
        const token = getToken()
        addOptional({ symbol: id }, token).then(res => {
            if (res.success) {
                message.success('add success')
            }
            this.getOptionalList()
        })
    }
    //删除自选
    deleteOptional(id: string) {
        const token = getToken()
        deleteOptional({ id: id }, token).then(res => {
            if (res.success) {
                message.success('delete success')
            }
            this.getOptionalList()
        })
    }
    render() {
        const { quote, stockDate, optionalList } = this.state
        const code = this.props.match.params.id
        let codeId: any
        optionalList.forEach(item => {
            if (item.symbol === code) {
                codeId = item.id
            }
        })
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
                        showOptional={true}
                        addOptional={this.addOptional.bind(this, code)}
                        deleteOptional={this.deleteOptional.bind(this, codeId)}
                        optionalList={optionalList}
                        code={code}
                    />
                    <Operate quote={quote} code={code} />
                </div>
                <Footer />
            </div>
        )
    }
}

export default TradeRoom