import React, { Component } from 'react'
import BaseRates from './BasicRates'

import { Tabs, Pagination } from 'antd';

const { TabPane } = Tabs;

interface IState {
    totalRow: number;
}

export default class RatePannel extends Component {
    state: IState = {
        totalRow: 1,

    }
    onChangeTab(e: any) {
        console.log(e)
    }
    onChangePage() {

    }
    render() {
        const { totalRow } = this.state
        return (
            <div className="tab-pane">
                <Tabs onChange={this.onChangeTab} type="card">
                    <TabPane tab="Basic rates" key="1">
                        <BaseRates />
                    </TabPane>
                    <TabPane tab="Cross rates" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="All exchange rates" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
                <div className="pagination-wrapper">
                    <Pagination defaultCurrent={1} total={totalRow} onChange={this.onChangePage.bind(this)} />
                </div>
            </div>
        )
    }
}