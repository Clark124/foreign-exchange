import React, { Component } from 'react'
import './index.scss'
import tab_img_1 from './images/timing1.png'
import tab_img_2 from './images/timing2.png'
import tab_img_3 from './images/timing3.png'

import Enter from './components/Enter'
import Outer from './components/Outer'
import Risk from './components/Risk'

import { Modal ,message} from 'antd'
import Loading from '../../../components/Loading/index'

import { indicateList, createStrategyCode ,saveCreateStrategy} from '../../../serivce'

export default class Create extends Component {
    constructor() {
        super()
        this.state = {
            status: "",
            tabIndex: 0,
            indicateList: [], //指标列表
            visibleCode: false, //显示查看源码
            express: {}, //查看源码

        }
    }
    componentWillMount() {
        this.getIndicateList()
    }
    getIndicateList() {
        const token = localStorage.getItem('token')
        indicateList({ token, type: 'technical' }).then(res => {
            let datas = res.data
            datas = datas.map((item) => {
                item.value1 = ""
                item.value2 = ""
                item.parameter = JSON.parse(item.parameter)
                item.visible = false
                return item
            })
            this.setState({ indicateList: datas })
        })
    }
    changeTab(index) {
        this.setState({ tabIndex: index })
    }
    changeStep(index) {
        this.setState({ tabIndex: index })
    }

    //创建源码
    lookCode(risk) {
        let enterList = this.refs.enter.state.selectList
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
        }
        data = { ...risk, ...data }
        this.setState({ status: 'loading' })
        createStrategyCode(data).then(res => {
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
        let enterList = this.refs.enter.state.selectList
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
        const token = localStorage.getItem('token')
        const param = [{ "name": "initCaptital", "type": "float", "def_value": "100000", "min_value": "", "max_value": "", "description": "初始资金" }]
        let data = {
            token,
            strategy_id: 0,
            param: JSON.stringify(param),
            technical_buy: JSON.stringify(technical_buy),
            technical_sell: JSON.stringify(technical_sell),
        }
        data = { ...risk, ...data }
        this.setState({ status: 'loading' })
        saveCreateStrategy(data).then(res=>{
            if(res.success){
                message.success("保存成功")
                this.setState({ status: 'success' })
                setTimeout(()=>{
                    this.props.history.push('/strategy/list')
                },1000)
            }else{
                Modal.error({
                    title: "提示",
                    content: "保存失败"
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
        const { tabIndex, status } = this.state
        return (
            <div className="create-strategy-wrapper">
                <div className="nav-title">
                    <span onClick={()=>this.props.history.push('/strategy/rank')}>策略</span>
                    <span>></span>
                    <span onClick={()=>this.props.history.push('/strategy/list')}>我的策略</span>
                    <span>></span>
                    <span className="current">搭建策略</span>
                </div>
                <div className="head-tab-wrapper">
                    {tabIndex === 0 ? <img src={tab_img_1} alt="" /> : null}
                    {tabIndex === 1 ? <img src={tab_img_2} alt="" /> : null}
                    {tabIndex === 2 ? <img src={tab_img_3} alt="" /> : null}
                    <div className="tab-btn">
                        <div className={tabIndex === 0 ? "btn active" : "btn"} onClick={this.changeTab.bind(this, 0)}>入市规则</div>
                        <div className={tabIndex === 1 ? "btn active" : "btn"} onClick={this.changeTab.bind(this, 1)}>平仓规则</div>
                        <div className={tabIndex === 2 ? "btn active" : "btn"} onClick={this.changeTab.bind(this, 2)}>风险管理</div>
                    </div>
                </div>

                <Enter {...this.state} changeStep={this.changeStep.bind(this)} ref="enter" />
                <Outer {...this.state} changeStep={this.changeStep.bind(this)} ref="outer" />
                <Risk {...this.state} changeStep={this.changeStep.bind(this)} lookCode={this.lookCode.bind(this)} saveStrategy={this.saveStrategy.bind(this)} />
                <Modal
                    title="查看源码"
                    visible={this.state.visibleCode}
                    width={600}
                    height={400}
                    footer={null}
                    onCancel={() => this.setState({ visibleCode: false })}
                >
                    <div className="code-wrapper">
                        <textarea value={this.state.express} onChange={() => { }} />
                    </div>

                </Modal>
                {status === 'loading' ? <Loading text="加载中..." /> : null}
            </div>
        )
    }
}