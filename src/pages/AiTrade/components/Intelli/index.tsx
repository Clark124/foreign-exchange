import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router';
import './index.less'
import "./edit_strategy.module.css";

import CodeMirror from '@uiw/react-codemirror';
import { Select, message, DatePicker } from 'antd'
import TradeRoomChart from '../../../../Components/traderoomchart/traderoomchart'
import AddFuncDialog from './Components/AddFuncDialog/AddFuncDialog'
import AddStrategyDialog from './Components/AddStrategyDialog/AddStrategyDialog';
import RunStrategyModel from './Components/RunStrategyModal/index'
import Loading from '../../../../Components/Loading/index'

import { getKline, getQuote, compileStrategy, saveStrategy, strategyDetail, backtest, trustStrategy } from '../../../../service/serivce'
import { changeNumber } from '../../../../utils/utils'
import Moment from 'moment'


import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/abcdef.css';
import 'codemirror/theme/ambiance.css';
import 'codemirror/theme/ambiance-mobile.css';
import 'codemirror/theme/base16-dark.css';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/bespin.css';
import 'codemirror/theme/blackboard.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/theme/colorforth.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const minuteData = [
    { title: '1 minute', value: '1 m', period: 1 },
    { title: '5 minute', value: '5 m', period: 2 },
    { title: '15 minute', value: '15 m', period: 3 },
    { title: '30 minute', value: '30m', period: 4 },
    { title: '1 Hour', value: '1 H', period: 5 },
    { title: '1 Day', value: '1 D', period: 6 },
    { title: '7 Day', value: '7 D', period: 7 },
    { title: '1 Month', value: '1 M', period: 8 },
]

interface Param {
    name: string;
    type: number;
    discibe: string;
    defaultValue: string;
}

interface IState {
    status: string;
    code: string;
    theme: string;
    themeList: string[];
    strategy_type: string;
    fncDialog: boolean;
    straDialog: boolean;
    runStrategy: boolean;
    paramList: Param[];
    compileInfo: string;
    strategyTitle: string;
    strategyDiscibe: string;
    quote: any;
    stockDate: any;
    beginTime: any;
    endTime: any;
    stockCode: string;
    period: number;
}

function getToken() {
    let token = ""
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
        token = JSON.parse(userInfo).token
    }
    return token
}

type IProps = RouteComponentProps<{ id: string }>

export default class Intelli extends Component<IProps> {
    state: IState = {
        status: "",
        code: '',
        theme: 'monokai',
        themeList: ['monokai', '3024-day', 'abcdef', 'ambiance', 'ambiance-mobile', 'base16-dark', 'base16-light', 'bespin', 'blackboard', 'cobalt', 'colorforth'],
        strategy_type: '',
        fncDialog: false,
        straDialog: false,
        runStrategy: false,
        paramList: [{
            name: 'initCaptial',
            type: 1,
            discibe: "",
            defaultValue: '10000',
        }],
        compileInfo: "", //编译信息
        strategyTitle: "", //策略标题
        strategyDiscibe: "",//策略描述
        quote: {},
        stockDate: [],
        beginTime: Moment().subtract(1, 'years'),
        endTime: Moment(),
        stockCode: "GBPNZD.LWORK",
        period: 6,
    }
    cm: any;

    UNSAFE_componentWillMount() {
        const { stockCode, period } = this.state
        this.onGetKline(stockCode, period)
        this.onGetQuote(stockCode)

        let token = ""
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
            token = JSON.parse(userInfo).token
        }
        const strategyId = this.props.match.params.id
        if (strategyId) {
            strategyDetail({ id: strategyId }, token).then(res => {
                const { description, express, name, params } = res.data
                let paramsList = []
                if (params && JSON.parse(params).length > 0) {
                    paramsList = JSON.parse(params)
                }
                this.setState({
                    code: express,
                    strategyDiscibe: description,
                    strategyTitle: name,
                    paramList: paramsList.map((item: { type: any; name: any; description: any; def_value: any; }) => {
                        let type = item.type
                        let typeValue = 1
                        if (type === 'float') {
                            typeValue = 0
                        } else if (type === 'int') {
                            typeValue = 1
                        } else if (type === 'string') {
                            typeValue = 2
                        }
                        return {
                            name: item.name,
                            discibe: item.description,
                            type: typeValue,
                            defaultValue: item.def_value
                        }
                    })
                })
            })
        }
        this.addAllParams()
    }

    selectTheme(value: string) {
        this.setState({ theme: value })
    }

    //编辑器修改事件
    editorChange(e: any) {
        if (this.state.strategy_type !== 'build') {
            this.setState({ code: e.getValue() });
        }
    }
    editorFocus(cm: any) {
        this.cm = this.cm === null ? cm : this.cm;
    }

    //编译
    onCompile(callback?: () => void) {
        let { paramList, code } = this.state
        let strategy_params: any = {}
        if (paramList.length > 0) {
            paramList.forEach((item) => {
                strategy_params[item.name] = item.defaultValue
            })
        }
        const data = {
            strategy_params: JSON.stringify(strategy_params),
            express: code
        }
        const userInfo = localStorage.getItem('userInfo')
        let token = ""
        if (userInfo) {
            token = JSON.parse(userInfo).token
        }
        this.setState({ status: "loading" })
        compileStrategy(data, token).then(res => {
            this.setState({ status: "success" })
            if (!res.error) {
                if (callback && (typeof callback === 'function')) {
                    callback()
                    return
                }
                message.success('compile success')
                this.setState({ compileInfo: "compile success" })
            } else {
                let info = '错误：' + res.line + '行，' + res.column + '列<br/>' + res.error
                this.setState({ compileInfo: info })
                message.error('策略编译失败！')
            }
        }).catch(err => {
            this.setState({ status: "success" })
        })

    }
    //保存策略
    saveStrategy(type?: string) {
        const { strategyTitle, paramList, code, strategyDiscibe } = this.state
        if (!strategyTitle.trim()) {
            message.error('please input strategy name')
            return
        }
        this.onCompile(() => {
            let token = ""
            const userInfo = localStorage.getItem('userInfo')
            if (userInfo) {
                token = JSON.parse(userInfo).token
            }
            let param = paramList.map((item) => {
                let type = item.type
                let typeValue = ""
                if (type === 0) {
                    typeValue = 'float'
                } else if (type === 1) {
                    typeValue = 'int'
                } else if (type === 2) {
                    typeValue = 'string'
                }
                return {
                    name: item.name,
                    type: typeValue,
                    def_value: item.defaultValue,
                    description: item.discibe
                }
            })
            const strategyParams: any = {}
            param.forEach(item => {
                strategyParams[item.name] = item.def_value
            })
            const strategyId = this.props.match.params.id
            let data = {
                name: strategyTitle,
                description: strategyDiscibe,
                express: code,
                params: param.length === 0 ? "" : JSON.stringify(param),
                strategy_params: JSON.stringify(strategyParams),
                strategy_id: strategyId ? strategyId : "",
            }

            saveStrategy(data, token).then(res => {
                if (res.success) {
                    message.success('save success')
                    this.setState({ compileInfo: "" })
                    setTimeout(() => {
                        this.props.history.push('/aiTrade/intelli/' + res.id)
                    }, 1000)
                } else if (res.error) {
                    message.error(res.error)
                }
            }).catch(err => {
                // this.setState({ status: "success" })
            })

        })

    }
    //回测
    toBackTest() {
        const { code, period, stockCode, beginTime, endTime, paramList } = this.state
        const strategyId = this.props.match.params.id
        if (!strategyId) {
            message.error('please save first')
            return
        }
        let strategy_params: any = {}
        if (paramList.length > 0) {
            paramList.forEach((item) => {
                strategy_params[item.name] = item.defaultValue
            })
        }

        const data = {
            strategy_id: strategyId,
            express: code,
            symbol: stockCode,
            period: period,
            strategy_params: JSON.stringify(strategy_params),
            init_captital: 10000,
            start_date: beginTime.format('YYYY-MM-DD'),
            end_date: endTime.format('YYYY-MM-DD'),
        }

        const token = getToken()
        this.setState({ status: "loading" })
        backtest(data, token).then(res => {
            this.setSignal(res.data.alerts)
            this.setState({ status: "success" })

        }).catch(err => {
            this.setState({ status: "fail" })
            console.log(err)
        })

    }
    //托管策略
    toRunStrategy(value: { name: string; discription: string, isPublic: boolean }) {
        const { code, period, stockCode, paramList ,strategyTitle} = this.state
        const strategyId = this.props.match.params.id
        if (!strategyId) {
            message.error('please save first')
            return
        }
        let strategy_params: any = {}
        if (paramList.length > 0) {
            paramList.forEach((item) => {
                strategy_params[item.name] = item.defaultValue
            })
        }

        const data = {
            account_id: 0,
            strategy_name: strategyTitle,
            express: code,
            symbol: stockCode,
            period: period,
            strategy_params: JSON.stringify(strategy_params),
            init_captital: 10000,
            // start_date: beginTime.format('YYYY-MM-DD'),
            // end_date: endTime.format('YYYY-MM-DD'),
            name: value.name,
            description: value.discription,
            publish: value.isPublic ? 1 : 0,
        }

        const token = getToken()
        this.setState({ status: "loading" })
        trustStrategy(data, token).then(res => {
            this.setState({ status: "success" })
            if (res.success) {
                message.success("run strategy success")

            } else {
                message.error('run fail')
            }

        })
            .catch(err => {
                this.setState({ status: "fail" })
                message.error('run fail')
                console.log(err)
            })
    }

    onRunStrategy(value: { name: string; discription: string, isPublic: boolean }) {
        this.setState({ runStrategy: false })
        this.toRunStrategy(value)
    }
    //设置回测买卖点
    setSignal(alerts: { forEach: (arg0: (resItem: any) => void) => void; }) {
        let { stockDate } = this.state
        this.setState({ stockDate })
        stockDate = stockDate.map((dataItem: { date: string | number | void | Moment.Moment | Date | (string | number)[] | Moment.MomentInputObject | undefined; signal: string; }) => {
            const currentDate = Moment(dataItem.date).format('YYYY-MM-DD')
            let hasSignal = false
            let signal = ""
            alerts.forEach(resItem => {
                const alertDate = resItem.time.substring(0, 10)

                if (currentDate === alertDate) {
                    hasSignal = true

                    if (resItem.signal.type === 1) {
                        signal = 'buy'
                    } else {
                        signal = 'sell'
                    }
                }
            })
            if (hasSignal) {
                dataItem.signal = signal
                return dataItem
            } else {
                delete dataItem.signal
                return dataItem
            }
        })
        this.setState({ stockDate })
        return stockDate
    }

    //添加函数、策略、托管
    showDialog(dialog: string) {
        this.setState({ [dialog]: true });
    }

    //隐藏对话框
    hideDialog(dialog: string) {
        this.setState({ [dialog]: false });
    }
    //输入参数名称
    inputParamName(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        let { paramList } = this.state
        paramList[index].name = e.target.value
        this.setState({ paramList })
    }
    //输入名称说明
    inputDiscrib(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        let { paramList } = this.state
        paramList[index].discibe = e.target.value
        this.setState({ paramList })
    }
    //选择参数类型
    selectParamType(e: string, index: number) {
        let { paramList } = this.state
        paramList[index].type = Number(e)
        this.setState({ paramList })
    }
    //输入默认值
    inputDefaultValue(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        let { paramList } = this.state
        paramList[index].defaultValue = e.target.value
        this.setState({ paramList })
    }
    //删除参数操作
    deleteParam(index: number) {
        let { paramList } = this.state
        paramList = paramList.filter((item, itemIndex) => {
            return index !== itemIndex
        })
        this.setState({ paramList }, () => {
            this.addAllParams()
        })
    }

    //点击确认
    addAllParams() {
        let { paramList, code } = this.state
        // if (paramList.length === 0) {
        //     message.error('请添加参数~')
        //     return
        // }
        let isWriteAll = true
        let codeString = "//======此区域请勿编辑=========//\n"
        paramList.forEach(item => {
            if (item.name === "" || item.defaultValue === "") {
                message.error('参数需输入完整~')
                isWriteAll = false
                return
            }
            let type = ""
            if (item.type === 0) {
                type = 'float'
            } else if (item.type === 1) {
                type = 'int'
            } else if (item.type === 2) {
                type = 'string'
            }
            let code = 'param ' + type + ' ' + item.name + '={' + item.name + '}\n'
            codeString = codeString + code
        })
        if (!isWriteAll) {
            return
        }
        codeString = codeString + '//==========================//\n'

        if (code.indexOf('//==========================//\n') > 0) {
            let arr = code.split('//==========================//\n')
            if (arr.length > 1) {
                codeString = codeString + arr[1]
            }
        } else {
            codeString = codeString + code
        }
        this.setState({ code: codeString })
    }

    //添加一行参数
    addOneParam() {
        let obj = {
            name: "",
            discibe: "",
            type: 0,
            defaultValue: ""
        }
        let { paramList } = this.state
        paramList.push(obj)
        this.setState({ paramList })
    }

    //切换周期
    periodCallback(e: { title: string, value: string, period: number }) {
        const id = this.state.stockCode
        this.onGetKline(id, e.period)
        this.setState({ period: e.period })
    }
    //K线图数据
    onGetKline(prod_code: string, period: number) {
        getKline({ prod_code, period }).then(res => {
            if (res.data) {
                let data = res.data.candle[prod_code]
                data = changeNumber(data, 2)
                this.setState({ stockDate: data })
            }
        })
    }
    //股票行情数据
    onGetQuote(code: string) {
        getQuote({ code }).then(res => {
            this.setState({ quote: res[0] })
        })
    }

    //插入函数
    funcInsert(value: string) {
        this.setState({ fncDialog: false, code: this.state.code + value + '\n' })
    }

    //插入策略
    straInsert(express: string) {
        this.setState({ straDialog: false, code: express + '\n' })
    }
    //选择回测时间
    onChangeDate(e1: any[], e2: any) {
        const beginTime = e1[0]
        const endTime = e1[1]
        this.setState({ beginTime, endTime })
    }
    handleData(time: any) {
        if (!time) {
            return false
        } else {
            // 大于当前日期不能选 time > moment()
            // 小于当前日期不能选 time < moment().subtract(1, "days")
            // 只能选前7后7 time < moment().subtract(7, "days") || time > moment().add(7, 'd')
            return time > Moment()
        }
    }

    //切换股票
    changeStockCode(item: { prod_code: string; }) {
        this.onGetKline(item.prod_code, this.state.period)
        this.onGetQuote(item.prod_code)
        this.setState({ stockCode: item.prod_code })
    }

    render() {
        const { status, theme, themeList, paramList, compileInfo, strategyDiscibe, strategyTitle, quote, stockDate, stockCode, beginTime, endTime } = this.state
        return (
            <div className="intelli-wrapper">
                {status === 'loading' ? <Loading /> : null}
                <AddFuncDialog visible={this.state.fncDialog} onCancel={this.hideDialog.bind(this)} onInsert={this.funcInsert.bind(this)} />
                <AddStrategyDialog visible={this.state.straDialog} onCancel={this.hideDialog.bind(this)} onInsert={this.straInsert.bind(this)} />
                <RunStrategyModel visible={this.state.runStrategy} onCancel={this.hideDialog.bind(this)} onRunStrategy={this.onRunStrategy.bind(this)} />
                <div className="header-link">
                    <span className="btn">Ai-Trade</span>
                    <span className="arrow">></span>
                    <span className="btn title">Intelli-Script</span>
                </div>
                <div className="intelli-body">
                    <div className="edit-code-wrapper">
                        <div className="edit-code-title">
                            Intelli-Script Editor
                        </div>
                        <div className="select-theme">
                            <span className="title-text">Name：</span>
                            <input placeholder="MACD scross" onChange={(e) => this.setState({ strategyTitle: e.target.value })} value={strategyTitle} />
                            <span className="title-text">Theme：</span>
                            <Select value={theme} onChange={this.selectTheme.bind(this)} style={{ width: 150 }}>
                                {themeList.map((item, index) => {
                                    return (
                                        <Option value={item} key={index}>{item}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                        <div className="descirbtion">
                            <span className="text">Discription:</span>
                            <input type="text" value={strategyDiscibe} onChange={(e) => this.setState({ strategyDiscibe: e.target.value })} />
                        </div>
                        <div className="code-mirror-wrapper">
                            <CodeMirror
                                height='450px'
                                value={this.state.code}
                                onChange={this.editorChange.bind(this)}
                                onFocus={this.editorFocus.bind(this)}
                                options={{
                                    theme: this.state.theme,
                                    keyMap: 'sublime',
                                    mode: 'jsx',
                                    readOnly: this.state.strategy_type === 'build' ? 'nocursor' : false
                                }}
                            />
                        </div>
                        <div className="operate-btn">
                            <span onClick={() => this.onCompile()}>Compile</span>
                            <span onClick={() => this.saveStrategy()}>Save</span>
                            <span onClick={() => { this.showDialog('fncDialog') }} >Add Funtion</span>
                            <span onClick={() => { this.showDialog('straDialog') }}>Import Strategy</span>
                        </div>
                        <div className="info-log" dangerouslySetInnerHTML={{ __html: compileInfo }}>
                        </div>
                        <div className="param-list-wrapper">
                            <div className="param-head">
                                <span style={{ color: '#fff' }}>Parameter List</span>
                                <div>
                                    <span className="btn" onClick={this.addOneParam.bind(this)}>Add</span>
                                    <span className="btn" onClick={this.addAllParams.bind(this)}>Confirm</span>
                                </div>
                            </div>
                            <div className="param-names">
                                <span>name</span>
                                <span>description</span>
                                <span>type</span>
                                <span>default</span>
                                <span>operation</span>
                            </div>
                            <div className="param-list">
                                {paramList.map((item, index) => {
                                    let type = item.type
                                    let typeValue = ""
                                    if (type === 0) {
                                        typeValue = 'float'
                                    } else if (type === 1) {
                                        typeValue = 'int'
                                    } else if (type === 2) {
                                        typeValue = 'string'
                                    }
                                    return (
                                        <div className="param-names" key={index}>
                                            <div className="select-params">
                                                <input type="text" value={item.name} onChange={(e) => this.inputParamName(e, index)} />
                                            </div>
                                            <div className="select-params">
                                                <input type="text" value={item.discibe} onChange={(e) => this.inputDiscrib(e, index)} />
                                            </div>
                                            <div className="select-params">
                                                <Select style={{ width: '100%' }} value={typeValue} onChange={(e: string) => this.selectParamType(e, index)}>
                                                    <Option value={'0'} >float</Option>
                                                    <Option value={'1'} >int</Option>
                                                </Select>
                                            </div>
                                            <div className="select-params">
                                                <input type={item.type === 2 ? "text" : "number"} value={item.defaultValue} onChange={(e) => this.inputDefaultValue(e, index)} />
                                            </div>
                                            <div className="select-params">
                                                <span className="delete" onClick={this.deleteParam.bind(this, index)}>delete</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="stock-chart-wrapper">
                        <TradeRoomChart
                            data={stockDate}
                            width={800}
                            height={700}
                            minuteData={minuteData}  //可根据股票或者外汇来设定
                            periodCallback={this.periodCallback.bind(this)} //周期回调
                            quote={quote}
                            isIntelliScript={true}
                            stockCode={stockCode}
                            changeStockCode={this.changeStockCode.bind(this)}
                        />
                        <div className="backtest-deploy">
                            <div>
                                <span className="title">Backtest Date：</span>
                                <RangePicker onChange={this.onChangeDate.bind(this)}
                                    defaultValue={[beginTime, endTime]}
                                    format={'YYYY-MM-DD'}
                                    disabledDate={this.handleData.bind(this)}
                                />
                            </div>
                            <div className="btn-wrapper">
                                <span className="backtest btn" onClick={this.toBackTest.bind(this)}>Backtest</span>
                                <span className="backtest btn" onClick={() => { this.showDialog('runStrategy') }}>Run Strategy</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div >
        )
    }
}