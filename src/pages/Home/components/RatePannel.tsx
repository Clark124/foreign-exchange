import React, { Component } from 'react'
import ListGraphical from './ListGraphical'
import { RouteComponentProps } from 'react-router';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

interface IState {
   
}


class RatePannel extends Component<RouteComponentProps> {
   
    state: IState = {
    
    }
   
    onChangeTab(e: any) {
        console.log(e)
    }
   
    render() {
        return (
            <div className="tab-pane">
                <Tabs onChange={this.onChangeTab} type="card">
                    <TabPane tab="Forex" key="1">
                        <ListGraphical {...this.props}/> 
                    </TabPane>
                
                    <TabPane tab="Optional" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
               
            </div>
        )
    }
}

export default RatePannel