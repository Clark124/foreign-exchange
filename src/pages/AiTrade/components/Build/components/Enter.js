import React, { Component } from 'react'
import { Modal, Tabs } from 'antd'
import SelectList from './SelectList'

const TabPane = Tabs.TabPane;



export default class Enter extends Component {
    constructor() {
        super()
        this.state = {
            selectListLong: [],
            selectListShort: [],
            parameter: [], //编辑参数设置
            tabsIndex: 1,
            checked: true,
        }
    }

    onSelectIndicate(item) {
        let value = JSON.parse(JSON.stringify(item))
        const { tabsIndex } = this.state
        if (tabsIndex === 1) {
            let { selectListLong } = this.state
            selectListLong.push(value)
            this.setState({ selectListLong })
        } else {
            let { selectListShort } = this.state
            selectListShort.push(value)
            this.setState({ selectListShort })
        }

    }

    //切换比较符
    changeCompare(e, index, type) {
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong[index].operator = e
            this.setState({ selectListLong })
        } else {
            let { selectListShort } = this.state
            selectListShort[index].operator = e
            this.setState({ selectListShort })
        }
    }

    changeInput1(e, index, type) {
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong[index].comparand = e.target.value
            this.setState({ selectListLong })
        } else {
            let { selectListShort } = this.state
            selectListShort[index].comparand = e.target.value
            this.setState({ selectListShort })
        }

    }
    changeInput2(e, index, type) {
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong[index].value1 = e.target.value
            this.setState({ selectListLong })
        } else {
            let { selectListShort } = this.state
            selectListShort[index].value1 = e.target.value
            this.setState({ selectListShort })
        }

    }
    changeInput3(e, index, type) {
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong[index].value2 = e.target.value
            this.setState({ selectListLong })
        } else {
            let { selectListShort } = this.state
            selectListShort[index].value2 = e.target.value
            this.setState({ selectListShort })
        }

    }
    //删除选择的指标
    cancelIndicate(index, type) {
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong = selectListLong.filter((item, itemIndex) => {
                return index !== itemIndex
            })
            this.setState({ selectListLong })
        } else {
            let { selectListShort } = this.state
            selectListShort = selectListShort.filter((item, itemIndex) => {
                return index !== itemIndex
            })
            this.setState({ selectListShort })
        }

    }


    showModal(index, type) {
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong[index].visible = true
            this.setState({ selectListLong, parameter: JSON.parse(JSON.stringify(selectListLong[index].parameter)) })
        } else {
            let { selectListShort } = this.state
            selectListShort[index].visible = true
            this.setState({ selectListShort, parameter: JSON.parse(JSON.stringify(selectListShort[index].parameter)) })
        }
    }

    hideModal(index, type) {
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong[index].visible = false
            this.setState({ selectListLong })
        } else {
            let { selectListShort } = this.state
            selectListShort[index].visible = false
            this.setState({ selectListShort })
        }

    }

    changeParams(e, index) {
        const { parameter } = this.state
        parameter[index].value = e.target.value
        this.setState({ parameter })
    }

    onSubmit(index, type) {
        let { parameter } = this.state
        let isRight = true
        parameter.forEach(item => {
            if (item.value === "") {
                Modal.error({
                    title: "提示",
                    content: "参数值不能为空"
                })
                isRight = false
            }
        })
        if (!isRight) {
            return
        }
        if (type === 0) {
            let { selectListLong } = this.state
            selectListLong[index].parameter = parameter
            selectListLong[index].visible = false
            this.setState({ selectListLong, parameter: [] })
        } else {
            let { selectListShort } = this.state
            selectListShort[index].parameter = parameter
            selectListShort[index].visible = false
            this.setState({ selectListShort, parameter: [] })
        }

    }


    changeTab(e) {
        // this.setState({ tabsIndex: parseInt(e) })
    }

    changeCheck(e) {
        this.setState({ checked: e.target.checked })
    }

    render() {
        const { tabIndex, indicateList, } = this.props
        const { selectListLong, parameter, tabsIndex } = this.state
        return (
            <div style={tabIndex === 0 ? { display: 'block' } : { display: 'none' }}>
                <div className="enter-wrapper">
                    <div className="title">Technical indicators:</div>
                    <div className="indicate-list">
                        {indicateList.map((item, index) => {
                            return (
                                <div className="indicate-item" key={index} onClick={this.onSelectIndicate.bind(this, item)}>
                                    {item.name}
                                </div>
                            )
                        })}
                    </div>
                    {/* <div className="title">Has Select:</div> */}

                    <Tabs type="card" onChange={this.changeTab.bind(this)} activeKey={tabsIndex.toString()}>
                        <TabPane tab="Has Select" key="1">
                            {/* <div className="condition-select">
                                <Checkbox checked={this.state.checked} style={{ marginRight: 5 }} onChange={this.changeCheck.bind(this)} /><span>Open a long position before clearing out the empty position</span>
                            </div> */}
                            <SelectList
                                parameter={parameter}
                                selectList={selectListLong}
                                showModal={(index) => this.showModal(index, 0)}
                                hideModal={(index) => this.hideModal(index, 0)}
                                changeCompare={(e, index) => this.changeCompare(e, index, 0)}
                                changeInput1={(e, index) => this.changeInput1(e, index, 0)}
                                changeInput2={(e, index) => this.changeInput2(e, index, 0)}
                                changeInput3={(e, index) => this.changeInput3(e, index, 0)}
                                cancelIndicate={(index) => this.cancelIndicate(index, 0)}
                                changeParams={(e, parameterIndex) => this.changeParams(e, parameterIndex)}
                                onSubmit={(index) => this.onSubmit(index,0)}
                            />
                        </TabPane>
                        {/* <TabPane tab="Short condition" key="2">
                            <div className="condition-select">
                                <Checkbox checked={this.state.checked} style={{ marginRight: 5 }} onChange={this.changeCheck.bind(this)} /><span>Open a short position before clearing out the empty position</span>
                            </div>
                            <SelectList
                                parameter={parameter}
                                selectList={selectListShort}
                                showModal={(index) => this.showModal(index, 1)}
                                hideModal={(index) => this.hideModal(index, 1)}
                                changeCompare={(e, index) => this.changeCompare(e, index, 1)}
                                changeInput1={(e, index) => this.changeInput1(e, index, 1)}
                                changeInput2={(e, index) => this.changeInput2(e, index, 1)}
                                changeInput3={(e, index) => this.changeInput3(e, index, 1)}
                                cancelIndicate={(index) => this.cancelIndicate(index, 1)}
                                changeParams={(e, parameterIndex) => this.changeParams(e, parameterIndex)}
                                onSubmit={(index) => this.onSubmit(index,1)}
                            />
                        </TabPane> */}
                    </Tabs>

                </div>

                <div className="btn-wrapper">
                    <div className="btn" onClick={() => this.props.changeStep(1)}>NEXT</div>
                </div>
            </div>

        )
    }
}