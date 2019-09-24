import React, { Component } from 'react'
import { Select, Modal, Radio } from 'antd'

const Option = Select.Option;

export default class Risk extends Component {
    constructor() {
        super()
        this.state = {
            isRepeatBuy: 'false',
            buyset: 1, //选择买入数量设置
            singleBuyPercent: "", //单词买入总资金的百分比
            singleBuyCount: "",//单次买入数量
            minHold: "",
            maxHold: "",
            stopProfit: "",
            stopLose: "",
            moveStopLose: "",
            strategyName: "",
            strategyDiscrib: ""

        }
    }
    changeRepeatBuy(e) {
        this.setState({ isRepeatBuy: e })
    }
    onChangeBuySet(e) {
        this.setState({ buyset: e.target.value })
    }
    //查看代码
    lookCode() {
        const { isRepeatBuy, buyset, singleBuyPercent, singleBuyCount, minHold, maxHold, stopProfit, stopLose, moveStopLose, strategyName } = this.state
        const data = {
            is_repeat: isRepeatBuy === 'false' ? 0 : 1,
            capital_ratio: buyset === 1 ? singleBuyPercent : "",
            lots: buyset === 2 ? singleBuyCount : "",
            max_position_time: maxHold,
            min_position_time: minHold,
            profit_ratio: stopProfit,
            loss_ratio: stopLose,
            move_loss_ratio: moveStopLose,
            strategy_name: strategyName,
        }
        this.props.lookCode(data)
    }
    //点击保存
    onSave() {
        const { isRepeatBuy, buyset, singleBuyPercent, singleBuyCount, minHold, maxHold, stopProfit, stopLose, moveStopLose, strategyName, strategyDiscrib } = this.state
        if (buyset === 1 && singleBuyPercent === "") {
            Modal.error({
                title: "提示",
                content: "请输入单次买入的总资金的比例"
            })
            return
        }
        if (buyset === 2 && singleBuyCount === "") {
            Modal.error({
                title: "提示",
                content: "请输入单次买入数量"
            })
            return
        }
        if (strategyName.trim() === "") {
            Modal.error({
                title: "提示",
                content: "请输入策略名称"
            })
            return
        }
        const data = {
            is_repeat: isRepeatBuy === 'false' ? 0 : 1,
            capital_ratio: buyset === 1 ? singleBuyPercent : "",
            lots: buyset === 2 ? singleBuyCount : "",
            max_position_time: maxHold,
            min_position_time: minHold,
            profit_ratio: stopProfit,
            loss_ratio: stopLose,
            move_loss_ratio: moveStopLose,
            strategy_name: strategyName,
            description: strategyDiscrib,
        }
        this.props.saveStrategy(data)


    }
    render() {
        const { tabIndex } = this.props
        const { isRepeatBuy, singleBuyPercent, singleBuyCount, minHold, maxHold,
            stopProfit, stopLose, moveStopLose, strategyName, strategyDiscrib
        } = this.state
        let repeatValue = ""
        if (isRepeatBuy === 'true') {
            repeatValue = 'yes'
        } else {
            repeatValue = 'no'
        }
        return (
            <div className="risk-wrapper" style={tabIndex === 2 ? { display: 'block' } : { display: 'none' }}>
                <div className="title">Risk Management Options:</div>
                <div className="indicate-wrapper">
                    <div className="input-item">
                        <span className="item-name">
                            Repeat Buying:
                        </span>
                        <Select value={repeatValue} style={{ width: 180 }} onChange={(e) => this.changeRepeatBuy(e)}>
                            <Option value={'true'}>yes</Option>
                            <Option value={'false'}>no</Option>
                        </Select>
                    </div>
                    <div className="input-item select">
                        <span className="item-name">
                            Buying Quantity:
                        </span>
                        <Radio.Group onChange={this.onChangeBuySet.bind(this)} value={this.state.buyset}>
                            <div className="buyset-item">
                                <Radio value={1}>
                                    <span className="buy-set-title">Buy in proportion</span>
                                    {/* <span>单次买入总资金的：</span> */}
                                    <input className="buy-set-input" disabled={this.state.buyset === 2} value={singleBuyPercent} onChange={(e) => this.setState({ singleBuyPercent: e.target.value })} /> %
                                </Radio>
                            </div>

                            <Radio value={2}>
                                <span className="buy-set-title-2">Buy by quantity</span>
                                {/* <span> 单次买入数量：</span> */}
                                <input className="buy-set-input" disabled={this.state.buyset === 1} value={singleBuyCount} onChange={(e) => this.setState({ singleBuyCount: e.target.value })} />
                            </Radio>

                        </Radio.Group>
                    </div>
                    <div className="input-item">
                        <span className="item-name">
                            Shortest holding days:
                        </span>
                        <input className="input-count" type="number" value={minHold} onChange={(e) => this.setState({ minHold: e.target.value })} />
                    </div>
                    <div className="input-item">
                        <span className="item-name">
                            Longes holding days:
                        </span>
                        <input className="input-count" type="number" value={maxHold} onChange={(e) => this.setState({ maxHold: e.target.value })} />
                    </div>
                    <div className="input-item">
                        <span className="item-name">
                            Take profit ratio:
                        </span>
                        <input className="input-count" type="number" value={stopProfit} onChange={(e) => this.setState({ stopProfit: e.target.value })} /> %
                    </div>
                    <div className="input-item">
                        <span className="item-name">
                            Stop loss ratio:
                        </span>
                        <input className="input-count" type="number" value={stopLose} onChange={(e) => this.setState({ stopLose: e.target.value })} /> %
                    </div>
                    <div className="input-item">
                        <span className="item-name">
                            Moving stop loss ratio:
                        </span>
                        <input className="input-count" type="number" value={moveStopLose} onChange={(e) => this.setState({ moveStopLose: e.target.value })} /> %
                    </div>
                    <div className="mark">Note:No fill means no restrictions.</div>
                </div>

                <div className="strategy-name-discrib">
                    <div className="input-strategy-name">
                        <span className="item-name">
                            Name:
                        </span>
                        <input className="input-count" type="text"
                            // placeholder={'请填写策略名称'}
                            value={strategyName} onChange={(e) => this.setState({ strategyName: e.target.value })} />
                    </div>
                    <div className="input-strategy-name discrib-wrapper">
                        <span className="item-name">
                            Description:
                        </span>
                        <textarea className="discrib" value={strategyDiscrib} onChange={(e) => this.setState({ strategyDiscrib: e.target.value })} />
                    </div>
                </div>


                <div className="btn-wrapper">
                    <div className="btn" onClick={() => this.props.changeStep(2)}>BACK</div>
                    <div className="btn" onClick={this.lookCode.bind(this)}>VIEW CODE</div>
                    <div className="btn" onClick={this.lookCode.bind(this)}>BACKTESTT</div>
                    <div className="btn" onClick={this.onSave.bind(this)}>SAVE</div>
                </div>
            </div>
        )
    }
}