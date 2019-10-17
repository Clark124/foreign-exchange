import React, { Component } from 'react'
import { Radio, Table } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio';
// import {ColumnProps} from 'antd/lib/table'
import ChartList from './ChartList'
import { getKline, homeList, quoteReal, optionalList } from '../../../service/serivce'
import { RouteComponentProps } from 'react-router-dom'
import { changeNumber } from '../../../utils/utils'
// import { Pagination } from 'antd';


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
    dataList: List[],
    optionalList: optionItem[];
}


interface Props {
    optionalList?: optionItem[];
    isOptional?:boolean;
}

type IProps = RouteComponentProps & Props

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}


export default class ListGraphical extends Component<IProps, IState> {
    columns: ({ title: string; dataIndex: string; align: string; render: (text: any, value: List) => JSX.Element; } | { title: string; dataIndex: string; align: string; render: (text: number) => JSX.Element; } | {})[];

    constructor(props: IProps) {
        super(props)
        this.columns = [
            {
                title: 'Currency/Code',
                dataIndex: 'currency',
                align: "center",
                render: (text: any, value: List) => (
                    <div className="currency" onClick={() => {
                        this.props.history.push('/tradeRoom/' + value.code)
                    }}>
                        <div className="name">{text}</div>
                        <div className="code">{value.code}</div>
                    </div>
                )
            },
            {
                title: 'Latest Price',
                dataIndex: 'latestPrice',
                align: "center",
                render: (text: number) => (
                    <span className="lastest-price">{text}</span>
                )
            },
            {
                title: 'CHG',
                dataIndex: 'chg',
                align: "center",
                render: (text: number) => (
                    <span className={text >= 0 ? 'chg' : 'chg green'}>{text}</span>
                )

            },
            {
                title: 'Pirce Change',
                dataIndex: 'priceChange',
                align: "center",
                render: (text: number) => (
                    <span className={text >= 0 ? 'price-change' : 'price-change green'}>{text}</span>
                )
            },
            {
                title: 'Open',
                dataIndex: 'open',
                align: "center",
            },
            {
                title: 'HIGH',
                dataIndex: 'high',
                align: "center",
            },
            {
                title: 'LOW',
                dataIndex: 'low',
                align: "center",
            },
            {
                title: 'Bid/Ask',
                dataIndex: 'bid',
                align: "center",
                render: (text: any, value: any) => (
                    <span>
                        {value.bid}/{value.ask}
                    </span>
                )
            },
        ];
    }
    state = {
        selectIndex: 0,
        stockDate: [],
        totalRow: 1,
        dataList: [],
        optionalList: []
    }
    //切换列表、图形
    ChangeViewMode(e: RadioChangeEvent) {
        this.setState({ selectIndex: e.target.value })
    }

    UNSAFE_componentWillMount() {
        if(this.props.isOptional){
            this.getOptionalList()
        }else{
            this.getHomeList()
        }
      
    }
    //自选列表
    getOptionalList() {
        const token = getToken()
        if (token) {
            optionalList({}, token).then(res => {
                if (res.data.LWORK) {
                    let code = ""
                    res.data.LWORK.forEach((value: { symbol: string; }) => {
                        code = code + value.symbol + ','
                    })
                    quoteReal({ code }).then((res: any) => {
                        let arr = []
                        arr = res.map((item: any) => {
                            return {
                                currency: item.prod_name,
                                code: item.prod_code,
                                latestPrice: item.last_px,
                                chg: item.px_change,
                                priceChange: item.px_change_rate,
                                open: item.open_px,
                                high: item.high_px,
                                low: item.last_px,
                                bid: item.bid_grp.split(',')[0],
                                ask: item.offer_grp.split(',')[0],
                            }
                        })
                        this.setState({ dataList: arr })
                    })

                } else {
                    this.setState({ optionalList: [] })
                }

            })
        }

    }



    //首页列表
    getHomeList() {
        homeList().then(res => {
            let code = ""
            res.data.forEach((value: { prod_code: string; }) => {
                code = code + value.prod_code + ','
            })
            quoteReal({ code }).then((res: any) => {
                let arr = []
                arr = res.map((item: any) => {
                    return {
                        currency: item.prod_name,
                        code: item.prod_code,
                        latestPrice: item.last_px,
                        chg: item.px_change,
                        priceChange: item.px_change_rate,
                        open: item.open_px,
                        high: item.high_px,
                        low: item.last_px,
                        bid: item.bid_grp.split(',')[0],
                        ask: item.offer_grp.split(',')[0],
                    }
                })
                this.setState({ dataList: arr })
            })


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

    render() {
        const { selectIndex, dataList } = this.state
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
                    <Table dataSource={dataList} columns={this.columns} rowKey="currency" />
                    :
                    <ChartList {...this.state} />
                }
            </div>
        )
    }
}