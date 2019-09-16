import React, { Component } from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'

import { Select } from 'antd'

const { Option } = Select;



interface priceItem {
    name: string;
    price: number;
    number: number;
}

interface IState {
    buyList: priceItem[];
    sellList: priceItem[];
}

interface Props {
    quote: Quote;
    code: string;
}

type Iprops = Props & InjectedIntlProps

class Trade extends Component<Iprops> {
    state: IState = {
        buyList: [],
        sellList: [],
    }
    UNSAFE_componentWillMount() {
        console.log(this.props.code)
    }
    changeType() {

    }
    render() {
        const { quote, intl } = this.props
        let upColor = intl.formatMessage({ id: 'upColor', defaultMessage: '#2be594' });
        let downColor = intl.formatMessage({ id: 'downColor', defaultMessage: '#ff6060' });

        let arr1 = []
        let arr2 = []
        if (quote.bid_grp) {
            let buyGrp = quote.bid_grp
            let sellGrp = quote.offer_grp
            let sellGrpArr = sellGrp.split(',').slice(0, 15)
            let buyGrpArr = buyGrp.split(',').slice(0, 15)
            for (let i = sellGrpArr.length - 1; i >= 0; i = i - 3) {
                let obj = {
                    price: sellGrpArr[i - 2],
                    value: sellGrpArr[i - 1]
                }
                arr1.push(obj)
            }
            for (let i = 0; i < buyGrpArr.length; i = i + 3) {
                let obj = {
                    price: buyGrpArr[i],
                    value: buyGrpArr[i + 1]
                }
                arr2.push(obj)
            }
        }

        return (
            <div className="content">
                <div className="current-buy-sell">
                    <div className="buy-list">
                        {arr1.map((item, index) => {
                            return (
                                <div className="buy-item" key={index}>
                                    <span className="name">ASK{5 - index}</span>
                                    <span className="price" style={{ color: downColor }}>{item.price}</span>
                                    <span className="number">{Math.ceil(Number(item.value) / 100)}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="lost-price">
                        <div className="lost">
                            <span>LastPrice: </span>
                            <span className="price" style={quote.px_change_rate >= 0 ? { color: upColor } : { color: downColor }}>{quote.last_px}</span>
                        </div>
                        <div className="change">
                            <span>Change: </span>
                            <span className="price" style={quote.px_change_rate >= 0 ? { color: upColor } : { color: downColor }}>{quote.px_change_rate}%</span>
                        </div>
                    </div>
                    <div className="sell-list">
                        {arr2.map((item, index) => {
                            return (
                                <div className="sell-item"  key={index}>
                                    <span className="name">BID{index + 1}</span>
                                    <span className="price" style={{ color: upColor }}>{item.price}</span>
                                    <span className="number">{Math.ceil(Number(item.value) / 100)}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="trade-wrapper">
                    <div className="contract-wrapper">
                        <div className="contract-item">
                            <div className="name">Contract</div>
                            <div className="value">EURUSD</div>
                        </div>
                        <div className="contract-item">
                            <div className="name">Qty</div>
                            <div className="value">EURUSD</div>
                        </div>
                        <div className="contract-item">
                            <div className="name">Type</div>
                            <Select defaultValue="limit" style={{ width: 100 }} onChange={this.changeType.bind(this)}>
                                <Option value="HITBTC">HITBTC</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="Yiminghe">yiminghe</Option>
                            </Select>
                        </div>
                    </div>

                    <div className="price-wrapper">
                        <div className="name">Price:</div>
                        <div className="value">EURUSD</div>
                    </div>

                    <div className="buy-sell-operate">
                        <div className="btn btn-operate buy">
                            <div className="number">
                                0.015967
                                </div>
                            <div className="name">Bid</div>
                        </div>
                        <div className="btn btn-operate sell">
                            <div className="number">
                                0.015967
                                </div>
                            <div className="name">Ask</div>
                        </div>
                        <div className="btn btn-operate unwind">
                            <div className="number">
                                0.015967
                                </div>
                            <div className="name">Unwind</div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default injectIntl(Trade)