import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assets/css/iconfont.css';
import './assets/css/common.css';

import App from './router/router';
import { store } from './store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker';

import { addLocaleData, IntlProvider } from 'react-intl';
import zh_CN from './locale/zh_CN';
import zh_TW from './locale/zh_TW';
import en_US from './locale/en_US';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/en_US';
import PropTypes from 'prop-types';

const messages = {};
messages["en-US"] = en_US;
messages["zh-CN"] = zh_CN;
messages["zh-TW"] = zh_TW;
addLocaleData([...zh, ...en]);


class LocaleIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: 'en',
            messages: en_US,
        };
    }
    getChildContext() {
        return {
            changeLanguage: (language) => {
                this.changeLanguage(language)
            },
        };
    }
    UNSAFE_componentWillMount() {
        const language = localStorage.getItem("language")
        if(language){
            this.changeLanguage(language)
        }
    }
    changeLanguage(language) {
        switch (language) {
            case 'en-US':
                this.setState({
                    locale: 'en',
                    messages: en_US,
                });
                break;
            case 'zh-CN':
                this.setState({
                    locale: 'zh',
                    messages: zh_CN,
                });
                break;
            case 'zh-TW':
                this.setState({
                    locale: 'zh',
                    messages: zh_TW,
                });
                break;
            default:
                this.setState({
                    locale: 'en',
                    messages: en_US,
                });
                break;
        }
    }
    render() {
        return (
            <IntlProvider
                locale={this.state.locale}
                messages={this.state.messages}
            >

                <ConfigProvider locale={zhCN}>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </ConfigProvider>
            </IntlProvider>
        );
    }
}

LocaleIndex.childContextTypes = {
    changeLanguage: PropTypes.func.isRequired,
};

ReactDOM.render(
    <LocaleIndex />,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
