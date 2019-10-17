import React, { Component } from 'react'
import { Select, Modal } from 'antd'
import close_img from '../images/close.jpg'
const Option = Select.Option;

export default class SelectList extends Component {
    render() {
        const { selectList, parameter } = this.props
        return (
            <div className="select-list">
                <div className="head">
                    <span>Condition</span>
                    <span>Comparison</span>
                    <span>Value</span>
                    <span>Delete</span>
                </div>
                {selectList.length === 0 ? <div className="no-list">No Select</div> : null}
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
                            <div className="name" onClick={() => this.props.showModal(index)}>
                                <span>{item.name}</span>
                                <span>
                                    ({item.parameter.map((parameter, parameterIndex) => {
                                        return (
                                            <span key={parameterIndex}>{parameter.value}{item.parameter.length > (parameterIndex + 1) ? ',' : ""}</span>
                                        )
                                    })})

                                </span>
                            </div>
                            {item.operator === "" ? <div className="select-wrapper">---</div> :
                                <div className="select-wrapper">
                                    <Select value={operateValue} style={{ width: 180 }} onChange={(e) => this.props.changeCompare(e, index)}>
                                        <Option value=">">大于</Option>
                                        <Option value="<">小于</Option>
                                        <Option value="~">区间</Option>
                                    </Select>
                                </div>
                            }

                            <div className="input-wrapepr">
                                {
                                    item.operator === '>' || item.operator === '<' ?
                                        <input className="input-1" type="number" value={item.comparand} onChange={(e) => this.props.changeInput1(e, index)} /> :
                                        item.operator === "" ?
                                            <div>---</div> :
                                            <div className="range">
                                                <input className="input-2" type="number" value={item.value1} onChange={(e) => this.props.changeInput2(e, index)} />
                                                <span>~</span>
                                                <input className="input-2" type="number" value={item.value2} onChange={(e) => this.props.changeInput3(e, index)} />
                                            </div>
                                }

                            </div>
                            <div className="img-wrapepr">
                                <img src={close_img} alt="" className="close-img" onClick={() => this.props.cancelIndicate(index)} />
                            </div>
                            <Modal
                                visible={item.visible}
                                title={item.name + '参数设置'}
                                onCancel={() => this.props.hideModal(index)}
                                onOk={() => this.props.onSubmit(index)}
                                okText={'确定'}
                                width="500px"
                                centered
                                closable
                            >
                                <div className="params-list">
                                    {parameter.map((parameterItem, parameterIndex) => {
                                        return (
                                            <div className="param-item" key={parameterIndex}>
                                                <span className="param-name">{parameterItem.label}:</span>
                                                <input type="number" value={parameterItem.value} onChange={(e) => this.props.changeParams(e, parameterIndex)} />
                                            </div>
                                        )
                                    })}
                                </div>

                            </Modal>
                        </div>
                    )
                })}
            </div>
        )
    }
}