import React, { Component } from 'react'
import './index.less'
import { strategyDetailData, standardCurve, addCollect, collectFollow } from '../../../../service/serivce'
import Loading from '../../../../Components/Loading/index'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import Moment from 'moment'
import DataSet from "@antv/data-set";
import { Modal ,Table} from 'antd'

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}

export default class Detail extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            data: {},
            visible: false,
            followItem: {},
            followCount: 1,
            visibleCode: false,

        }
        this.columns = [
            {
                title: 'Contract',
                dataIndex: 'symbol',
            },
            {
                title: 'Buy/Sell',
                dataIndex: 'type',
                render: text => <span style={text === 3 ? { color: 'red' } : { color: 'green' }}>{text===1?"buy":"sell"}</span>,
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: text => <span>{text.toFixed(3)}</span>
            },
            {
                title: 'Qty',
                dataIndex: 'lots',
                key: 'lots',
            },
            {
                title: 'Date&Time',
                dataIndex: 'time',
            },
        ]
    }
    UNSAFE_componentWillMount() {
        const id = this.props.match.params.id
        const token = getToken()
        strategyDetailData({ id }, token).then(res => {
            this.setState({ data: res, status: 'success' })
        }).catch(err => {
            this.setState({ status: 'success' })
        })
    }
    //获取沪深300曲线
    getStandardCurve(beginTime, endTime) {
        return new Promise((resolve, reject) => {
            const data = {
                period: 6,
                code: '000300.SS',
                startTime: beginTime,
                endTime: endTime,
            }
            standardCurve(data).then(res => {
                resolve(res.result)
            })
        })

    }

    followOrder(type) {
        if (!type) {
            Modal.info({
                title: "提示",
                content: "已经跟单过了"
            })
        } else {
            this.setState({ visible: true })
        }
    }
    followOk() {
        const { data, followCount } = this.state
        const token = localStorage.getItem('token')
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        const body = {
            release_id: data.id,
            link: '/quant/strategy/list?upBtn1=follow',
            message: `${userInfo.nickname}订购了你的策略`,
            type: 'follow'
        }
        const datas = {
            token,
            body: JSON.stringify(body),
            unit_count: followCount,
            subject: `跟单${followCount}个月`
        }
        collectFollow(datas).then(res => {
            if (res.data === 'success') {
                this.setState({
                    visible: false,
                    // data: { ...this.state.data, is_subscription: true }
                })
                // message.success('跟单成功！')
                this.props.history.push({
                    pathname: '/strategy/list',
                    search: '?type=4'
                })
            }
        })
    }

    collectOrder(type) {
        if (!type) {
            Modal.info({
                title: "提示",
                content: "已经收藏过了"
            })
        } else {
            const id = this.state.data.id
            const token = localStorage.getItem("token")
            const data = {
                token,
                collect_id: id,
                type: 'strategy'
            }
            addCollect(data).then(res => {
                this.setState({ data: { ...this.state.data, is_collect: true } })
                Modal.success({
                    title: "提示",
                    content: "收藏成功"
                })
            })
        }
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
        const { status } = this.state
        if (status === 'success') {
            const { data, visible, followCount, } = this.state

            let period = ""
            if (data.period === 6) {
                period = '1D'
            } else if (data.period === 1) {
                period = '1Min'
            } else if (data.period === 2) {
                period = '5Min'
            } else if (data.period === 3) {
                period = '15Min'
            } else if (data.period === 4) {
                period = '30Min'
            } else if (data.period === 5) {
                period = '1H'
            } else if (data.period === 7) {
                period = '7D'
            } else if (data.period === 8) {
                period = '1Mon'
            }
            let datas = []

            let curveDatas = []
            if (data.curve) {
                curveDatas = JSON.parse(data.curve)
            }
            curveDatas.forEach((item, index) => {
                let date = Moment(item.date.substring(0, 8), 'YYYYMMDD').format('YYYY-MM-DD')
                let obj = {}
                obj.date = date
                obj['profit'] = item.value.toFixed(2)
                // obj['沪深300'] = item.value
                datas.push(obj)
            })

            const ds = new DataSet();
            const dv = ds.createView().source(datas);

            dv.transform({
                type: "fold",
                fields: ['profit',],
                key: "types",
                value: "profit"
            });
            const cols = {
                date: {
                    tickCount: 8,
                }
            };
            return (
                <div className="strategy-detail-wrapper">
                    <div className="container">
                        <div className="nav-title">
                            <span onClick={() => this.props.history.push('/strategy/rank')}>Al-trade</span>
                            <span>></span>
                            <span className="">Strategy List</span>
                            <span>></span>
                            <span className="current">Strategy Detail</span>
                        </div>
                        <div className="base-info-wrapper">
                            <div className="strategy-name">{data.name}</div>
                            <div className="operate-btn">
                                {data.is_follow ? <span className="has" onClick={this.followOrder.bind(this, false)}>Has Follow</span> : <span className="orange" onClick={this.followOrder.bind(this, true)}>Follow</span>}
                                {data.is_collect ? <span className="has" onClick={this.collectOrder.bind(this, false)}>Has Collect</span> : <span onClick={this.collectOrder.bind(this, true)}>Collect</span>}
                            </div>
                            <div className="create">
                                <span>Author：{data.nickname}</span>
                                <span>Create Date：{data.create_date}</span>
                            </div>
                            <div className="intro">Strategy Description：{data.description ? data.description : 'none'}</div>
                            <div className="look-btn">
                                {/* <span onClick={() => this.setState({ visibleCode: true })}>查看策略源码</span> */}
                                <span onClick={() => {
                                    window.open(`/#/aiTrade/detail/report/${data.id}`, "_blank");
                                }}>Check BackTest Report</span>
                            </div>
                        </div>
                        <div className="backtest-title">Strategy Running Report</div>
                        <table className="table" cellPadding="0" cellSpacing="0">
                            <tbody className="t-body">
                                <tr className="table-header">
                                    <td>Strategy Name</td>
                                    <td>Initial Capital</td>
                                    <td>Current Capital</td>
                                    <td>Profit</td>
                                    <td>Contract code</td>
                                    <td>Trading frequency</td>
                                </tr>
                                <tr className="table-item" >
                                    <td>{data.strategy_name}</td>
                                    <td>{data.init_captital}</td>
                                    <td>{data.init_captital + data.init_captital * data.return_ratio}</td>
                                    <td>{(data.init_captital * data.return_ratio).toFixed(2)}</td>
                                    <td>{data.symbol}</td>
                                    <td>{period}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="backtest-title">Trade Statistics Report：</div>
                        <table className="table" cellPadding="0" cellSpacing="0">
                            <tbody className="t-body">
                                <tr className="table-header">
                                    <td>Profit Rate</td>
                                    <td>Maximum Drawdown</td>
                                    <td>Win-Times</td>
                                    <td>Average Profit</td>
                                    <td>Continuous Wins</td>
                                </tr>
                                <tr className="table-item" >
                                    <td>{(data.return_ratio * 100).toFixed(2)}%</td>
                                    <td>{Number(data.MaxDD) * 100}%</td>
                                    <td>{data.nwinner}</td>
                                    <td>{Number(data.winner_avg).toFixed(2)}</td>
                                    <td>{data.max_nwinner}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table item" cellPadding="0" cellSpacing="0">
                            <tbody className="t-body">
                                <tr className="table-header">
                                    <td>Timing return</td>
                                    <td>Profit/Risk Rate</td>
                                    <td>Loss-Times</td>
                                    <td>Average Loss</td>
                                    <td>Continuous Losses</td>
                                </tr>
                                <tr className="table-item" >
                                    <td>{(data.timing_return * 100).toFixed(2)}%</td>
                                    <td>{data.return_risk_ratio.toFixed(2)}%</td>
                                    <td>{data.nloser}</td>
                                    <td>{Number(data.loser_avg).toFixed(2)}</td>
                                    <td>{data.max_nloser}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table item" cellPadding="0" cellSpacing="0">
                            <tbody className="t-body">
                                <tr className="table-header">
                                    <td>Annual Profit Rate</td>
                                    <td>Profit Factor</td>
                                    <td>Win-Rate</td>
                                    <td>Maximum Capital</td>
                                    <td>Minimum Capital</td>
                                </tr>
                                <tr className="table-item" >
                                    <td>{(data.yearly_return_ratio * 100).toFixed(2)}%</td>
                                    <td>{Number(data.profit_factor).toFixed(2)}</td>
                                    <td>{(Number(data.winning_ratio) * 100).toFixed(2)}%</td>
                                    <td>{Number(data.largest_capital).toFixed(2)}</td>
                                    <td>{Number(data.minimum_capital).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="backtest-title">Equity Curve：</div>
                        <div style={{ background: '#fff', marginTop: 10, marginBottom: 30 }}>
                            <Chart height={400} data={dv} scale={cols} forceFit padding="auto">
                                <Legend textStyle={{ fontSize: '14' }} marker="square" />
                                <Axis name="date" />
                                <Axis line={{ stroke: "#ccc" }} name="profit" />
                                <Tooltip crosshairs={{ type: "y" }} />
                                <Geom
                                    type="line"
                                    position="date*profit"
                                    size={2}
                                    color={["types", ['#3E6ECF', '#E5364F']]}
                                />
                            </Chart>
                        </div>

                        {/* <div className="backtest-title">持仓记录</div>
                    <table className="table" cellPadding="0" cellSpacing="0">
                        <tbody className="t-body">
                            <tr className="table-header">
                                <td>股票</td>
                                <td>当前价</td>
                                <td>成本价</td>
                                <td>持股数</td>
                                <td>持股市值</td>
                                <td>盈亏比例</td>
                                <td>浮动盈亏</td>
                            </tr>
                            <tr className="table-item" >
                                <td>{position_stock.security_name}</td>
                                <td>{position_stock.last_px}</td>
                                <td>{position_stock.cost_price}</td>
                                <td>{position_stock.position}</td>
                                <td>{(position_stock.position * position_stock.last_px).toFixed(2)}</td>
                                <td>{position_stock.last_px ? ((position_stock.last_px - position_stock.cost_price) * position_stock.position * 100 / (position_stock.cost_price * position_stock.position)).toFixed(2) : "--"}%</td>
                                <td>{((position_stock.last_px - position_stock.cost_price) * position_stock.position).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table> */}

                        <div className="backtest-title">Trade Details</div>
                        <Table columns={this.columns} dataSource={data.signal} rowKey={record => record.id}/>
                        {/* <table className="table" cellPadding="0" cellSpacing="0" style={{ marginBottom: 100 }}>
                            <tbody className="t-body">
                                <tr className="table-header">
                                    <td>Contract</td>
                                    <td>Buy/Sell</td>
                                    <td>Price</td>
                                    <td>Qty</td>
                                    <td>Date&Time</td>

                                </tr>
                                {data.signal.length > 0 ? data.signal.map((item, index) => {
                                    return (
                                        <tr className="table-item" key={index}>
                                            <td>{item.symbol}</td>
                                            <td style={item.type === 1 ? { color: 'red' } : { color: 'green' }}>{item.type === 1 ? 'buy' : "sell"}</td>
                                            <td>{item.price ? item.price.toFixed(3) : "--"}</td>
                                            <td>{item.lots}</td>
                                            <td>{item.time.substring(0, 10)}</td>

                                        </tr>
                                    )
                                }) : null
                                    // <div className="" style={{marginBottom:50}}></div>
                                }

                            </tbody>
                        </table> */}
                        {/* <Modal
                        title="跟单"
                        visible={visible}
                        onOk={this.followOk.bind(this)}
                        onCancel={() => this.setState({ visible: false })}
                        width={400}
                    >
                        <div className="follow-model">
                            <div>策略名称：{strategy_name}</div>
                            <div className="choose-count">
                                <span>选择数量：</span>
                                <span className="btn" onClick={this.reduceFollowCount.bind(this)}>-</span>
                                <span className="count">{followCount}</span>
                                <span className="btn" onClick={this.addFollowCount.bind(this)}>+</span>
                                <span className="text">个月</span>
                            </div>
                        </div>

                    </Modal> */}
                        {/* <Modal
                        title="策略源码"
                        visible={this.state.visibleCode}
                        width={400}
                        height={400}
                        footer={null}
                        onCancel={() => this.setState({ visibleCode: false })}
                    >
                        <div className="code-wrapper">
                            <textarea value={express} onChange={() => { }} />
                        </div>

                    </Modal> */}
                        {/* <div className="mark">风险提示：投资有风险，请自主决策。上述信息供交流使用，仅供参考，不对您构成任何投资建议，据此操作，风险自担。</div> */}

                    </div>
                </div>

            )
        } else {
            return (
                <div style={{ height: 800 }}>
                    <Loading text="loading..." />
                </div>
            )

        }

    }
}