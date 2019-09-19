import React,{Component} from 'react'
import {Spin} from 'antd'
import './index.less'
export default class Loading extends Component {
    render(){
        const text = this.props.text
        return (
            <div className="loading-wrapper">
                <Spin tip={text?text:"Loading..."}/>
            </div>
        )
    }
}