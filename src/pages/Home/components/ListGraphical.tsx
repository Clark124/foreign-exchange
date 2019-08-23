import React, { Component } from 'react'
import { Radio } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio';
import ChartList from './ChartList'
import { getKline } from '../../../service/serivce'

import { changeNumber } from '../../../utils/utils'
import { Pagination } from 'antd';

interface IProps {

}

//列表数据
interface List {
    currency: string,
    code: string,
    latestPrice: number,
    chg: number,
    priceChange: number,
    open: number,
    high: number,
    low: number,
    bid: number,
    ask: number,
}

interface IState {
    selectIndex: number,
    stockDate: KLineDataList,
    totalRow: number,
    dataList: List[]
}


export default class ListGraphical extends Component<IProps, IState> {
    state = {
        selectIndex: 0,
        stockDate: [],
        totalRow: 1,
        dataList: [{
            currency: '欧元美元',
            code: 'EURUSD',
            latestPrice: 1.1558,
            chg: 0.34,
            priceChange: 0.0041,
            open: 1.1532,
            high: 1.1571,
            low: 1.1529,
            bid: 1.1559,
            ask: 1.1563,
        },
        {
            currency: '欧元美元',
            code: 'EURUSD',
            latestPrice: 1.1558,
            chg: -0.34,
            priceChange: -0.0041,
            open: 1.1532,
            high: 1.1571,
            low: 1.1529,
            bid: 1.1559,
            ask: 1.1563,
        }
        ]

    }
    //切换列表、图形
    ChangeViewMode(e: RadioChangeEvent) {
        this.setState({ selectIndex: e.target.value })
    }

    UNSAFE_componentWillMount() {
        this.onGetKline('000001.SS', 6)
    }

    //K线图数据
    onGetKline(prod_code: string, period: number) {
        getKline({ prod_code, period }).then(res => {
            let data = res.data.candle[prod_code]
            data = changeNumber(data, 2)
            this.setState({ stockDate: data })
        })
    }

    onChangePage(page:number) {
        console.log(page)
    }
    render() {
        const { selectIndex, totalRow, dataList } = this.state
        return (
            <div className="table-wrapper">
                <div className="view-mode">
                    <span className="text">View mode:</span>
                    <Radio.Group onChange={this.ChangeViewMode.bind(this)} value={selectIndex}>
                        <Radio value={0}>List</Radio>
                        <Radio value={1}>Graphical</Radio>
                    </Radio.Group>
                </div>
                {selectIndex === 0 ?
                    <table className="table">
                        <tbody>
                            <tr className="table-header">
                                <td>Currency/Code</td>
                                <td>Latest price</td>
                                <td>CHG</td>
                                <td>Price Change</td>
                                <td>Open</td>
                                <td>HIGH</td>
                                <td>LOW</td>
                                <td>Bid/ Ask</td>
                            </tr>
                            {dataList.map((item, index) => {
                                return (
                                    <tr className="table-item" key={index}>
                                        <td className="name">
                                            <div>{item.currency}</div>
                                            <div>{item.code}</div>
                                        </td>
                                        <td className="lastest-price">{item.latestPrice}</td>
                                        <td className={item.chg >= 0 ? "chg" : "chg green"}>{item.chg}</td>
                                        <td className={item.priceChange >= 0 ? "price-change" : "price-change green"}>{item.priceChange}</td>
                                        <td>{item.open}</td>
                                        <td>{item.high}</td>
                                        <td>{item.low}</td>
                                        <td>{item.bid}/{item.ask}</td>
                                    </tr>
                                )
                            })}


                        </tbody>
                    </table> :
                    <ChartList {...this.state} />
                }
                <div className="pagination-wrapper">
                    <Pagination defaultCurrent={1} total={totalRow} pageSize={8} onChange={this.onChangePage.bind(this)} />
                </div>

            </div>
        )
    }
}