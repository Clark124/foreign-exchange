import React, { Component } from 'react'
import Chart from '../../../Components/Chart/index'

interface IState {
    dataList: Array<object>
}
interface IProps {
    stockDate: Array<object>;
}

export default class ChartList extends Component<IProps>{
    state: IState = {
        dataList: []
    }
    UNSAFE_componentWillMount() {

    }

    render() {
        const { stockDate } = this.props
        return (
            <div className="chart-list">
                <div className="chart-item">
                    <div className="chart-item-head">
                        <span className="name">EURUSD</span>
                        <span className="value">50260</span>
                        <span className="rate green">0.2%</span>
                        <span className="btn replace">replace</span>
                    </div>
                    {stockDate.length > 0 ?
                        <Chart
                            data={stockDate}
                            period={1}
                            type="hybrid"
                            width={383}
                            height={228}
                        />
                        : null}
                </div>
                <div className="chart-item">
                    <div className="chart-item-head">
                        <span className="name">EURUSD</span>
                        <span className="value">50260</span>
                        <span className="rate green">0.2%</span>
                        <span className="btn replace">replace</span>
                    </div>
                    {stockDate.length > 0 ?
                        <Chart
                            data={stockDate}
                            period={1}
                            type="hybrid"
                            width={383}
                            height={228}
                        />
                        : null}
                </div>
                <div className="chart-item">
                    <div className="chart-item-head">
                        <span className="name">EURUSD</span>
                        <span className="value">50260</span>
                        <span className="rate green">0.2%</span>
                        <span className="btn replace">replace</span>
                    </div>
                    {stockDate.length > 0 ?
                        <Chart
                            data={stockDate}
                            period={1}
                            type="hybrid"
                            width={383}
                            height={228}
                        />
                        : null}
                </div>
                <div className="chart-item">
                    <div className="chart-item-head">
                        <span className="name">EURUSD</span>
                        <span className="value">50260</span>
                        <span className="rate green">0.2%</span>
                        <span className="btn replace">replace</span>
                    </div>
                    {stockDate.length > 0 ?
                        <Chart
                            data={stockDate}
                            period={1}
                            type="hybrid"
                            width={383}
                            height={228}
                        />
                        : null}
                </div>
            </div>
        )
    }
}