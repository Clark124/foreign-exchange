import React, { Component } from 'react'
import { Modal, message, Radio, Switch } from 'antd'
import { deleteFollowStrategy, suspendDeploy, setFollowTradeMethod, followStrategyNotice } from '../../../../../service/serivce'

export default class Follow extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
        }
    }
    //删除策略
    deleteStrategy(item, index) {
        Modal.confirm({
            title: '提示',
            content: "确定要删除这条记录吗？",
            okText: "确定",
            onOk: () => {
                const token = localStorage.getItem('token')
                deleteFollowStrategy({ token, id: item.id }).then(res => {
                    if (res.success) {
                        message.success('删除成功~')
                        this.props.refresh()
                    } else {
                        message.error('删除失败~')
                    }
                })
            }


        })
    }
    //暂停策略
    onSuspendDeploy(item, index) {
        suspendDeploy({ id: item.release_id }).then(res => {

            this.props.suspendDeploy(index)
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
        setFollowTradeMethod(data).then(res => {
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
        followStrategyNotice(data).then(res => {
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
        followStrategyNotice(data).then(res => {
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
        followStrategyNotice(data).then(res => {
            if (res.success) {
                this.props.changeNotice(item.system_notice, item.weixin_notice, e, index)
            }
        })
    }
    render() {
        let { dataList, tabIndex } = this.props
        if (parseInt(tabIndex) !== 4) {
            dataList = []
        }
        return (
            <div className="list-wrapper">
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header trust">
                            <td>策略名称</td>
                            <td>交易标的</td>
                            <td>频率</td>
                            <td>收益率</td>
                            <td>运行状态</td>
                            <td className="operate">操作</td>
                            <td className="trade-method">交易方式</td>
                            <td>信号通知方式</td>
                            <td>起止时间</td>
                        </tr>
                        {dataList.map((item, index) => {
                            return (
                                <tr className="table-item  trust" key={index}>
                                    <td className="item-name">
                                        <div className="item-names click" onClick={()=>this.props.history.push(`/strategy/detail/${item.release_id}`)}>{item.name}</div>
                                    </td>
                                    <td className="click" onClick={()=> this.props.history.push('/traderoom?code='+item.code)}>{item.stock_name}</td>
                                    <td>1日</td>    
                                    <td className={item.return_ratio >= 0 ? "profit" : "profit green"}>{(item.return_ratio*100).toFixed(2)}%</td>
                                    <td className={item.status === '1' ? 'status' : "status green"}>{item.status === '1' ? "已开启" : "已暂停"}</td>
                                    <td className="operate">
                                        {item.status === '1' ?
                                            <span className="btn" onClick={this.onSuspendDeploy.bind(this, item, index)} >暂停</span> :
                                            <span className="btn" onClick={this.onSuspendDeploy.bind(this, item, index)}>开启</span>}
                                        <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>删除</span>
                                    </td>
                                    <td className="trade-method">
                                        <Radio.Group onChange={(e) => this.onChangeTrade(e, index, item.id)} value={item.trade_flag}>
                                            <Radio value={true}>自动跟随交易</Radio>
                                            <Radio value={false}>仅提示交易信号</Radio>
                                        </Radio.Group>

                                    </td>
                                    <td className="notice-method">
                                        <div>系统 <Switch size={'small'} checked={item.system_notice} onChange={(e) => this.changeSysNotice(e, index, item)} /></div>
                                        <div>微信 <Switch size={'small'} checked={item.weixin_notice} onChange={(e) => this.changeWxNotice(e, index, item)} /></div>
                                        <div>短信 <Switch size={'small'} checked={item.sms_notice} onChange={(e) => this.changeSmsNotice(e, index, item)} /></div>
                                    </td>
                                    <td>{item.start_date}~<br/>{item.end_date}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {dataList.length === 0 ? <div className="no-data">暂无数据</div> : null}


            </div>
        )
    }
}