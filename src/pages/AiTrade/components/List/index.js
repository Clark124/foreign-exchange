import React, { Component } from 'react'
import './index.less'
import { Tabs, Pagination } from 'antd'
import Search from './components/Search'
import Mine from './components/Mine'
import Deploy from './components/Deploy'
import Trust from './components/Trust'
import Follow from './components/Follow'
import Collect from './components/Collect'
import { myStrategyList, deployStrategyList,shareStrategyList, followStrategy, collectStrategy } from '../../../../service/serivce'
import Loading from '../../../../Components/Loading/index'

const TabPane = Tabs.TabPane;

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}

export default class StrategyList extends Component {
    constructor() {
        super()
        this.state = {
            status: '',
            tabIndex: 1,
            page: 1,
            total_row: 1,
            dataList: [],
        }
    }

    UNSAFE_componentWillMount() {

        let search = this.props.location.search
        if (search === '?type=3') {
            this.setState({ tabIndex: 3 })
            this.getDeployStrategy(1)
        } else if(search === '?type=4'){
            this.setState({ tabIndex: 4 })
            this.getFollowStrategy(1)
        }
        else {
            this.getMineStrategy(1)
        }

    }

    changeTab(e) {
        this.setState({ tabIndex: parseInt(e), page: 1, dataList: [] }, () => {
            if (parseInt(e) === 1) {
                this.getMineStrategy(1)
            } else if (parseInt(e) === 3) {
                this.getShareStrategy(1)
            } else if (parseInt(e) === 2) {
                this.getTrustStrategy(1)
            } else if (parseInt(e) === 4) {
                this.getFollowStrategy(1)
            } else if (parseInt(e) === 5) {
                this.getCollectStrategy(1)
            }
        })
    }

    //获取我的策略
    getMineStrategy(page, param) {
        const token = getToken()
        const data = {
            page_no: page,
            page_count: 10,
            // param: param ? param : ""
        }
        this.setState({ status: 'loading' })
        myStrategyList(data,token).then(res => {
            const { totalRow, list } = res
            this.setState({
                dataList: list,
                totalRow: totalRow,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }

 
    getDeployStrategy(page, param) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            page_no: page,
            page_count: 10,
            isPublish: 1,
            param: param ? param : "",
        }
        this.setState({ status: 'loading' })
        deployStrategyList(data).then(res => {
            const { total_row, deploy } = res.result
            this.setState({
                dataList: deploy,
                totalRow: total_row,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }
       //发布的策略
    getShareStrategy(page,param){
        const token = getToken()
        const data = {
            page_no: page,
            page_count: 10,
            param: param ? param : ""
        }
        this.setState({ status: 'loading' })
        shareStrategyList(data,token).then(res => {
            
            const { totalRow, list } = res
            this.setState({
                dataList: list,
                totalRow: totalRow,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }
    //托管的策略
    getTrustStrategy(page,param) {
        const token = getToken()
        const data = {
            page_no: page,
            page_count: 10,
            param: param ? param : "",
        }
        this.setState({ status: 'loading' })
        deployStrategyList(data,token).then(res => {
            const { totalRow, list } = res
            this.setState({
                dataList: list,
                totalRow: totalRow,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }
    //跟单的策略
    getFollowStrategy(page,param) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            page_no: page,
            page_count: 10,
            param: param ? param : "",
        }
        this.setState({ status: 'loading' })
        followStrategy(data).then(res => {
            const { total_row, strategy } = res.result
            this.setState({
                dataList: strategy,
                totalRow: total_row,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }
    //收藏的策略
    getCollectStrategy(page,param) {
        const token = localStorage.getItem('token')
        const data = {
            token,
            page_no: page,
            page_count: 10,
            param: param ? param : "",
        }
        this.setState({ status: 'loading' })
        collectStrategy(data).then(res => {
            const { total_row, strategy } = res.result
            this.setState({
                dataList: strategy,
                totalRow: total_row,
            })
            this.setState({ status: 'success' })
        }).catch(err => {
            console.log(err)
            this.setState({ status: 'success' })
        })
    }

    //分页
    onChangePage(e) {
        const { tabIndex } = this.state
        if (tabIndex === 1) {
            this.getMineStrategy(e)
        } else if (tabIndex === 3) {
            this.getShareStrategy(e)
        } else if (tabIndex === 2) {
            this.getTrustStrategy(e)
        } else if (tabIndex === 4) {
            this.getFollowStrategy(e)
        } else if (tabIndex === 5) {
            this.getCollectStrategy(e)
        }

        this.setState({ page: e })
    }
    //刷新数据
    refreshData() {
        const { page, tabIndex } = this.state
        if (tabIndex === 1) {
            this.getMineStrategy(page)
        } else if (tabIndex === 3) {
            this.getShareStrategy(page)
        } else if (tabIndex === 2) {
            this.getTrustStrategy(page)
        } else if (tabIndex === 4) {
            this.getFollowStrategy(page)
        } else if (tabIndex === 5) {
            this.getCollectStrategy(page)
        }
    }
    //暂停发布的策略
    suspendDeploy(index) {
        let { dataList } = this.state
        if (dataList[index].status === 'running') {
            dataList[index].status = 'stop'
        } else {
            dataList[index].status = 'running'
        }
        this.setState({ dataList })
    }
    //设置交易方式
    setTrade(index) {
        let { dataList } = this.state
        if (dataList[index].trade_flag === true) {
            dataList[index].trade_flag = false
        } else {
            dataList[index].trade_flag = true
        }
        this.setState({ dataList })
    }
    //改变信号通知方式
    changeNotice(sys, wx, sms, index) {
        let { dataList } = this.state
        dataList[index].system_notice = sys
        dataList[index].weixin_notice = wx
        dataList[index].sms_notice = sms
        this.setState({ dataList })

    }
    //搜索
    searchStrategy(text) {
        const { tabIndex } = this.state
        if (tabIndex === 1) {
            this.getMineStrategy(1, text)
        } else if (tabIndex === 3) {
            this.getShareStrategy(1, text)
        } else if (tabIndex === 2) {
            this.getTrustStrategy(1, text)
        } else if (tabIndex === 4) {
            this.getFollowStrategy(1, text)
        } else if (tabIndex === 5) {
            this.getCollectStrategy(1, text)
        }
        this.setState({ page: 1 })
    }
    render() {
        const { status, tabIndex, totalRow } = this.state
        return (
            <div className="strategy-list-wrapper container">
                <div className="nav-title">
                    <span onClick={()=>this.props.history.push('/strategy/rank')}>AI-trade</span>
                    <span>></span>
                    <span className="current">My strategies</span>
                </div>
                <div className="tab-wrapper">
                    <Tabs type="card" onChange={this.changeTab.bind(this)} activeKey={tabIndex.toString()}>
                        <TabPane tab="All" key="1">
                            <Search tabIndex={tabIndex} searchStrategy={this.searchStrategy.bind(this)} />
                            <Mine {...this.state} {...this.props} refresh={this.refreshData.bind(this)} />
                        </TabPane>
                        <TabPane tab="Running" key="2">
                            <Search tabIndex={tabIndex} searchStrategy={this.searchStrategy.bind(this)} />
                            <Trust
                                {...this.state} {...this.props}
                                refresh={this.refreshData.bind(this)}
                                suspendDeploy={this.suspendDeploy.bind(this)}
                                setTrade={this.setTrade.bind(this)}
                                changeNotice={this.changeNotice.bind(this)}
                            />
                        </TabPane>
                        <TabPane tab="Shared" key="3">
                            <Search tabIndex={tabIndex} searchStrategy={this.searchStrategy.bind(this)} />
                            <Deploy {...this.state} {...this.props}
                                refresh={this.refreshData.bind(this)}
                                suspendDeploy={this.suspendDeploy.bind(this)}
                            />
                        </TabPane>
                        <TabPane tab="Followed" key="4">
                            <Search tabIndex={tabIndex} searchStrategy={this.searchStrategy.bind(this)} />
                            <Follow
                                {...this.state} {...this.props}
                                refresh={this.refreshData.bind(this)}
                                suspendDeploy={this.suspendDeploy.bind(this)}
                                setTrade={this.setTrade.bind(this)}
                                changeNotice={this.changeNotice.bind(this)}
                            />
                        </TabPane>
                        <TabPane tab="Favorite" key="5">
                            <Search tabIndex={tabIndex} searchStrategy={this.searchStrategy.bind(this)} />
                            <Collect {...this.state} {...this.props}
                                refresh={this.refreshData.bind(this)}
                                suspendDeploy={this.suspendDeploy.bind(this)}
                                followSuccess={() => this.changeTab(4)}
                            />
                        </TabPane>
                    </Tabs>
                </div>

                <div className="pagination-wrapper">
                    <Pagination defaultCurrent={1} total={totalRow} onChange={this.onChangePage.bind(this)} />
                </div>

                {status === 'loading' ? <Loading /> : null}
            </div>
        )
    }
}