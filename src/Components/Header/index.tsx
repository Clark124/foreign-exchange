import React, { Component } from 'react'
import './index.less'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { Select, message, Modal } from 'antd';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types';

import { changeHeaderIndex } from '../../pages/Home/actions'

import { searchStcok } from '../../service/serivce'

import search_icon from '../../assets/images/search_icon.jpg'
import logo from '../../assets/images/logo.jpg'

import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Verification from './components/Verification/index'

const { Option } = Select;

interface SearchItem {
    prod_code: string;
}

interface UserInfo {
    email: string;
    token: string;
}

interface IState {
    tabIndex: number;
    tabList: Array<string>;
    searchText: string;
    language: string;
    showLogin: boolean;
    showRegister: boolean;
    showEmailVerificate: boolean;
    searchList: Array<SearchItem>;
    userInfo: UserInfo;
    hoverIndex: number;
}

interface Props {
    trade?: boolean
}


const mapStateToProps = (state: IStoreState, ) => {
    return {
        headerIndex: state.home.headerIndex
    }
}
const mapDispatchToProps = {
    changeHeaderIndex
}
type IStateProps = ReturnType<typeof mapStateToProps>
type IDispatchProps = typeof mapDispatchToProps

type IProps = RouteComponentProps & InjectedIntlProps & Props & IStateProps & IDispatchProps

class Header extends Component<IProps> {
    state: IState = {
        tabIndex: 0,
        tabList: ['Trade', 'Al-trade', 'News', 'Help'],
        searchText: "",
        language: 'English',
        showLogin: false,
        showRegister: false,
        showEmailVerificate: false,
        searchList: [],
        userInfo: {
            email: "",
            token: "",
        },
        hoverIndex: 0
    }
    static contextTypes: { changeLanguage: PropTypes.Validator<(...args: any[]) => any>; };

    UNSAFE_componentWillMount() {
        let userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            this.setState({ userInfo: JSON.parse(userInfo) })
        }
        const language = localStorage.getItem("language")
        if (language) {
            if (language === 'en-US') {
                this.setState({ language: 'English' })
            } else {
                this.setState({ language: 'Chinese' })
            }
        }
        this.setTabIndex()
    }
     //当前tab的下标
     setTabIndex() {
        const pathname = this.props.history.location.pathname.substring(1)
        // if (pathname === 'aiTrade') {
        //     this.props.changeHeaderIndex(1)
        // }
        if (pathname.includes('aiTrade')) {
            this.props.changeHeaderIndex(1)
        }
        // if (pathname.includes('compose')) {
        //     this.props.changeHeaderIndex(2)
        // }
        // if (pathname.includes('selectStock')) {
        //     this.props.changeHeaderIndex(1)
        // }
        // if (pathname.includes('scanning')) {
        //     this.props.changeHeaderIndex(4)
        // }

    }

    onTabHeader(index: number): void {
        switch (index) {
            case 0:
                this.props.history.push('/')
                this.props.changeHeaderIndex(index)
                break
            case 1:
                // this.props.history.push('/selectStock')
                // this.props.changeHeaderIndex(index)
                break
            case 5:
                // this.props.history.push('/traderoom')
                break
            default:
                break
        }
    }
    //搜索合约
    onSearchStock: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const code = e.target.value
        this.setState({ searchText: code })
        if (code === "") {
            this.setState({ searchList: [], })
        } else {
            searchStcok({ key: code, count: 20 }).then(res => {
                this.setState({ searchList: res.data, })
            }).catch(err => {
                message.error("network error")
            })
        }

    }
    //跳转至交易室
    toTradeRoom(item: SearchItem) {
        this.props.history.push('/tradeRoom/' + item.prod_code)
    }

    //切换
    changeLanguage(e: string) {
        let value = ""
        if (e === 'English') {
            value = 'en-US'
        } else {
            value = 'zh-CN'
        }
        localStorage.setItem('language', value)
        this.context.changeLanguage(value)
    }
    successLogin(userInfo: UserInfo) {
        this.setState({ showLogin: false, userInfo })
    }
    //成功注册
    successRegister() {
        this.setState({ showRegister: false, showEmailVerificate: true })
    }
    onShowAgreement() {

    }

    //弹出登出
    showLogout() {
        Modal.confirm({
            title: "Are you sure logout",
            onOk: () => {
                localStorage.removeItem("userInfo")
                this.setState({ userInfo: { email: "", token: "" } })
            }
        })
    }
    isLogin() {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            return true
        } else {
            return false
        }
    }

    selectStockTab(index: number) {
        let isLogin = this.isLogin()
        if (isLogin) {
            this.props.changeHeaderIndex(1)
            if (index === 0) {
                this.props.history.push('/aiTrade/build')
            } else if (index === 1) {
                this.props.history.push('/aiTrade/intelli')
            } else if (index === 2) {
                this.props.history.push('/aiTrade/build')
            }
        } else {
            Modal.info({
                title: "tips",
                content: "Please sign in first!"
            })
        }
    }

    render() {
        const { tabList, searchText, language, showLogin, showRegister, searchList, showEmailVerificate, userInfo, hoverIndex } = this.state
        const { trade } = this.props
        const tabIndex = this.props.headerIndex
        return (
            <div className="header-wrapper">
                {showLogin ? <Login
                    isLogin={this.successLogin.bind(this)}
                    cancelLogin={() => this.setState({ showLogin: false })}
                    toRegister={() => this.setState({ showRegister: true, showLogin: false })}
                    toForget={() => this.setState({ showLogin: false, showForget: true })}
                /> : null}
                {showRegister ? <Register
                    successRegister={this.successRegister.bind(this)}
                    closeRegister={() => this.setState({ showRegister: false })}
                    onShowAgreement={this.onShowAgreement.bind(this)}
                    toLogin={() => this.setState({ showRegister: false, showLogin: true })}
                /> : null}
                {showEmailVerificate ?
                    <Verification
                        closeVerificate={() => this.setState({ showEmailVerificate: false })}
                    />
                    : null
                }
                <div className={trade ? "header-content trade" : "header-content container"}  >
                    <div className="left">
                        <img src={logo} alt="" />
                        <span className="logo-text btn">Forex Trading Platform</span>
                        <div className="header-tab">
                            {tabList.map((item, index) => {
                                return (
                                    <div className={tabIndex === index ? 'tab-item active' : 'tab-item'}
                                        onClick={this.onTabHeader.bind(this, index)} key={index}
                                        onMouseEnter={() => this.setState({ hoverIndex: index })}
                                        onMouseLeave={() => this.setState({ hoverIndex: -1 })}
                                    >
                                        <FormattedMessage id={item} defaultMessage={item} />
                                        <div className="tab-item-select-wrapper">
                                            {hoverIndex === 1 && index === 1 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectStockTab.bind(this, 0)}>Stradegy Build</li>
                                                    <li onClick={this.selectStockTab.bind(this, 1)}>Intelli Script</li>
                                                    <li onClick={this.selectStockTab.bind(this, 2)}>My Strategies</li>
                                                    <li onClick={this.selectStockTab.bind(this, 3)}>Strategy List</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                            {/* {hoverIndex === 2 && index === 2 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectComposeTab.bind(this, 0)}>组合排行</li>
                                                    <li onClick={this.selectComposeTab.bind(this, 1)}>创建组合</li>
                                                    <li onClick={this.selectComposeTab.bind(this, 2)}>我的组合</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                            {hoverIndex === 3 && index === 3 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectStrategyTab.bind(this, 0)}>搭建策略</li>
                                                    <li onClick={this.selectStrategyTab.bind(this, 1)}>编写策略</li>
                                                    <li onClick={() => {
                                                        this.props.history.push('/strategy/list')
                                                        this.props.changeHeaderIndex(index)
                                                    }}>我的策略</li>
                                                    <li onClick={this.selectStrategyTab.bind(this, 3)}>策略排行</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            }
                                            {hoverIndex === 4 && index === 4 ?
                                                <ul className="tab-item-select">
                                                    <li onClick={this.selectScanTab.bind(this, 0)}>新建扫描</li>
                                                    <li onClick={this.selectScanTab.bind(this, 1)}>扫描列表</li>
                                                    <div className="trigle"></div>
                                                </ul> : null
                                            } */}

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="right">
                        <div className="input-wrapper">
                            <input className="input"
                                placeholder={"search"}
                                onChange={this.onSearchStock}
                                value={searchText}
                            />
                            <img src={search_icon} alt="" className="search-icon" />
                            {searchList.length > 0 ?
                                <ul className="stock-list">
                                    {searchList.map((item, index) => {
                                        return (
                                            <li key={index} onClick={this.toTradeRoom.bind(this, item)}>

                                                <span>{item.prod_code}</span>
                                            </li>
                                        )
                                    })}
                                </ul> : null
                            }

                        </div>
                        {userInfo.token ?
                            <div className="userinfo">
                                <span className="email">{userInfo.email}</span>
                                <span className="logout btn" onClick={this.showLogout.bind(this)}>Logout</span>
                            </div> :
                            <div>
                                <span className="btn login" onClick={() => this.setState({ showLogin: true })}><FormattedMessage id={'signin'} defaultMessage={'Sign in'} /></span>
                                <span className="btn register" onClick={() => this.setState({ showRegister: true })}><FormattedMessage id={'register'} defaultMessage={'Sign Up'} /></span>
                            </div>
                        }


                        <Select value={language} style={{ width: 142, marginLeft: 20 }} onChange={this.changeLanguage.bind(this)}>
                            <Option value={'English'}><FormattedMessage id={'english'} defaultMessage={'English'} /></Option>
                            <Option value={'Chinese'}><FormattedMessage id={'chinese'} defaultMessage={'Chinese'} /></Option>
                        </Select>
                    </div>
                </div>
            </div>
        )
    }
}

Header.contextTypes = {
    changeLanguage: PropTypes.func.isRequired,
};

const HeaderConnect = connect(mapStateToProps, mapDispatchToProps)(Header)

export default injectIntl(HeaderConnect)