import React, { Component } from 'react'
import { Modal, message } from 'antd'
import { deleteDeploy ,suspendDeploy} from '../../../../../service/serivce'

export default class Deploy extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
        }
    }
    //删除策略
    deleteStrategy(item, index) {
        Modal.confirm({
            title: '提示',
            content: "确定要删除这条记录吗？",
            okText: "确定",
            onOk: () => {
                const token = localStorage.getItem('token')
                deleteDeploy({ token, id: item.id }).then(res => {
                    if (res.message==='success') {
                        message.success('删除成功~')
                        this.props.refresh()
                    } else {
                        message.error('删除失败~')
                    }
                })
            }


        })
    }
    //暂停策略
    onSuspendDeploy(item, index){
        suspendDeploy({id:item.id}).then(res=>{
            console.log(res)
            console.log(this.props.dataList[index].status)
            this.props.suspendDeploy(index)
        })
    }
    render() {
        let { dataList,tabIndex } = this.props
        if(parseInt(tabIndex)!==3){
            dataList = []
        }
        return (
            <div className="list-wrapper">
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header">
                            <td>策略名称</td>
                            <td>交易标的</td>
                            <td>频率</td>
                            <td>开始时间</td>
                            <td>收益率</td>
                            <td>运行状态</td>
                            <td className="operate">操作</td>
                        </tr>
                        {dataList.map((item, index) => {
                            return (
                                <tr className="table-item" key={index}>
                                    <td className="item-name click" onClick={()=>this.props.history.push(`/strategy/detail/${item.id}`)}>{item.strategy_name}</td>
                                    <td className="click" onClick={()=> this.props.history.push('/traderoom?code='+item.code)}>{item.name}</td>
                                    <td>1日</td>
                                    <td>{item.time_start}</td>
                                    <td className={item.return_ratio>=0?"profit":"profit green"}>{(item.return_ratio*100).toFixed(2)}%</td>
                                    <td className={item.status==='1'?'status':"status green"}>{item.status ==='1'? "已开启" : "已暂停"}</td>
                                    <td className="operate">
                                        {item.status==='1' ?
                                            <span className="btn" onClick={this.onSuspendDeploy.bind(this,item,index)} >暂停</span> :
                                            <span className="btn" onClick={this.onSuspendDeploy.bind(this,item,index)}>开启</span>}
                                        <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>删除</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {dataList.length === 0 ? <div className="no-data">暂无数据</div> : null}


            </div>
        )
    }
}