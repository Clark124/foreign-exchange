import React, { Component } from 'react';
import { Modal, Button, Table, Radio} from 'antd';
import { post} from '../../utils/utils';
import Service from '../../utils/server'
import css from  './style.css';

export default class AddStrategyDialog extends Component{
    constructor(props) {
        super(props);
        this.state = {
            strategyList: [],
            selectedStrategy: '',
        };
        this.insert = this.insert.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onRow = this.onRow.bind(this);
        this.fetchFncList();
        this.columns = [
            {
                title: "名称",
                dataIndex: 'name',
                align: 'center',
                width: '220px',
                render: (text)=> (<div>{text}</div>)
            },
            {
                title: "类型",
                dataIndex: 'type',
                align: 'center',
                width: '140px',
                render: (text)=> (<div>{text}</div>)

            },
            {
                title: "最后编辑时间",
                dataIndex: 'update_date',
                align: 'center',
                render: (text)=> (<div>{text}</div>)

            },
            {
                title: "选择",
                align: 'center',
                render: (text,col) => { return (<Radio value={col.name} checked={this.state.selectedStrategy === col.name} onChange={()=>{this.setState({selectedStrategy: col.name})}} />) }
            },

        ]
    }
    fetchFncList(){
        post(Service.test + Service.getStrategyList,{ user_id: localStorage.getItem('user_id') },false).then(data =>{
            if(data.length !== 0){
                data = data.map((list,index) => {
                    list.key = index;
                    return list;
                });
                this.setState({strategyList: data},()=>{
                    this.setState({selectedStrategy: this.state.strategyList[0].name});
                });
            }
        });
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible === true){
            this.fetchFncList();
        }
    }
    insert(){
        if(this.state.selectedStrategy !== ''){
            this.state.strategyList.forEach(stra =>{
                if(stra.name === this.state.selectedStrategy){
                    this.props.onInsert({express: stra.express, params: stra.params});
                }
            })

            this.cancel();
        }
    }
    onRow(record){
        return {
            onClick: ()=>{
                this.setState({selectedStrategy: record.name});
            }
        }
    }
    cancel(){
        this.props.onCancel('straDialog');
    }
    render(){
        return (
            <Modal
                visible={this.props.visible}
                title="我的策略"
                onCancel={this.cancel}
                width="800px"
                centered
                closable
                footer={
                    <div style={{textAlgin: 'right'}}>
                        <Button onClick={this.insert} type="primary">插入</Button>
                        <Button onClick={this.cancel} type="primary">取消</Button>
                    </div>
                }
            >
                <div>
                    <Table scroll={{y: 500}} onRow={this.onRow} className={css.AddStrategyDialog} columns={this.columns} dataSource={this.state.strategyList} pagination={false} size="middle" />
                </div>
            </Modal>
        )
    }
}
