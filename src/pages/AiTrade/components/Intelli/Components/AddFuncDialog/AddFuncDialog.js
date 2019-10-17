import React, { Component } from 'react';
import { Modal, } from 'antd';
import { fetchFunctionList } from '../../../../../../service/serivce'
import './AddFuncDialog.less';


class AddFuncDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "函数列表",
            typeList: ['命令', '函数', '指标'],
            typeIndex: 0,
            functionList: [],
            functionIndex: 0,
            discribe: "",
            dataList: []
        };
        this.insert = this.insert.bind(this);
        this.cancel = this.cancel.bind(this);

    }
    UNSAFE_componentWillMount() {
        this.fetchFncList();
    }
    fetchFncList(index) {
        const userInfo = localStorage.getItem('userInfo')
        const token = JSON.parse(userInfo).token
        fetchFunctionList({}, token).then(data => {
            let typeList = data.data.map((item) => {
                return Object.keys(item)[0]
            })
            let functionList = data.data[0][typeList[0]]
            const discribe = functionList[0].description
            this.setState({
                typeList,
                functionList,
                discribe,
                dataList: data.data
            })
        });
    }
    insert() {
        const { functionList, functionIndex } = this.state
        const value = functionList[functionIndex].sample
        this.props.onInsert(value)
    }
    cancel() {
        this.props.onCancel('fncDialog');
    }
    //切换函数
    onChangeFunction(index) {
        this.setState({ functionIndex: index, discribe: this.state.functionList[index].description })
    }
    //切换函数类型
    onChangeFuncType(index) {
        const { dataList, typeList } = this.state
        let functionList = dataList[index][typeList[index]]
        const discribe = functionList[0].description
        this.setState({
            functionList,
            discribe,
            typeIndex: index
        })
    }
    render() {
        const { typeList, typeIndex, functionList, functionIndex, discribe } = this.state
        return (
            <Modal
                visible={this.props.visible}
                title={this.state.title}
                onCancel={this.cancel}
                onOk={this.insert}
                okText={'插入'}
                width="800px"
                centered
                closable
            >
                <div className="add-func-wrapper">
                    <div className="tab-wrapper">
                        <div className="tab-index">
                            <div className="tab-title">函数类型</div>
                            <div className="tab-list">
                                {typeList.map((item, index) => {
                                    return (
                                        <div className={typeIndex === index ? "type-item active" : "type-item"}
                                            key={index}
                                            onClick={this.onChangeFuncType.bind(this, index)}
                                        >{item}</div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="function-type">
                            <div className="function-type-title" style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>名称</span>
                                <span>说明</span>
                            </div>
                            <div className="function-list">
                                {functionList.map((item, index) => {
                                    return (
                                        <div className={functionIndex === index ? "function-item active" : "function-item"}
                                            onClick={this.onChangeFunction.bind(this, index)}
                                            key={index}>
                                            <span>{item.code}</span>
                                            <span>{item.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>


                    <div className="discribe" dangerouslySetInnerHTML={{ __html: discribe ? discribe : "暂无介绍！" }}>

                    </div>

                </div>
            </Modal>
        )
    }
}

export default AddFuncDialog;