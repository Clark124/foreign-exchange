import React, { Component } from 'react';
import { Modal, Checkbox } from 'antd';
import { fetchStategyList } from '../../../../../../service/serivce'
import './AddStrategyDialog.less';
class AddStrategyDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strategyList: [],
      strategyIndex: 0,
      title: '我的策略',
    };
  }
  componentWillMount() {
    this.fetchStrategyist()
  }

  fetchStrategyist() {
    const userInfo = localStorage.getItem('userInfo')
    const token = JSON.parse(userInfo).token
    fetchStategyList({}, token).then(res => {
      this.setState({ strategyList: res })
    })
  }

  cancel() {
    this.props.onCancel('straDialog');
  }

  insert() {
    const { strategyList, strategyIndex } = this.state
    const result = strategyList[strategyIndex].express
    this.props.onInsert(result)
  }

  selectStrategy(index) {
    this.setState({ strategyIndex: index })
  }

  render() {
    const { strategyList, strategyIndex } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        title={this.state.title}
        onCancel={this.cancel.bind(this)}
        width="640px"
        onOk={this.insert.bind(this)}
        centered
        closable
      >
        <div className="add-strategy-wrapper">
          <table className="table">
            <tbody>
              <tr>
                <td>策略名称</td>
                <td>类型</td>
                <td>最后修改时间</td>
                <td>选择</td>
              </tr>
              {
                strategyList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.type === 'build' ? "搭建" : "编写"}</td>
                      <td>{item.update_date}</td>
                      <td>
                        <Checkbox onChange={this.selectStrategy.bind(this, index)} checked={strategyIndex === index} />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }
}

export default AddStrategyDialog;
