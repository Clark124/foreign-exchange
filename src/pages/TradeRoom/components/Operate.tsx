import React, { Component } from 'react'

import ModuleTrade from './ModuleTrade/ModuleTrade'

class Operate extends Component {

    render() {
        return (
            <div className="operate-wrapper">
                <div className="tab-list">
                    <span className="tab-item btn active">Trade</span>
                    <span className="tab-item btn">Strategy</span>
                </div>
                <ModuleTrade />
            </div>
        )
    }
}

export default Operate