import React, { Component } from 'react'
import './index.less'
import { RouteComponentProps } from 'react-router-dom'
import { Select } from 'antd';
import search_icon from '../../assets/images/search_icon.jpg'
import logo from '../../assets/images/logo.jpg'

const { Option } = Select;

interface IState {
    tabIndex: number;
    tabList: Array<string>;
    searchText: string;
}

type IProps = RouteComponentProps

class Header extends Component<IProps> {
    state: IState = {
        tabIndex: 0,
        tabList: ['Trade', 'Al-trade', 'News', 'Help'],
        searchText: "",

    }
    onTabHeader(index: number): void {
        this.setState({ tabIndex: index })
    }

    onSearchStock: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({searchText:e.target.value})
    }

     //切换
     changeLanguage() {
        console.log(this.props)
    }

    render() {
        const { tabList, tabIndex, searchText } = this.state
        return (
            <div className="header-wrapper">
                <div className="header-content container">
                    <div className="left">
                        <img src={logo} alt=""  />
                        <span className="logo-text btn">Forex Trading Platform</span>
                        <div className="header-tab">
                            {tabList.map((item, index) => {
                                return (
                                    <div className={tabIndex === index ? 'tab-item active' : 'tab-item'}
                                        onClick={this.onTabHeader.bind(this, index)} key={index}
                                    >
                                        {item}
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
                        <Select defaultValue="English" style={{ width: 100,marginLeft:20 }} onChange={this.changeLanguage.bind(this)}>
                            <Option value={0}>English</Option>
                            <Option value={1}>Chinese</Option>
                            
                        </Select>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header