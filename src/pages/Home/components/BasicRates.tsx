import React, { Component } from 'react'

export default class BasicRates extends Component {
    render() {
        return (
            <div className="table-wrapper">
                <table className="table">
                    <tbody>
                        <tr className="table-header">
                            <td>Currency/code</td>
                            <td>Latest price</td>
                            <td>CHG</td>
                            <td>Price change</td>
                            <td>Open</td>
                            <td>HIGH</td>
                            <td>LOW</td>
                            <td>Bid/ Ask</td>
                        </tr>
                        <tr className="table-item">
                            <td className="name">
                                <div>欧元美元</div>
                                <div>EURUSD</div>
                            </td>
                            <td className="lastest-price">1.1558</td>
                            <td className="chg">0.34</td>
                            <td className="price-change">0.0041</td>
                            <td>1.532</td>
                            <td>1.1571</td>
                            <td>1.1529</td>
                            <td>1.1559/1.1563</td>
                        </tr>
                        <tr className="table-item">
                            <td className="name">
                                <div>欧元美元</div>
                                <div>EURUSD</div>
                            </td>
                            <td className="lastest-price">1.1558</td>
                            <td className="chg green">0.34</td>
                            <td className="price-change green">0.0041</td>
                            <td>1.532</td>
                            <td>1.1571</td>
                            <td>1.1529</td>
                            <td>1.1559/1.1563</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}