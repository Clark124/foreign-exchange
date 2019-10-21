import React, { Component } from 'react'
import { Modal, message } from 'antd'
import { deleteTrust, suspendDeploy, setTradeMethod, strategyNotice } from '../../../../../service/serivce'
import Loading from '../../../../../Components/Loading/index'

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}

export default class Deploy extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            status:""
        }
    }
    //删除策略
    deleteStrategy(item, index) {
        Modal.confirm({
            title: 'tips',
            content: "confirm delete this?",
            okText: "confirm",
            onOk: () => {
                const token = getToken()
                deleteTrust({ id: item.id }, token).then(res => {
                    if (res.success) {
                        message.success('delete success~')
                        this.props.refresh()
                    } else {
                        message.error('delete fail~')
                    }
                })
            }


        })
    }
    //暂停策略
    onSuspendDeploy(item, index) {
        const token = getToken()
        let status = ""
        if(item.status==='running'){
            status = 0
        }else{
            status = 1
        }
        this.setState({status:"loading"})
        suspendDeploy({ id: item.id ,status},token).then(res => {
            this.setState({status:"success"})
            this.props.suspendDeploy(index)
            message.success('update success')
        })
    }

    //点击交易方式
    onChangeTrade(e, index, id) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            id,
            trade_flag: e.target.value ? 1 : 0
        }
        setTradeMethod(data).then(res => {
            if (res.success) {
                this.props.setTrade(index)
            }
        })

    }
    //系统通知开关
    changeSysNotice(e, index, item) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            id: item.id,
            system_notice: e ? 1 : 0,
            weixin_notice: item.weixin_notice ? 1 : 0,
            sms_notice: item.sms_notice ? 1 : 0,
        }
        strategyNotice(data).then(res => {
            if (res.success) {
                this.props.changeNotice(e, item.weixin_notice, item.sms_notice, index)
            }
        })
    }
    //微信通知开关
    changeWxNotice(e, index, item) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            id: item.id,
            system_notice: item.system_notice ? 1 : 0,
            weixin_notice: e ? 1 : 0,
            sms_notice: item.sms_notice ? 1 : 0,
        }
        strategyNotice(data).then(res => {
            if (res.success) {
                this.props.changeNotice(item.system_notice, e, item.sms_notice, index)
            }
        })
    }
    //短信通知开关
    changeSmsNotice(e, index, item) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            id: item.id,
            system_notice: item.system_notice ? 1 : 0,
            weixin_notice: item.weixin_notice ? 1 : 0,
            sms_notice: e ? 1 : 0,
        }
        strategyNotice(data).then(res => {
            if (res.success) {
                this.props.changeNotice(item.system_notice, item.weixin_notice, e, index)
            }
        })
    }
    render() {
        let { dataList, tabIndex } = this.props
        if (parseInt(tabIndex) !== 2) {
            dataList = []
        }

        return (
            <div className="list-wrapper">
                 {this.state.status === 'loading' ? <Loading /> : null}
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header trust">
                            <td>Name</td>
                            <td>Pair</td>
                            <td>OHLC-Frequency</td>
                            <td>Start Date</td>
                            <td>Profit Rate</td>
                            <td>Status</td>
                            <td className="operate">Action</td>
                        </tr>
                        {dataList.map((item, index) => {
                            let period = ""
                            if (item.period === 6) {
                                period = '1D'
                            } else if (item.period === 1) {
                                period = '1Min'
                            } else if (item.period === 2) {
                                period = '5Min'
                            } else if (item.period === 3) {
                                period = '15Min'
                            } else if (item.period === 4) {
                                period = '30Min'
                            } else if (item.period === 5) {
                                period = '1H'
                            } else if (item.period === 7) {
                                period = '7D'
                            } else if (item.period === 8) {
                                period = '1Mon'
                            }
                            return (
                                <tr className="table-item  trust" key={index}>
                                    <td className="item-name click" onClick={() => this.props.history.push(`/aiTrade/detail/${item.id}`)}>{item.name}</td>
                                    <td className="click" onClick={() => this.props.history.push('/tradeRoom/' + item.symbol)}>{item.symbol}</td>
                                    <td>{period}</td>
                                    <td>{item.start_date.substring(0,10)}</td>
                                    <td className={item.return_ratio >= 0 ? "profit" : "profit green"}>{(item.return_ratio * 100).toFixed(2)}%</td>
                                    <td className={item.status === 'running' ? 'status green' : "status"}>{item.status}</td>
                                    <td className="operate">
                                        {item.status === 'running' ?
                                            <span className="btn" onClick={this.onSuspendDeploy.bind(this, item, index)} >stop</span> :
                                            <span className="btn" onClick={this.onSuspendDeploy.bind(this, item, index)}>run</span>}
                                        <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>delete</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {dataList.length === 0 ? <div className="no-data">No Data</div> : null}


            </div>
        )
    }
}