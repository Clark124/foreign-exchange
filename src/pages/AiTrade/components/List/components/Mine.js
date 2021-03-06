import React, { Component } from 'react'
import {Modal,message} from 'antd'
import {deleteStrategy} from '../../../../../service/serivce'

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}

export default class Mine extends Component {
    constructor() {
        super()
        this.state = {
            visible:false,
        }
    }
    //删除策略
    deleteStrategy(item, index) {
       
        Modal.confirm({
            title:'提示',
            content:"确定要删除这条记录吗？",
            okText:"确定",
            onOk:()=>{
                const token = getToken()
                deleteStrategy({id:item.id},token).then(res=>{
                    if(res.success){
                        message.success('delete success')
                        this.props.refresh()
                    }else{
                        message.success('delete fail')
                    }
                })
            }

            
        })
    }
    render() {
        let { dataList ,tabIndex} = this.props
        if (parseInt(tabIndex) !== 1) {
            dataList = []
        }
        return (
            <div className="list-wrapper">
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header">
                            <td>Name</td>
                            <td>type</td>
                            <td>Backtest Times</td>
                            <td>Start Date</td>
                            <td className="operate">Action</td>
                        </tr>
                        {dataList.map((item, index) => {
                            return (
                                <tr className="table-item" key={index}>
                                    <td className="item-name click" onClick={()=>this.props.history.push(`/aiTrade/intelli/${item.id}`)}>{item.name}</td>
                                    <td className="click" onClick={()=>this.props.history.push(`/aiTrade/intelli/${item.id}`)}>{item.type === "building" ? "building" : "writting"}</td>
                                    <td className="" >{item.times}</td>
                                    <td>{item.update_date.slice(0,10)}</td>
                                    <td className="operate">
                                        <span className="btn" onClick={() => this.props.history.push(`/aiTrade/intelli/${item.id}`)} >Backtest</span>
                                        <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>Delete</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {dataList.length === 0 ? <div className="no-data">No Data</div> : null}

        
            </div>
        )
    }
}