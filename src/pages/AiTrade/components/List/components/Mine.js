import React, { Component } from 'react'
import {Modal,message} from 'antd'
import {deleteStrategy} from '../../../../../service/serivce'

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
                const token = localStorage.getItem('token')
                deleteStrategy({token,id:item.id}).then(res=>{
                    console.log(res)
                    if(res.success){
                        message.success('删除成功~')
                        this.props.refresh()
                    }else{
                        message.success('删除失败~')
                    }
                })
            }

            
        })
    }
    render() {
        const { dataList } = this.props
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
                                    <td className="click" onClick={()=>this.props.history.push(`/aiTrade/intelli/${item.id}`)}>{item.type === "build" ? "build" : "wtrtting"}</td>
                                    <td className="click" >{item.times}</td>
                                    <td>{item.update_date}</td>
                                    <td className="operate">
                                        <span className="btn" onClick={() => this.props.history.push(`/strategy/backtest/${item.id}`)} >Backtest</span>
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