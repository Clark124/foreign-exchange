import React, { Component } from 'react'
import './index.less'
import { RouteComponentProps } from 'react-router-dom'
import { Select } from 'antd';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types';

import search_icon from '../../assets/images/search_icon.jpg'
import logo from '../../assets/images/logo.jpg'

const { Option } = Select;

interface IState {
    tabIndex: number;
    tabList: Array<string>;
    searchText: string;
    language: string;
}

type IProps = RouteComponentProps & InjectedIntlProps

class Header extends Component<IProps> {
    state: IState = {
        tabIndex: 0,
        tabList: ['Trade', 'Al-trade', 'News', 'Help'],
        searchText: "",
        language: 'English',
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

    onSearchStock: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({ searchText: e.target.value })
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

        // this.setState({ language: e })



    }

    render() {
        const { tabList, tabIndex, searchText, language } = this.state
        return (
            <div className="header-wrapper">
                <div className="header-content container">
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
                                placeholder="search"
                                onChange={this.onSearchStock}
                                value={searchText}
                            />
                            <img src={search_icon} alt="" className="search-icon" />
                            {/* {searchList.length > 0 ?
                                <ul className="stock-list">
                                    {searchList.map((item, index) => {
                                        return (
                                            <li key={index} onClick={this.toTradeRoom.bind(this, item)}>
                                                <span className="code">{item.prod_code.substring(0, 6)}</span>
                                                <span>{item.prod_name}</span>
                                            </li>
                                        )
                                    })}
                                </ul> : null
                            } */}

                        </div>
                        <span className="btn login">Sign in</span>
                        <span className="btn register">Sign up</span>
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