import React, { Component } from 'react'
import { Select } from 'antd'

import Trade from './components/Trade'

const { Option } = Select;


interface IState {
    tabIndex: number;
    tabList: string[];
}

interface props {
    quote:Quote;
    code:string;
}

type Iprops = props

class ModuleTrade extends Component<Iprops> {
    state: IState = {
        tabIndex: 0,
        tabList: ['Trade', 'Cancel', 'Hold Position', 'Order History']
    }
    UNSAFE_componentWillMount(){
    }
    changeAccount() {

    }
    changeTab(index: number) {
        this.setState({ tabIndex: index })
    }
    render() {
        const { tabIndex, tabList } = this.state
        const {quote,code} = this.props
        return (
            <div className="module-trade">
                <div className="account">
                    <span>Account:</span>
                    <Select defaultValue="HITBTC" style={{ width: 150, marginLeft: 10 }} onChange={this.changeAccount.bind(this)}>
                        <Option value="HITBTC">HITBTC</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <span className="add-account btn">+ Add</span>
                </div>
                <div className="trade-select">
                    <div className="trade-tab">
                        {tabList.map((item, index) => {
                            return (
                                <div className={tabIndex === index ? "trade-tab-item btn active" : "trade-tab-item btn"} key={index}
                                    onClick={this.changeTab.bind(this, index)}
                                >{item}</div>
                            )
                        })}
                    </div>
                    <Trade quote={quote} code={code}/>
                </div>
            </div>
        )
    }
}

export default ModuleTrade