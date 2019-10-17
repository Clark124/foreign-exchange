import React, { Component } from 'react';
import { message } from 'antd'
import { RouteComponentProps, withRouter } from 'react-router';
import { getQuote, getKline, optionalList } from '../../service/serivce'
import { changeNumber } from '../../utils/utils'

import icon_clock from '../../assets/images/clock.png'

import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
// import ChartList from './components/ChartList'
import RatePannel from './components/RatePannel'

import './index.less'


type IProps = RouteComponentProps

interface IState {
    isChecked: boolean;
    content: string;
    number: number;
    quote: any;
    stockDate: any;
    optionalList: optionItem[];

}

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}


class Home extends Component<IProps, IState>{
    state = {
        content: "",
        isChecked: false,
        number: 1,
        quote: {},
        stockDate: [],
        optionalList: [],
    }
    UNSAFE_componentWillMount() {
        // this.onGetQuote('000001.SS')
        // this.onGetKline('000001.SS', 6)
        // this.getOptionalList()
    }
    //股票行情数据
    onGetQuote(code: string) {
        getQuote({ code }).then(res => {
            this.setState({ quote: res[0] })
        })
    }
    //K线图数据
    onGetKline(prod_code: string, period: number) {
        getKline({ prod_code, period }).then(res => {
            let data = res.data.candle[prod_code]
            data = changeNumber(data, 2)
            this.setState({ stockDate: data })
        })
    }
    submibt() {
        console.log(this.state.number)
        message.success('hahahah')
    }
    nav() {
        this.props.history.push('/edit')
    }
    //自选列表
    getOptionalList() {
        const token = getToken()
        if (token) {
            optionalList({}, token).then(res => {
                if (res.data.LWORK) {
                    console.log(res.data.LWORK)
                    this.setState({ optionalList: res.data.LWORK })
                } else {
                    this.setState({ optionalList: [] })
                }

            })
        }

    }

    periodCallback() {

    }

    render() {
        return (
            <div className="home">
                <Header {...this.props} />
                <div className="main">
                    <div className="container">
                        <div className="tips">
                            <div className="text">
                                <img src={icon_clock} alt="" className="icon-clock" />Offshore RMB against the US dollar once fell below the 6.94 pass, dropping about 150 points during the day.
                            </div>
                            <span className="more btn">MORE +</span>
                        </div>

                        <RatePannel {...this.props} optionalList={this.state.optionalList}/>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}



export default withRouter(Home);
