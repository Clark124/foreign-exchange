import React, { Component } from 'react'
import './index.less'
import tab_img_1 from './images/timing1.png'
import tab_img_2 from './images/timing2.png'
import tab_img_3 from './images/timing3.png'

import { indicateList,createStrategyCode,saveCreateStrategy } from '../../../../service/serivce'



import { Modal ,message} from 'antd'
import Enter from './components/Enter'
import Outer from './components/Outer'
import Risk from './components/Risk'
import Loading from '../../../../Components/Loading/index'

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}


export default class Build extends Component {
    state = {
        status: "",
        tabIndex: 0,
        indicateList: [],
        visibleCode:false,
        express: "", //查看源码
    }
    UNSAFE_componentWillMount() {
        this.getIndicateList()
    }

    changeTab(index) {
        this.setState({ tabIndex: index })
    }
    getIndicateList() {
        const token = getToken()
        indicateList({}, token).then((res) => {
            let datas = res
            let dataList = datas.map((item) => {
                item.value1 = ""
                item.value2 = ""
                item.parameter = JSON.parse(item.parameter)
                item.visible = false
                return item
            })
            this.setState({ indicateList: dataList })
        })
    }

    changeStep(index) {
        this.setState({ tabIndex: index })
    }
     //创建源码
     lookCode(risk) {
        let enterList = this.refs.enter.state.selectListLong
        
        let outList = this.refs.outer.state.selectList
        const verificateRes = this.verificate(enterList, outList)
        if (!verificateRes) {
            return
        }

        let technical_buy = []
        let technical_sell = []
        enterList.forEach(item => {
            let obj = {}
            obj.condition_sys_id = item.id
            obj.express = item.express
            obj.operator = item.operator
            obj.parameter = item.parameter
            obj.mark = 1
            if (item.operator === '>' || '<') {
                obj.comparand = item.comparand
            } else {
                obj.comparand = item.value1 + '~' + item.value2
            }
            technical_buy.push(obj)
        })

        outList.forEach(item => {
            let obj = {}
            obj.condition_sys_id = item.id
            obj.express = item.express
            obj.operator = item.operator
            obj.parameter = item.parameter
            obj.mark = 3
            if (item.operator === '>' || '<') {
                obj.comparand = item.comparand
            } else {
                obj.comparand = item.value1 + '~' + item.value2
            }
            technical_sell.push(obj)
        })

        let data = {
            technical_buy: JSON.stringify(technical_buy),
            technical_sell: JSON.stringify(technical_sell),
            param:JSON.stringify(risk),
        }
        
        this.setState({ status: 'loading' })
        const token = getToken()
        createStrategyCode(data,token).then(res => {
            this.setState({ status: 'success' })
            if (res.data) {
                this.setState({ visibleCode: true, express: res.data })
            } else {
                Modal.error({
                    title: "提示",
                    content: "编译失败，请检查选择的技术指标"
                })
            }
        }).catch(err => {
            this.setState({ status: 'success' })
            console.log(err)
        })

    }
     //保存策略
     saveStrategy(risk) {
        let enterList = this.refs.enter.state.selectListLong
        let outList = this.refs.outer.state.selectList
        const verificateRes = this.verificate(enterList, outList)
        if (!verificateRes) {
            return
        }
        let technical_buy = []
        let technical_sell = []
        enterList.forEach(item => {
            let obj = {}
            obj.condition_sys_id = item.id
            obj.express = item.express
            obj.operator = item.operator
            obj.parameter = item.parameter
            obj.mark = 1
            if (item.operator === '>' || '<') {
                obj.comparand = item.comparand
            } else {
                obj.comparand = item.value1 + '~' + item.value2
            }
            technical_buy.push(obj)
        })

        outList.forEach(item => {
            let obj = {}
            obj.condition_sys_id = item.id
            obj.express = item.express
            obj.operator = item.operator
            obj.parameter = item.parameter
            obj.mark = 3
            if (item.operator === '>' || '<') {
                obj.comparand = item.comparand
            } else {
                obj.comparand = item.value1 + '~' + item.value2
            }
            technical_sell.push(obj)
        })
        const token = getToken()
    
        let data = {
            description:risk.description,
            name:risk.strategy_name,
            param: JSON.stringify(risk),
            strategyParams:JSON.stringify(risk),
            technical_buy: JSON.stringify(technical_buy),
            technical_sell: JSON.stringify(technical_sell),
            strategy_id: 0,
        }
     
        this.setState({ status: 'loading' })
        saveCreateStrategy(data,token).then(res=>{
            if(res.success){
                message.success("save success")
                this.setState({ status: 'success' })
                setTimeout(()=>{
                    this.props.history.push('/aiTrade/list')
                },1000)
            }else{
                Modal.error({
                    title: "tips",
                    content: "save fail"
                })
            }
        }).catch(err=>{
            this.setState({ status: 'success' })
        })

    }

    //验证输入的信息
    verificate(enterList, outList) {
        let isInputRight = true
        if (enterList.length === 0) {
            Modal.error({
                title: "提示",
                content: "请选择入市规则"
            })
            isInputRight = false
            return
        }

        if (outList.length === 0) {
            Modal.error({
                title: "提示",
                content: "请选择平仓规则"
            })
            isInputRight = false
            return
        }

        enterList.forEach(item => {
            if (item.operator === ">" || item.operator === "<") {
                if (item.comparand === "") {
                    Modal.error({
                        title: "提示",
                        content: "技术面条件的值不能为空"
                    })
                    isInputRight = false
                    return
                }
            } else if (item.operator === "~") {
                if (item.value1 === "" || item.value1 === "") {
                    Modal.error({
                        title: "提示",
                        content: "技术面条件的值不能为空"
                    })
                    isInputRight = false
                    return
                }
                if (item.value1 >= item.value2) {
                    Modal.error({
                        title: "提示",
                        content: "技术面条件值的范围有误"
                    })
                    isInputRight = false
                    return
                }
            }
        })
        outList.forEach(item => {
            if (item.operator === ">" || item.operator === "<") {
                if (item.comparand === "") {
                    Modal.error({
                        title: "提示",
                        content: "技术面条件的值不能为空"
                    })
                    isInputRight = false
                    return
                }
            } else if (item.operator === "~") {
                if (item.value1 === "" || item.value1 === "") {
                    Modal.error({
                        title: "提示",
                        content: "技术面条件的值不能为空"
                    })
                    isInputRight = false
                    return
                }
                if (item.value1 >= item.value2) {
                    Modal.error({
                        title: "提示",
                        content: "技术面条件值的范围有误"
                    })
                    isInputRight = false
                    return
                }
            }
        })

        return isInputRight
    }

    render() {
        const { tabIndex,status } = this.state
        return (
            <div className="build-wrapper">
                <div className="container">
                    <div className="header-link">
                        <span className="btn">Ai-Trade</span>
                        <span className="arrow">></span>
                        <span className="btn title">Build Strategy</span>
                    </div>
                    <div className="head-tab-wrapper">
                        {tabIndex === 0 ? <img src={tab_img_1} alt="" className="tab-img" /> : null}
                        {tabIndex === 1 ? <img src={tab_img_2} alt="" className="tab-img" /> : null}
                        {tabIndex === 2 ? <img src={tab_img_3} alt="" className="tab-img" /> : null}
                        <div className="tab-btn">
                            <div className={tabIndex === 0 ? "btn active" : "btn"} onClick={this.changeTab.bind(this, 0)}>1.Entry Conditions</div>
                            <div className={tabIndex === 1 ? "btn active" : "btn"} onClick={this.changeTab.bind(this, 1)}>2.Exit Conditions</div>
                            <div className={tabIndex === 2 ? "btn active" : "btn"} onClick={this.changeTab.bind(this, 2)}>3.Risk Management</div>
                        </div>
                    </div>
                    <Enter {...this.state} changeStep={this.changeStep.bind(this)} ref="enter" />
                    <Outer {...this.state} changeStep={this.changeStep.bind(this)} ref="outer" />
                    <Risk {...this.state} changeStep={this.changeStep.bind(this)} lookCode={this.lookCode.bind(this)} saveStrategy={this.saveStrategy.bind(this)} />
                    <Modal
                        title="Look Code"
                        visible={this.state.visibleCode}
                        width={600}
                        // height={400}
                        footer={null}
                        onCancel={() => this.setState({ visibleCode: false })}
                    >
                        <div className="code-wrapper">
                            <textarea value={this.state.express} onChange={() => { }} />
                        </div>

                    </Modal>
                    {status === 'loading' ? <Loading  /> : null}
                </div>
            </div>
        )
    }
}