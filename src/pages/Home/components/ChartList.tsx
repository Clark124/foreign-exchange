import React, { Component } from 'react'
import Chart from '../../../Components/Chart/index'
import { Pagination } from 'antd';
import { changeNumber } from '../../../utils/utils'
import {  getCountKline } from '../../../service/serivce'

import Loading from '../../../Components/Loading/index'

interface IState {
    status: string;
    currentData: List[],
    page: number
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
    kline: any
}
interface IProps {
    stockDate: KLineDataList,
    dataList: List[],
}

export default class ChartList extends Component<IProps, IState>{
    // constructor(props: IProps) {
    //     super(props)
    // }
    state: IState = {
        status: "",
        page: 1,
        currentData: []

    }
    UNSAFE_componentWillMount() {
        let arr = this.props.dataList.slice(0, 4)
        let currentData = arr.map(item => {
            item.kline = []
            return item
        })
        this.setState({ currentData })
        this.getKlineDataList(1)
    }

    getKlineDataList(page: number) {
        let arr = this.props.dataList.slice((page - 1) * 4, (page - 1) * 4 + 4)
        this.setState({status:"loading"})
        arr.forEach(async (item, index) => {
            let value = await this.onGetKline(item.code, 1, 240)
            arr[index].kline = value
            this.setState({ currentData: arr })
            if(index===(arr.length-1)){
                this.setState({status:"success"})
            }
        })
    }

    //K线图数据
    onGetKline(prod_code: string, period: number, count: number) {
        return new Promise((resolve, reject) => {
            getCountKline({ prod_code, period, count }).then(res => {
                let data = res.data.candle[prod_code]
                data = changeNumber(data, 2)
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })

    }

    //切换页码
    changePage(page: number) {
        console.log(page)
        this.setState({ page })
        this.getKlineDataList(page)
    }


    render() {
        const { dataList } = this.props
        const { currentData, page, status } = this.state

        return (
            <div className="chart-list-wrapper">
                {status === 'loading' ? <Loading /> : null}
                <div className="chart-list">
                    {currentData.map((item, index) => {
                        return (
                            <div className="chart-item" key={index}>
                                <div className="chart-item-head">
                                    <span className="name">{item.code}</span>
                                    <span className="value">{item.latestPrice}</span>
                                    <span className="rate green">{item.priceChange}%</span>
                                    {/* <span className="btn replace">replace</span> */}
                                </div>
                                {item.kline && item.kline.length > 0 ?
                                    <Chart
                                        data={item.kline}
                                        period={1}
                                        type="hybrid"
                                        width={580}
                                        height={350}
                                    />
                                    : null}
                            </div>
                        )
                    })}
                </div>

                <div className="pagination-wrapper">
                    <Pagination pageSize={4} total={dataList.length} onChange={this.changePage.bind(this)} current={page} />
                </div>

            </div>
        )
    }
}