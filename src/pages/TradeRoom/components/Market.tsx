import React,{Component} from 'react'

export default class Market extends Component {
    render(){
        return (
            <div className="market-wrapper">
                <div className="title">
                    Market
                </div>
                <div className="select-wrapper">
                    <div className="left">
                        <div className="item optional btn">Optional</div>
                        <div className="item btn">Garsem</div>
                        <div className="item btn active">XM</div>
                        <div className="item btn"></div>
                        <div className="item btn"></div>
                    </div>
                    <div className="right">
                        <input type="text" placeholder="filter..." className="filter"/>
                        <div className="item btn">BEURUSD</div>
                        <div className="item btn active">AUDUSD</div>
                        <div className="item btn">USDKRW</div>
                        <div className="item btn">USDHKD</div>
                    </div>
                </div>
            </div>
        )
    }
}