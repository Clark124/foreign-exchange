import React, { Component } from 'react'
import './index.less'
import { RouteComponentProps } from 'react-router-dom'
import { Select, message } from 'antd';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types';

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

interface IState {
    tabIndex: number;
    tabList: Array<string>;
    searchText: string;
    language: string;
    showLogin: boolean;
    showRegister: boolean;
    showEmailVerificate: boolean;
    searchList: Array<SearchItem>
}

interface Props {
    trade?: boolean
}

type IProps = RouteComponentProps & InjectedIntlProps & Props

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
    }
    static contextTypes: { changeLanguage: PropTypes.Validator<(...args: any[]) => any>; };

    UNSAFE_componentWillMount() {
        const language = localStorage.getItem("language")
        if (language) {
            if (language === 'en-US') {
                this.setState({ language: 'English' })
            } else {
                this.setState({ language: 'Chinese' })
            }
        }
    }

    onTabHeader(index: number): void {
        this.setState({ tabIndex: index })
    }
    //搜索合约
    onSearchStock: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const code = e.target.value
        console.log(code)
        this.setState({searchText:code})
        if (code === "") {
            this.setState({ searchList: [],  })
        } else {
            searchStcok({ key: code, count: 20 }).then(res => {
                this.setState({ searchList: res.data,  })
            }).catch(err=>{
                message.error("network error")
            })
        }

    }
    //跳转至交易室
    toTradeRoom(item: SearchItem) {
        console.log(item)
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
    successLogin() {

    }
    successRegister() {
        this.setState({ showRegister: false, showEmailVerificate: true })
    }
    onShowAgreement() {

    }

    render() {
        const { tabList, tabIndex, searchText, language, showLogin, showRegister, searchList, showEmailVerificate } = this.state
        const { trade } = this.props
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
                                    >
                                        <FormattedMessage id={item} defaultMessage={item} />

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
                        <span className="btn login" onClick={() => this.setState({ showLogin: true })}><FormattedMessage id={'signin'} defaultMessage={'Sign in'}/></span>
                        <span className="btn register" onClick={() => this.setState({ showRegister: true })}><FormattedMessage id={'register'} defaultMessage={'Sign Up'}/></span>
                        <Select value={language} style={{ width: 100, marginLeft: 20 }} onChange={this.changeLanguage.bind(this)}>
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


export default injectIntl(Header)