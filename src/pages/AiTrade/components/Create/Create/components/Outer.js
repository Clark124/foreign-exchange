import React, { Component } from 'react'
import { Select, Modal } from 'antd'
import close_img from '../images/close.jpg'

const Option = Select.Option;

export default class Outer extends Component {
    constructor() {
        super()
        this.state = {
            selectList: [],
            parameter: [], //编辑参数设置
        }
    }
    onSelectIndicate(item) {
        let { selectList } = this.state
        selectList.push(item)
        this.setState({ selectList })
    }

    //切换比较符
    changeCompare(e, index) {
        let { selectList } = this.state
        selectList[index].operator = e
        this.setState({ selectList })
    }
    changeInput1(e, index) {
        let { selectList } = this.state
        selectList[index].comparand = e.target.value
        this.setState({ selectList })
    }
    changeInput2(e, index) {
        let { selectList } = this.state
        selectList[index].value1 = e.target.value
        this.setState({ selectList })
    }
    changeInput3(e, index) {
        let { selectList } = this.state
        selectList[index].value2 = e.target.value
        this.setState({ selectList })
    }
    //删除选择的指标
    cancelIndicate(index) {
        let { selectList } = this.state
        selectList = selectList.filter((item, itemIndex) => {
            return index !== itemIndex
        })
        this.setState({ selectList })
    }


    showModal(index) {
        let { selectList } = this.state
        selectList[index].visible = true
        this.setState({ selectList, parameter: JSON.parse(JSON.stringify(selectList[index].parameter)) })
    }

    hideModal(index) {
        let { selectList } = this.state
        selectList[index].visible = false
        this.setState({ selectList })
    }

    changeParams(e, index) {
        const { parameter } = this.state
        parameter[index].value = e.target.value
        this.setState({ parameter })
    }

    onSubmit(index) {
        let { selectList, parameter } = this.state
        selectList[index].parameter = parameter
        selectList[index].visible = false
        this.setState({ selectList, parameter: [] })
    }

    render() {
        const { tabIndex, indicateList, } = this.props
        const { selectList, parameter } = this.state
        return (
            <div style={tabIndex === 1 ? { display: 'block' } : { display: 'none' }} className="enter-wrapper">
                <div className="title">技术指标:</div>
                <div className="indicate-list">
                    {indicateList.map((item, index) => {
                        return (
                            <div className="indicate-item" key={index} onClick={this.onSelectIndicate.bind(this, item)}>
                                {item.name}
                            </div>
                        )
                    })}
                </div>
                <div className="title">已选条件:</div>
                <div className="select-list">
                    <div className="head">
                        <span>技术面条件</span>
                        <span>比较符</span>
                        <span>值</span>
                        <span>操作</span>
                    </div>
                    {selectList.length === 0 ? <div className="no-list">暂未选择条件</div> : null}
                    {selectList.map((item, index) => {
                        let operateValue = ""
                        if (item.operator === '>') {
                            operateValue = '大于'
                        } else if (item.operator === '<') {
                            operateValue = '小于'
                        } else {
                            operateValue = '区间'
                        }
                        return (
                            <div className="select-item" key={index}>
                                <div className="name" onClick={this.showModal.bind(this, index)}>
                                    <span>{item.name}</span>
                                    <span>
                                        ({item.parameter.map((parameter, parameterIndex) => {
                                            return (
                                                <span key={parameterIndex}>{parameter.value}{item.parameter.length > (parameterIndex + 1) ? ',' : ""}</span>
                                            )
                                        })})

                                        </span>
                                </div>
                                <div className="select-wrapper">
                                    <Select value={operateValue} style={{ width: 180 }} onChange={(e) => this.changeCompare(e, index)}>
                                        <Option value=">">大于</Option>
                                        <Option value="<">小于</Option>
                                        <Option value="~">区间</Option>
                                    </Select>
                                </div>
                                <div className="input-wrapepr">
                                    {
                                        item.operator === '>' || item.operator === '<' ?
                                            <input className="input-1" type="number" value={item.comparand} onChange={(e) => this.changeInput1(e, index)} /> :
                                            <div className="range">
                                                <input className="input-2" type="number" value={item.value1} onChange={(e) => this.changeInput2(e, index)} />
                                                <span>~</span>
                                                <input className="input-2" type="number" value={item.value2} onChange={(e) => this.changeInput3(e, index)} />
                                            </div>
                                    }

                                </div>
                                <div className="img-wrapepr">
                                    <img src={close_img} alt="" className="close-img" onClick={this.cancelIndicate.bind(this, index)} />
                                </div>
                                <Modal
                                    visible={item.visible}
                                    title={item.name + '参数设置'}
                                    onCancel={this.hideModal.bind(this, index)}
                                    onOk={this.onSubmit.bind(this, index)}
                                    okText={'确定'}
                                    width="500px"
                                    centered
                                    closable
                                >
                                    <div className="params-list">
                                        {parameter.map((parameterItem, parameterIndex) => {
                                            return (
                                                <div className="param-item" key={parameterIndex}>
                                                    <span>{parameterItem.label}:</span>
                                                    <input type="number" value={parameterItem.value} onChange={(e) => this.changeParams(e, parameterIndex)} />
                                                </div>
                                            )
                                        })}
                                    </div>

                                </Modal>
                            </div>
                        )
                    })}
                </div>

                <div className="btn-wrapper">
                    <div className="btn" onClick={()=>this.props.changeStep(0)}>上一步</div>
                    <div className="btn" onClick={()=>this.props.changeStep(2)}>下一步</div>
                </div>

            </div>
        )
    }
}