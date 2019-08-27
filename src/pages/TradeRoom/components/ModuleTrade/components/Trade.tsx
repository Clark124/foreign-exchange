import React, { Component } from 'react'

interface priceItem {
    name: string;
    price: number;
    number: number;
}

interface IState {
    buyList: priceItem[];
    sellList: priceItem[];
}

export default class Trade extends Component {
    state: IState = {
        buyList: [],
        sellList: [],
    }
    render() {
        return (
            <div className="content">
                <div className="buy-list">
                    <div className="buy-item">
                        <span className="name">ASK5</span>
                        <span className="price">0.015967</span>
                        <span className="number">24976</span>
                    </div>
                    <div className="buy-item">
                        <span className="name">ASK5</span>
                        <span className="price">0.015967</span>
                        <span className="number">24976</span>
                    </div>
                </div>
                <div className="lost-price">
                    <div className="lost">
                        <span>LostPrice: </span>
                        <span className="price">0.015929</span>
                    </div>
                    <div className="change">
                        <span>Change: </span>
                        <span className="price">+0.02%</span>
                    </div>
                </div>
                <div className="sell-list">
                    <div className="sell-item">
                        <span className="name">ASK5</span>
                        <span className="price">0.015967</span>
                        <span className="number">24976</span>
                    </div>
                    <div className="sell-item">
                        <span className="name">ASK5</span>
                        <span className="price">0.015967</span>
                        <span className="number">24976</span>
                    </div>
                </div>

            </div>
        )
    }
}