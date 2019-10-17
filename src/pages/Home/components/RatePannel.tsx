import React, { Component } from 'react'
import ListGraphical from './ListGraphical'
import { RouteComponentProps } from 'react-router';

import { Tabs, message } from 'antd';
const { TabPane } = Tabs;

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}

interface IState {

}

interface Props {
    optionalList: optionItem[]
}

type IProps = RouteComponentProps & Props


class RatePannel extends Component<IProps> {

    state: IState = {

    }

    onChangeTab(e: any) {
        const token = getToken()
        if (!token && e === '2') {
            message.info('please login first')
        }
    }

    render() {
        return (
            <div className="tab-pane">
                <Tabs onChange={this.onChangeTab} type="card">
                    <TabPane tab="Forex" key="1">
                        <ListGraphical {...this.props} />
                    </TabPane>

                    <TabPane tab="Optional" key="2">
                        <ListGraphical {...this.props} isOptional={true} />
                    </TabPane>
                </Tabs>

            </div>
        )
    }
}

export default RatePannel