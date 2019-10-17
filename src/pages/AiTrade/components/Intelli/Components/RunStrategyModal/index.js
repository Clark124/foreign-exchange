import React, { Component } from 'react'
import { Modal, Select, message, Checkbox } from 'antd';
import './index.less'

const Option = Select.Option;


export default class RunStrategyModel extends Component {
    constructor() {
        super()
        this.state = {
            title: "Run Strategy",
            account: "account",
            name: "",
            discription: "",
            isPublic: true,
        }
    }
    cancel() {
        this.props.onCancel('runStrategy');
    }
    insert() {
        const { name, discription,isPublic } = this.state
        if (name === "") {
            message.error('please input name')
            return
        }
        this.props.onRunStrategy({ name, discription,isPublic })
    }
    changeAccount() {

    }
    changePublic(e) {
        this.setState({ isPublic: e.target.checked })
    }
    render() {
        return (
            <Modal
                visible={this.props.visible}
                title={this.state.title}
                onCancel={this.cancel.bind(this)}
                onOk={this.insert.bind(this)}
                okText={'Confirm'}
                width="400px"
                centered
                closable
            >
                <div className="run-strategy-modal">
                    <div className="name">
                        <span className="text" >Account:</span>
                        <Select value={this.state.account} style={{ width: 180 }} onChange={(e) => this.changeAccount(e)}>
                            <Option value={'account1'}>account1</Option>
                            <Option value={'account2'}>account2</Option>
                        </Select>
                    </div>
                    <div className="name">
                        <span className="text" >Name:</span>
                        <input type="text" onChange={(e) => this.setState({ name: e.target.value })} />
                    </div>
                    <div className="name" >Description:</div>
                    <div className="name">
                        <textarea className="discription" onChange={(e) => this.setState({ discription: e.target.value })} />
                    </div>
                    <div className="name">
                        <Checkbox checked={this.state.isPublic} style={{ marginRight: 5 }} onChange={this.changePublic.bind(this)} />
                        <span>Post it to strategy list, and allow follow trade.</span>
                    </div>

                </div>
            </Modal>
        )
    }
}