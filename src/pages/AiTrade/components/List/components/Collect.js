import React, { Component } from 'react'
import { Modal, message } from 'antd'
import { deleteCollect ,collectFollow} from '../../../../../service/serivce'

export default class Collect extends Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            followItem: {},
            followCount:1
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
                deleteCollect({ token, collect_id: item.id, type: 'strategy' }).then(res => {
                    if (res.success) {
                        message.success('删除成功~')
                        this.props.refresh()
                    } else {
                        message.error('删除失败~')
                    }
                })
            }
        })
    }

    //跟单
    onFollow(item, index) {
        let { dataList } = this.props
        this.setState({ followItem: dataList[index], visible: true })
    }
    followOk() {
        const {followItem,followCount} = this.state
        const token = localStorage.getItem('token')
        let userInfo = JSON.parse(localStorage.getItem("userInfo"))
        const body = {
            release_id:followItem.id,
            link:'/quant/strategy/list?upBtn1=follow',
            message:`${userInfo.nickname}订购了你的策略`,
            type:'follow'
        }
        const data = {
            token,
            body:JSON.stringify(body),
            unit_count:followCount,
            subject:`跟单${followCount}个月`
        }
        console.log(data)
        collectFollow(data).then(res=>{
            console.log(res)
            if(res.data==='success'){
                this.setState({visible:false})
                this.props.followSuccess()
                message.success('跟单成功！')
            }   
           
        })
      

    }
    reduceFollowCount(){
        const {followCount} = this.state
        if(followCount<=1){
            return
        }
        this.setState({followCount:this.state.followCount-1})
    }
    addFollowCount(){
        this.setState({followCount:this.state.followCount+1})
    }
    render() {
        let { dataList, tabIndex } = this.props
        if (parseInt(tabIndex) !== 5) {
            dataList = []
        }
        const { visible, followItem ,followCount} = this.state
        return (
            <div className="list-wrapper">
                <table className="table" cellPadding="0" cellSpacing="0">
                    <tbody className="t-body">
                        <tr className="table-header">
                            <td>策略名称</td>
                            <td>创建人</td>
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
                                    <td className="item-name click" onClick={()=>this.props.history.push(`/strategy/detail/${item.id}`)}>
                                        <div className="item-names">{item.name.slice(0, -16)}</div>
                                    </td>
                                    <td >{item.nickname}</td>
                                    <td className="click" onClick={()=> this.props.history.push('/traderoom?code='+item.code)}>{item.stock_name}</td>
                                    <td>1日</td>
                                    <td>{item.time_start}</td>
                                    <td className={item.return_ratio >= 0 ? "profit" : "profit green"}>{(item.return_ratio * 100).toFixed(2)}%</td>
                                    <td className={item.status === '1' ? 'status' : "status green"}>{item.status === '1' ? "已开启" : "已暂停"}</td>
                                    <td className="operate">
                                        <span className="btn" onClick={this.onFollow.bind(this, item, index)}>跟单</span>
                                        <span className="btn delete" onClick={this.deleteStrategy.bind(this, item, index)}>删除</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <Modal
                    title="跟单"
                    visible={visible}
                    onOk={this.followOk.bind(this)}
                    onCancel={() => this.setState({ visible: false })}
                    width={400}
                >
                    <div className="follow-model">
                        <div>策略名称：{followItem.name ? followItem.name.slice(0, -11) : ""}</div>
                        <div className="choose-count">
                            <span>选择数量：</span>
                            <span className="btn" onClick={this.reduceFollowCount.bind(this)}>-</span>
                            <span className="count">{followCount}</span>
                            <span className="btn" onClick={this.addFollowCount.bind(this)}>+</span>
                            <span className="text">个月</span>
                        </div>
                    </div>

                </Modal>
                {dataList.length === 0 ? <div className="no-data">暂无数据</div> : null}


            </div>
        )
    }
}