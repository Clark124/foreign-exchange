import React, { Component } from 'react'
import { Modal, message } from 'antd'
import { deleteCollect, collectFollow } from '../../../../../service/serivce'

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}


export default class Collect extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            followItem: {},
            followCount: 1
        }
    }
    //删除策略
    deleteStrategy(item, index) {
        Modal.confirm({
            title: 'tips',
            content: "are you sure to delete?",
            okText: "confirm",
            onOk: () => {
                const token = getToken()
                deleteCollect({ ref_id: item.ref_id, }, token).then(res => {
                    if (res.success) {
                        message.success('delete success')
                        this.props.refresh()
                    } else {
                        message.error('delete fail')
                    }
                })
            }
        })
    }

    //跟单
    onFollow(item, index) {
        let { dataList } = this.props
        this.setState({ followItem: dataList[index], visible: true })
    }
    followOk() {
        const { followItem, followCount } = this.state
        const token = getToken()

        const datas = {
            release_id: followItem.ref_id,
            time_count: followCount,
            account_id: 0
        }

        collectFollow(datas, token).then(res => {
            if (res.success) {
                this.setState({ visible: false })
                this.props.followSuccess()
                message.success('跟单成功！')
            }
        })


    }
    reduceFollowCount() {
        const { followCount } = this.state
        if (followCount <= 1) {
            return
        }
        this.setState({ followCount: this.state.followCount - 1 })
    }
    addFollowCount() {
        this.setState({ followCount: this.state.followCount + 1 })
    }
    render() {
        let { dataList, tabIndex } = this.props
        if (parseInt(tabIndex) !== 5) {
            dataList = []
        }
        const { visible, followItem, followCount } = this.state
        return (
            <div className="list-wrapper">
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header">
                            <td>name</td>
                            <td>author</td>
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
                                <tr className="table-item" key={index}>
                                    <td className="item-name click" onClick={() => this.props.history.push(`/aiTrade/detail/${item.ref_id}`)}>
                                        <div className="item-names">{item.name}</div>
                                    </td>
                                    <td >{item.nickname}</td>
                                    <td className="click" onClick={() => this.props.history.push('/tradeRoom/' + item.symbol)}>{item.symbol}</td>
                                    <td>{period}</td>
                                    <td>{item.create_date.substring(0, 10)}</td>
                                    <td className={item.return_ratio >= 0 ? "profit" : "profit green"}>{(item.return_ratio * 100).toFixed(2)}%</td>
                                    <td className={item.is_follow === 0 ? 'status' : "status green"}>{item.is_follow === 1 ? "running" : "stop"}</td>
                                    <td className="operate">
                                        {item.is_follow ? null : <span className="btn" onClick={this.onFollow.bind(this, item, index)}>follow</span>}
                                        <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>delete</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Modal
                    title="Follow"
                    visible={visible}
                    onOk={this.followOk.bind(this)}
                    onCancel={() => this.setState({ visible: false })}
                    width={400}
                >
                    <div className="follow-model">
                        <div>Strategy Name：{followItem.name ? followItem.name : ""}</div>
                        <div className="choose-count">
                            <span>Count：</span>
                            <span className="btn" onClick={this.reduceFollowCount.bind(this)}>-</span>
                            <span className="count">{followCount}</span>
                            <span className="btn" onClick={this.addFollowCount.bind(this)}>+</span>
                            <span className="text">month(s)</span>
                        </div>
                    </div>

                </Modal>
                {dataList.length === 0 ? <div className="no-data">No Data</div> : null}


            </div>
        )
    }
}