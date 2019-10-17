import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types';
import TradingChart from '../tradingchart/tradingchart'
import Service from '../../utils/server'
import { searchStcok } from '../../service/serivce'

import { post, tick_size, optional } from '../../utils/utils'
import '../tradingroom/tradingroom.css'
import lodash from 'lodash';
import { SaveChartAsImage } from "react-stockcharts/lib/helper";
import { default as Drag } from '../../utils/drag';
import { Tooltip, Modal, Tabs, Select, Checkbox, Slider, message, Input, Button } from 'antd';
import emitter from '../../utils/events';
// import {WS, DataService} from '../../utils/SocketService'
import * as indicatorMap from "react-stockcharts/lib/indicator";
// 保存和获取交互节点
import { saveInteractiveNodes, getInteractiveNodes } from "../customchart/utils/interactiveutils";
import { InteractiveYCoordinate, InteractiveText } from "react-stockcharts/lib/interactive";
import { getMorePropsForChart } from "react-stockcharts/lib/interactive/utils";
import { head, toObject } from "react-stockcharts/lib/utils";
import shortid from "shortid";
// import { format } from "d3-format";
import ColorPicker from "../colorpicker/colorpicker"
// 假数据
import { tsvParse, } from "d3-dsv";
import { timeParse } from "d3-time-format";
// 假数据

import heart_blue from '../../assets/images/ax.png'
import heart_red from '../../assets/images/axzx.png'

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const CandlestickSeriesOptions = {};
const lineColor = '#4b8fdf';  // 分时线颜色
const onlyOneIndicator = ['bollingerBand', 'sar', 'volumeProfile'];  // 仅显示一次的指标

// 默认指标名称的映射
const defaultOptionsForComputationMap = {
    atr: 'ATR',
    bollingerBand: 'BollingerBand',
    change: 'Change',
    compare: 'Compare',
    ema: 'EMA',
    elderImpulse: 'ElderImpulse',
    elderRay: 'ElderRay',
    // forceIndex:'ForceIndex',
    stochasticOscillator: 'FullStochasticOscillator',
    heikinAshi: 'heikinAshi',
    kagi: 'kagi',
    macd: 'MACD',
    pointAndFigure: 'PointAndFigure',
    rsi: 'RSI',
    renko: 'Renko',
    sar: 'SAR',
    sma: 'SMA',
    // smoothedForceIndex:'SmoothedForceIndex',
    forceIndex: 'SmoothedForceIndex',
    tma: 'TMA',
    wma: 'WMA',
    kdj: 'KDJ'
};

// 指标提示工具的映射
const tooltipMap = {
    macd: 'MACDTooltip',
    atr: 'SingleValueTooltip',
    bollingerBand: 'BollingerBandTooltip',
    rsi: 'RSITooltip',
    elderRay: 'SingleValueTooltip',
    forceIndex: 'SingleValueTooltip',
    sar: 'SingleValueTooltip',
    stochasticOscillator: 'StochasticTooltip'
};

// 假数据
function parseData(parse) {
    return function (d) {
        d.date = parse(d.date);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;

        return d;
    };
}

const parseDate = timeParse("%Y-%m-%d");
// 假数据

export function getData() {
    const promiseMSFT = fetch("http://192.168.1.150:8085/")
        .then(response => response.text())
        .then(data => tsvParse(data, parseData(parseDate)))
    return promiseMSFT;
}

// 图形种类数据
const candleData = [
    { title: 'candle', fonts: 'iconfont icon-candles' },
    { title: 'line', fonts: 'iconfont icon-line' },
    { title: 'area', fonts: 'iconfont icon-area' },
    // {title:'bars',fonts:'iconfont icon-area'},
];

// 指标列表的数据
const indicatorData = [
    { title: 'MACD', value: 'macd', type: 'indicator' },
    { title: 'ATR', value: 'atr', type: 'indicator' },
    { title: 'BOLL', value: 'bollingerBand', type: 'indicator' },
    { title: 'Elder Ray', value: 'elderRay', type: 'indicator' },
    { title: 'Force Index', value: 'forceIndex', type: 'indicator' },
    { title: 'EMA', value: 'ema', type: 'ma' },
    { title: 'SMA', value: 'sma', type: 'ma' },
    { title: 'TMA', value: 'tma', type: 'ma' },
    { title: 'WMA', value: 'wma', type: 'ma' },
    { title: 'RSI', value: 'rsi', type: 'indicator' },
    { title: 'SAR', value: 'sar', type: 'indicator' },
    { title: 'Stochastic', value: 'stochasticOscillator', type: 'indicator' },
    { title: 'Vol Profile', value: 'volumeProfile', type: 'indicator' },
];

// 画图工具列表的数据
const drawToolList = [
    { title: 'TrendLine', fonts: 'iconfont icon-TrendLine' },
    { title: 'FibonacciRetracement', fonts: 'iconfont icon-FibonacciRetracement' },
    { title: 'EquidistantChannel', fonts: 'iconfont icon-EquidistantChannel' },
    { title: 'StandardDeviationChannel', fonts: 'iconfont icon-StandardDeviationCha' },
    { title: 'GannFan', fonts: 'iconfont icon-GannFan' },
    { title: 'InteractiveText', fonts: 'iconfont icon-InteractiveText' },
    { title: 'InteractiveYCoordinate', fonts: 'iconfont icon-InteractiveYCoordina' },
    { title: 'save', fonts: 'iconfont icon-save' },
];

// 画图工具种类数组
const drawTypeArr = [
    "TrendLine",
    "FibonacciRetracement",
    "EquidistantChannel",
    'StandardDeviationChannel',
    'GannFan',
    'InteractiveText',
    "InteractiveYCoordinate"
];

const strokeDashArray = [
    "Solid",
    "ShortDash",
    "ShortDot",
    "ShortDashDot",
    "ShortDashDotDot",
    "Dot",
    "Dash",
    "LongDash",
    "DashDot",
    "LongDashDot",
    "LongDashDotDot"
];

function round(number, precision = 0) {
    const d = Math.pow(10, precision);
    return Math.round(number * d) / d;
}

// const minuteData=[
//     {title:'1 minute',value:'1 m',period:'M1'},
//     {title:'3 minute',value:'3 m',period:'M3'},
//     {title:'5 minute',value:'5 m',period:'M5'},
//     {title:'15 minute',value:'15 m',period:'M15'},
//     {title:'30 minute',value:'30m',period:'M30'},
//     {title:'1 Hour',value:'1 H',period:'H1'},
//     {title:'4 Hour',value:'4 H',period:'H4'},
//     {title:'1 Day',value:'1 D',period:'D1'},
//     {title:'7 Day',value:'7 D',period:'D7'},
//     {title:'1 Month',value:'1 M',period:'1M'},
// ];

const mouseTypeArr = [
    { title: 'crosshair', fontName: 'cross' },
    { title: 'default', fontName: 'arrow' },
    { title: 'eraser', fontName: 'eraser' },
];

class TradeRoomChart extends Component {
    constructor(props) {
        super(props);
        this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
        this.getInteractiveNodes = getInteractiveNodes.bind(this);
        this.onDrawCompleteChart = this.onDrawCompleteChart.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.onDrawDelete = this.onDrawDelete.bind(this);
        this.onDragComplete = this.onDragComplete.bind(this);
        this.handleChoosePosition = this.handleChoosePosition.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.getInteractiveNode = this.getInteractiveNode.bind(this);
        // this.handleSearchStock = this.handleSearchStock.bind(this);
        // this.handleSelectStock = this.handleSelectStock.bind(this);
        // this.dataService = new DataService(WS.EX.HITBTC);

        let drawObj = {};
        drawTypeArr.forEach((item) => {
            drawObj[item] = {
                enable: false,
                data_1: []
            }
        });

        this.state = {
            isFavorite: false,
            favorite_id: '',
            tradeData: '',
            tradeCode: { symbol: 'BTCUSD', currency: 'BTC/USD', market: 'HitBTC' },
            YAxisValueLength: 7,
            realData: [], //图形K线数据
            ma: {
                sma: [{ windowSize: 10 }, { windowSize: 20 }, { windowSize: 30 }]
            },  // 均线数据
            ZoomAndPan: {},  // 缩放及锚点设置
            chart: {
                CandlestickSeries: {
                    GroupTooltip: {
                        onClick: (e) => { this.showModal('maSetting', [e.type, e.maId]); }
                    }
                },  // 蜡烛图选项
                volume: {},  // 成交量图选项
                calculatorObj: {},  // 指标选项
            },
            settingObj: {
                CurrentCoordinate: true,
                HoverTooltip: true,
                CandleEdge: true,
                VolEdge: true,
            },
            chartType: 'candle',  // 图形类型
            toggleDrawBox: false,  // 切换画图工具
            toggleIndicatorBox: false,  // 切换指标下拉框
            selectedDraw: {},
            drawObj,  // 选择的画图图形
            mouseType: 'cross',
            candlesName: candleData[0].fonts,
            showCandles: false,
            showMinutes: false,
            showMouseType: false,
            minutesName: '1D',
            scoreData: { id: 'https://coincheckup.com/coins/' },
            stockList: [],
            stockListOption: [],
            period: 'D1',
            lastDisabledDate: '',
            searchText: "",
            searchList: [],
        }
    }
    getChildContext() {
        return {
            tradingRoomThis: this
        };
    }
    render() {
        let width = this.props.width;
        let height = this.props.height;
        let CandlestickSeries = this.state.chart.CandlestickSeries;
        let YAxis = CandlestickSeries.YAxis ? CandlestickSeries.YAxis : null;
        let YAxisValue = this.state.YAxisValueLength * 10;
        let margin = {
            left: YAxis && YAxis.left ? YAxisValue : 40,
            right: YAxis ? YAxis.right ? YAxisValue : 40 : YAxisValue,
            top: 10,
            bottom: 30
        };
        let { intl, minuteData, quote } = this.props;
        let upColor = intl.formatMessage({ id: 'upColor', defaultMessage: '#2be594' });
        let downColor = intl.formatMessage({ id: 'downColor', defaultMessage: '#ff6060' });
        let chartType = intl.formatMessage({ id: 'chartType', defaultMessage: 'chartType' });
        let chartPeriod = intl.formatMessage({ id: 'chartPeriod', defaultMessage: 'period' });
        let AddIndicator = intl.formatMessage({ id: 'AddIndicator', defaultMessage: 'Add Indicator' });
        let draw = intl.formatMessage({ id: 'draw', defaultMessage: 'draw' });
        let mouseType = intl.formatMessage({ id: 'mouseType', defaultMessage: 'mouseType' });
        let setting = intl.formatMessage({ id: 'setting', defaultMessage: 'setting' });
        let symbol = intl.formatMessage({ id: 'Symbol', defaultMessage: 'symbol' });
        let last = intl.formatMessage({ id: 'last', defaultMessage: 'last' });
        let change = intl.formatMessage({ id: 'Indexchange', defaultMessage: 'change' });

        let hasOptional = false

        if (this.props.showOptional && this.props.optionalList && this.props.code) {
            this.props.optionalList.forEach(item => {
                if (item.symbol === this.props.code) {
                    hasOptional = true
                }
            })
        }

        return (

            <div style={{ display: 'flex' }}>
                <div style={{ wdith: width, position: 'relative', background: '#282D33' }}>
                    <div className="trading_chart_header" style={{ flexDirection: width > 600 ? 'row' : 'column', alignItems: width > 600 ? 'center' : 'flex-start', padding: ' 0 10px' }}>
                        <div className="trading_chart_realData">
                            {
                                this.props.isIntelliScript !== undefined && this.props.isIntelliScript === true &&
                                <div className="input-wrapper">
                                    <input className="input"
                                        placeholder={this.props.stockCode}
                                        onChange={this.onSearchStock.bind(this)}
                                        value={this.state.searchText}
                                    />
                                    {this.state.searchList.length > 0 ?
                                        <ul className="stock-list">
                                            {this.state.searchList.map((item, index) => {
                                                return (
                                                    <li key={index} onClick={this.changeCode.bind(this, item)}>

                                                        <span>{item.prod_code}</span>
                                                    </li>
                                                )
                                            })}
                                        </ul> : null
                                    }

                                </div>
                            }
                            {this.props.showOptional ?
                                <span style={{ cursor: 'pointer' }}>
                                    {hasOptional ?
                                        <span style={{ color: "#fff", marginRight: 5, display: 'flex', alignItems: "center" }} onClick={() => this.props.deleteOptional()}><img style={{ width: 22 }} src={heart_red} alt="" /></span> :
                                        <span style={{ color: '#fff', marginRight: 5, display: 'flex', alignItems: "center" }} onClick={() => this.props.addOptional()}><img style={{ width: 22 }} src={heart_blue} alt="" /></span>
                                    }

                                </span>
                                : null
                            }

                            <Tooltip placement="topRight" title={symbol}>
                                <span className="trading_chart_symbols">{quote.prod_code}({quote.prod_name})</span>
                            </Tooltip>
                            <Tooltip placement="topRight" title={last}>
                                <span className="tradeing_chart_change" style={{ color: quote.px_change_rate >= 0 ? upColor : downColor, padding: '0 10px' }}>{quote.last_px ? quote.last_px.toFixed(2) : '--'}</span>
                            </Tooltip>
                            <Tooltip placement="topRight" title={change}>
                                <span className="tradeing_chart_change_rate" style={{ color: quote.px_change_rate >= 0 ? upColor : downColor }}>{quote.px_change_rate === 0 || quote.px_change_rate ? quote.px_change_rate.toFixed(2) : '--'}%</span>
                            </Tooltip>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ background: '#22272b', width: 30, height: 30, marginRight: 2, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: "center", justifyContent: "center" }} >
                                <Tooltip placement="topRight" title={chartType}>
                                    <i className={this.state.candlesName}
                                        style={{ fontSize: 30, width: 30, height: 30, lineHeight: '30px', textAlign: "center", backgroundColor: this.state.showCandles ? '#0098FD' : '#22272B', color: this.state.showCandles ? '#FFF' : '#73838E' }}
                                        onClick={this.showCandles}
                                    >
                                    </i>
                                </Tooltip>
                                {this.state.showCandles ?
                                    <div>
                                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} onClick={() => {
                                            this.setState({
                                                showCandles: false
                                            })
                                        }}></div>
                                        <ul className="candlesUl">
                                            {candleData.map((item, i) =>
                                                <li key={item.title} onClick={() => this.changeCandles(item)}><i className={item.fonts}></i>{item.title}</li>
                                            )}
                                        </ul>
                                    </div>
                                    : null
                                }
                            </div>
                            <div className="minutesName" style={{ backgroundColor: this.state.showMinutes ? '#0098FD' : '#22272B', color: this.state.showMinutes ? '#FFF' : '#73838E' }}
                                onClick={() => this.showMinutes()}>
                                <Tooltip placement="topRight" title={chartPeriod}>
                                    {this.state.minutesName}
                                </Tooltip>
                                {this.state.showMinutes ?
                                    <div>
                                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} onClick={() => {
                                            this.setState({
                                                showMinutes: false
                                            })
                                        }} />
                                        <ul className="candlesUl">
                                            {minuteData.map((item, i) =>
                                                <li key={item.period} onClick={() => this.changeMinutes(item)}>{item.title}</li>
                                            )}
                                        </ul>
                                    </div>

                                    : null
                                }

                            </div>
                            <div className="tradeChartSpan"
                                style={{
                                    position: 'relative', backgroundColor: this.state.toggleIndicatorBox ? '#0098FD' : '#22272B',
                                    color: this.state.toggleIndicatorBox ? '#FFF' : '#73838E'
                                }}
                                onClick={() => this.setState({ toggleIndicatorBox: !this.state.toggleIndicatorBox, showCandles: false })}>
                                <Tooltip placement="topRight" title={AddIndicator}>
                                    <FormattedMessage defaultMessage="Add Indicator" id={'AddIndicator'} />
                                </Tooltip>
                                {this.state.toggleIndicatorBox ?
                                    <div>
                                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} onClick={() => {
                                            this.setState({
                                                toggleIndicatorBox: false
                                            })
                                        }} />
                                        <ul className="candlesUl">
                                            {indicatorData.map((item, i) =>
                                                <li onClick={() => { (item.type === 'ma') ? this.addMA(item.value) : this.addCalculator(item.value) }}
                                                    key={item.title}>
                                                    {item.title}
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    : null
                                }
                            </div>
                            <span className="tradeChartSpan"
                                style={{ backgroundColor: this.state.toggleDrawBox ? '#0098FD' : '#22272B', color: this.state.toggleDrawBox ? '#FFF' : '#73838E' }}
                                onClick={() => this.setState({ toggleDrawBox: !this.state.toggleDrawBox })}
                            >
                                <Tooltip placement="topRight" title={draw}>
                                    <FormattedMessage defaultMessage="Draw" id={'draw'} />
                                </Tooltip>
                            </span>
                            <div style={{ background: '#22272b', width: 30, height: 30, marginRight: 2, position: 'relative', cursor: 'pointer' }} >
                                <Tooltip placement="topRight" title={mouseType}>
                                    <i className={`iconfont icon-${this.state.mouseType}`}
                                        style={{ fontSize: 30, width: 30, height: 30, lineHeight: '30px', textAlign: "center", backgroundColor: this.state.showMouseType ? '#0098FD' : '#22272B', color: this.state.showMouseType ? '#FFF' : '#73838E' }}
                                        onClick={this.showMouseType}
                                    >
                                    </i>
                                </Tooltip>
                                {
                                    this.state.showMouseType ?
                                        <div>
                                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}
                                                onClick={() => { this.setState({ showMouseType: false }) }}
                                            >
                                            </div>
                                            <ul className="candlesUl" style={{ transform: 'translateX(-100%)' }}>
                                                {
                                                    mouseTypeArr.map((item, i) =>
                                                        <li key={item.title} onClick={() => this.changeMouseType(item)}>
                                                            <i className={`iconfont icon-${item.fontName}`}></i>{item.title}
                                                        </li>
                                                    )}
                                            </ul>
                                        </div>
                                        : null
                                }
                            </div>


                            <div
                                style={{ width: 30, height: 30, backgroundColor: (this.state.modalType === 'setting' && this.state.visible) ? '#0098FD' : '#22272B' }}
                                onClick={() => { this.showModal('setting') }}
                            >
                                <Tooltip placement="topRight" title={setting}>
                                    <i className="iconfont icon-settings"
                                        style={{ width: 30, height: 30, lineHeight: '30px', textAlign: "center", fontSize: 30, color: '#73838E ' + (this.state.modalType === 'setting' && this.state.visible) ? '#FFF' : '#73838E' }}
                                    ></i>
                                </Tooltip>
                            </div>
                        </div>

                    </div>
                    <div id="trading_chart" className="trading_chart"
                        ref={(node) => this.trading_chart = node}
                        style={{ width: width + 'px', height: height + 'px', backgroundColor: '#22272B', margin: 'auto' }}>
                        {
                            this.state.realData.length > 0 ?
                                <TradingChart data={this.state.realData}
                                    width={width}
                                    height={height}
                                    margin={margin}
                                    tradeCode={this.state.tradeCode}
                                    minutesName={this.state.minutesName}
                                    ZoomAndPan={this.state.ZoomAndPan}
                                    settingObj={this.state.settingObj}
                                    chartType={this.state.chartType}
                                    ma={this.state.ma}
                                    drawObj={this.state.drawObj}
                                    chart={this.state.chart}
                                    period={this.state.period}
                                />
                                : null
                        }
                        <ul id="drawBox" style={{ display: this.state.toggleDrawBox ? 'block' : 'none' }}>
                            {
                                drawToolList.map((item, i) =>
                                    <li className="draw-tool-list" key={item.title}
                                        style={{ backgroundColor: (item.title === 'save') ? '#2c3339' : this.state.drawObj[item.title].enable ? '#0098FD' : '#2c3339' }}
                                        onClick={() => (item.title === 'save') ? SaveChartAsImage.saveChartAsImage(document.body) : this.drawStart(item.title)}>
                                        <Tooltip placement="right" title={intl.formatMessage({ id: item.title, defaultMessage: item.title })}>
                                            <i className={item.fonts}
                                                style={{ cursor: 'pointer', color: (item.title === 'save') ? '#73838E' : this.state.drawObj[item.title].enable ? '#FFF' : '#73838E', }}
                                            />
                                        </Tooltip>
                                    </li>
                                )
                            }
                        </ul>
                        <div id="drawSettingBox" style={{ display: lodash.isEmpty(this.state.selectedDraw) ? 'none' : 'block' }}>
                            {
                                this.renderDrawSettingBox()
                            }
                        </div>
                        {
                            this.state.realData.length > 0 ?
                                <div className="waterMark">
                                    {/*<img src={require("../../images/watermark.png")} alt="Charts By BitStation"/>*/}
                                </div> : null
                        }
                    </div>
                </div>
                {
                    this.renderModal()
                }
            </div>
        );
    }
    UNSAFE_componentWillReceiveProps(nextProps) {

        if (nextProps.data) {
            // console.log(nextProps.data)
            this.setState({
                realData: lodash.cloneDeep(nextProps.data)
            })
        }
        if (nextProps.alert !== undefined && nextProps.alert !== null) {
            // this.indexRealList(this.state.tradeCode,this.state.period,null,nextProps.alert.alerts);
        }
    }
    componentDidMount() {

        let { data } = this.props
        this.setState({
            realData: data
        })
        // 真数据
        // this.realScore(tradeCode)
        // this.indexRealList(tradeCode,minuteData[7].period);
        // this.realTop(tradeCode)
        window.addEventListener('resize', this.update);
        // emitter.addListener('tradeCode', this.tradeCodeEventEmitter)
        // emitter.addListener("changeOptional",this.changeOptional)
        // emitter.addListener("showOptimal",this.showOptimalFunc)


        new Drag('#drawBox', "#trading_chart"); // 拖动
        new Drag('#drawSettingBox', "#trading_chart"); // 拖动

        // 选中画图图形后监听 del按键 删除
        document.addEventListener("keyup", this.onKeyPress);
        // 默认显示一个macd
        this.addCalculator('macd');
        try {
            let chartSettingStr = localStorage.getItem('chartSetting');
            let chartSetting = chartSettingStr && JSON.parse(chartSettingStr);
            if (chartSetting) {
                let { ma, ZoomAndPan, chart, settingObj, chartType, selectedDraw, drawObj, mouseType } = chartSettingStr && JSON.parse(chartSettingStr);
                chart.CandlestickSeries.GroupTooltip.onClick = (e) => { this.showModal('maSetting', [e.type, e.maId]); };
                let calculatorObj = chart.calculatorObj;
                for (let type in calculatorObj) {
                    // 仅显示一次的指标
                    if (onlyOneIndicator.includes(type)) {
                        let tooltipClickObj = {
                            [tooltipMap[type]]: {
                                onClick: () => { this.showModal(`${type}Setting`, [type, 0]) }
                            }
                        };
                        calculatorObj[type][0] = lodash.merge({}, calculatorObj[type][0], tooltipClickObj);
                    } else {
                        // 可以显示多个的指标
                        calculatorObj[type].forEach((item, i) => {
                            let tooltipClickObj = {
                                [tooltipMap[type]]: {
                                    onClick: () => { this.showModal(`${type}Setting`, [type, item.chartId]) }
                                }
                            };
                            calculatorObj[type][i] = lodash.merge({}, calculatorObj[type][i], tooltipClickObj);
                        });
                    }
                }
                this.setState({
                    ma,
                    ZoomAndPan,
                    chart,
                    settingObj,
                    chartType,
                    selectedDraw,
                    drawObj,
                    mouseType
                })
            }
        } catch (e) {
            this.resetChart();
            console.error(e)
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.update);
        document.removeEventListener("keyup", this.onKeyPress);
        // emitter.removeListener('tradeCode',this.tradeCodeEventEmitter);
        // emitter.removeListener('changeOptional',this.changeOptional);
        // emitter.removeListener('showOptimal',this.showOptimalFunc);
        this.timer && clearInterval(this.timer)
        this.setState = (state, callback) => {
            return;
        };
    }

    //股票搜索
    onSearchStock(e) {
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
    changeCode(item) {
        this.setState({ searchText: "", searchList: [] })
        this.props.changeStockCode(item)
    }
    //选择股票
    handleSelectStock(value) {
        this.setState({ tradeCode: { symbol: value.split('/').join(''), currency: value, market: 'HitBTC' } }, () => {
            this.props.changeTradeCode(this.state.tradeCode);
            // this.indexRealList(this.state.tradeCode,this.state.period);
        })
    }
    showCandles = () => {
        this.setState({
            showCandles: !this.state.showCandles,
            toggleIndicatorBox: false,
            showMinutes: false,
            showMouseType: false
        })
    }
    showMouseType = () => {
        this.setState({
            showMouseType: !this.state.showMouseType,
            toggleIndicatorBox: false,
            showMinutes: false,
            showCandles: false
        })
    }
    changeMouseType(item) {
        if (item.title !== 'eraser') {
            document.querySelector('.react-stockcharts-crosshair-cursor').style.cursor = item.title;
        } else {
            let eraser = require("../../assets/images/eraser.ico");
            document.querySelector('.react-stockcharts-crosshair-cursor').style.cursor = `url(${eraser}),crosshair`;
        }
        this.setState({
            showMinutes: false,
            showCandles: false,
            toggleIndicatorBox: false,
            showMouseType: false,
            mouseType: item.fontName
        })
    }
    realScore(tradeCode) {
        // let {tradeCode}=this.state
        post(Service.host + Service.realScore, { symbol: tradeCode.currency.split('/')[0] }).then((data) => {
            // console.log(data)
            if (data.data) {
                data.data.id = 'https://coincheckup.com/coins/' + data.data.id;
                this.setState({
                    scoreData: data.data
                })
            }

        })
    }
    changeCandles = (item) => {
        this.setState({
            candlesName: item.fonts,
            showCandles: false,
            showMinutes: false,
            showMouseType: false,
        });
        this.changeChartType(item.title)
    }
    showMinutes = () => {
        this.setState({
            showMinutes: !this.state.showMinutes,
            showCandles: false,
            toggleIndicatorBox: false,
            showMouseType: false,
        })
    }
    changeMinutes = (item) => {
        // let { tradeCode } = this.state;
        this.setState({
            showMinutes: false,
            minutesName: item.value,
            realData: [],
            period: item.period
        }, () => {
            if (this.props.changePeriod !== undefined) {
                this.props.changePeriod(this.state.period);
            }
            // this.indexRealList(tradeCode,item.period)
            this.props.periodCallback(item)
        });

    }

    update = () => {
        this.forceUpdate()
    }
    indexRealList(tradeCode, period, clearData, alert = null) {
        //K线数据
        // let period = period;
        let symbol = tradeCode.symbol;
        this.dataService.unsubscribeCandles();
        this.dataService.unsubscribeTicker();
        this.dataService.subscribeCandles(symbol, period, (response) => {
            //console.log('candles',response)
            if (response.symbol !== symbol || !response.data.length) {
                return;
            }

            let newData = [];
            response.data.forEach((item) => {
                newData.push({
                    close: +item.close,
                    high: +item.max,
                    low: +item.min,
                    open: +item.open,
                    date: new Date(item.timestamp),
                    volume: +item.volumeQuote
                })
            });
            // console.log(response.data);
            let realData = lodash.cloneDeep(this.state.realData);
            if (realData.length > 0 && newData.length > 0
                && realData[realData.length - 1].date.getTime() === newData[0].date.getTime()) {
                realData.pop();
            }
            if (realData.length > 0 && newData.length > 0 && newData[0].date.getTime() < realData[realData.length - 1].date.getTime()) {
                realData = [];
            }
            realData = realData.concat(newData);
            if (this.props.isIntelliScript === true && this.props.setTimeRange !== undefined) {
                if (this.state.lastDisabledDate === '' || new Date(realData[0].date).getTime() !== new Date(this.state.lastDisabledDate).getTime()) {
                    this.props.setTimeRange(realData[0].date);
                    this.setState({ lastDisabledDate: realData[0].date });
                }
            }
            if (alert !== null) {
                alert.forEach(alert => {
                    realData.forEach(data => {
                        if (alert.signal !== undefined) {
                            if (period === 'D1' || period === 'D7' || period === '1M') {
                                if (new Date(data.date).getTime() - 28800000 === new Date(alert.time).getTime()) {
                                    data.signal = alert.signal.type === 1 ? 'buy' : 'sell';
                                }
                            } else {
                                if (new Date(data.date).getTime() === new Date(alert.time).getTime()) {
                                    data.signal = alert.signal.type === 1 ? 'buy' : 'sell';
                                }
                            }
                        } else {
                            if (period === 'D1' || period === 'D7' || period === '1M') {
                                if (new Date(data.date).getTime() - 28800000 === new Date(alert.time).getTime()) {
                                    data.signal = alert.type === 1 ? 'buy' : 'sell';
                                }
                            } else {
                                if (new Date(data.date).getTime() === new Date(alert.time).getTime()) {
                                    data.signal = alert.type === 1 ? 'buy' : 'sell';
                                }
                            }
                        }
                    })
                })
            }
            // let tickSize;
            if (localStorage.getItem('TICK_SIZE')) { //如果有缓存
                // let data = JSON.parse(localStorage.getItem('TICK_SIZE'));
                // tickSize = data[symbol];
            } else {
                tick_size().then((data) => {
                    // tickSize = data[symbol];
                })
            }
            let YAxisValueLength = (+realData[0].close).length;

            this.setState({ realData, YAxisValueLength });
        });

        this.dataService.subscribeTicker(symbol, (data) => {
            // console.log('ticker',data)
            data.name = tradeCode.currency;
            this.setState({
                tradeData: data,
                px_change: (((data.last - data.open) / data.open) * 100).toFixed(2)
            })
        });

        /*post(Service.host+Service.realCandle, {symbols:symbol,fields:'open,close,min,max,volume,volumeQuote,timestamp'}).then((data)=>{
            if(data.data){
                let newData=conversionNum(data.data,symbol)
                let realData=newData[symbol]

                let YAxisValueLength = String(data.data[symbol][0].close).length;

                console.log('realData', realData)
                console.log('YAxisValueLength', YAxisValueLength)

                this.setState({ realData , YAxisValueLength })
            }
        });

         post(Service.host+Service.realTickerSingle,{symbols:symbol}).then((data)=>{
             let newData=conversionNum(data.data,symbol)
             if(localStorage.getItem('TICK_SIZE')){ //如果有缓存
                 let data=JSON.parse(localStorage.getItem('TICK_SIZE'))
                 let tick_size=data[symbol]
                 newData[0].name=tradeCode.currency
                 newData[0].last=newData[0].last.toFixed(tick_size)
                 newData[0].open=newData[0].open.toFixed(tick_size)
                 this.setState({
                     tradeData:newData[0],
                     px_change:(((newData[0].last - newData[0].open) / newData[0].open) * 100).toFixed(2)
                 })
             }else{
                 tick_size().then((data)=> {
                     let tick_size=data[symbol]
                     newData[0].name=tradeCode.currency
                     newData[0].last=newData[0].last.toFixed(tick_size)
                     newData[0].open=newData[0].open.toFixed(tick_size)
                     this.setState({
                         tradeData:newData[0],
                         px_change:(((newData[0].last - newData[0].open) / newData[0].open) * 100).toFixed(2)
                     })
                 })
             }
         })*/
        this.setState({
            isFavorite: false
        })
        //判断是否是自选
        this.isOptional(symbol)
    }

    isOptional(symbol) {
        //判断是否是自选
        if (localStorage.getItem('optional')) {
            let optional = JSON.parse(localStorage.getItem('optional'))
            let optionalData = Object.entries(optional)
            let myOptional = []
            optionalData.forEach((item) => {
                myOptional.push(...item[1])
            })
            if (myOptional.findIndex((v, i) => { return v.symbol === symbol }) > -1) {
                this.setState({
                    favorite_id: myOptional[myOptional.findIndex((v, i) => { return v.symbol === symbol })].id,
                    isFavorite: true
                })
            }
        }
    }
    addFavorite = () => {
        let { tradeCode, favorite_id } = this.state
        var param = {
            user_id: localStorage.getItem('user_id'),
            market: tradeCode.market,
            symbol: tradeCode.symbol,
            currency: tradeCode.currency
        }
        let { isFavorite } = this.state
        if (!isFavorite) { //添加
            post(Service.host + Service.marketFavoriteAdd, param).then((data) => {
                // console.log(data)
                if (data.success) {
                    this.setState({
                        isFavorite: true
                    })
                    message.success('添加成功');
                    optional().then(() => { }).then(() => {
                        this.isOptional(tradeCode.symbol)
                    });
                    emitter.emit("changeOptional", true)
                    emitter.emit("changeFavorite", true)
                } else {
                    message.success('添加失败');
                }
            })
        } else {
            post(Service.host + Service.marketFavoriteDelete, { user_id: localStorage.getItem('user_id'), id: favorite_id }).then((data) => {
                // console.log(data)
                if (data.success) {
                    this.setState({
                        isFavorite: false
                    })
                    message.success('删除成功');
                    optional().then(() => { })
                    emitter.emit("changeOptional", false)
                    emitter.emit("changeFavorite", false)
                } else {
                    message.success('删除失败');
                }
            })
        }
    }
    changeChartType(chartType) {
        let { chartType: oldChartType } = this.state;
        let chart = lodash.cloneDeep(this.state.chart);
        // 保存及还原图形参数
        CandlestickSeriesOptions[oldChartType] = lodash.cloneDeep(chart.CandlestickSeries);
        if (CandlestickSeriesOptions[chartType]) {
            chart.CandlestickSeries = CandlestickSeriesOptions[chartType]
        } else {
            chart.CandlestickSeries = {};
        }
        // 设置图形类型
        this.setState({
            chartType,
            chart
        }, this.saveChartSetting);
    }
    // 显示模态框
    showModal(modalType, clickArr) {
        if (modalType === 'setting') {
            this.setState({
                visible: true,
                modalType
            });
        } else {
            let { chart } = this.state;
            let { ma } = this.state;
            let calculatorObj = chart.calculatorObj;
            let indicatorName = clickArr[0];
            let indicatorId = clickArr[1];
            let defaultIndicatorOptions = indicatorMap.defaultOptionsForComputation[defaultOptionsForComputationMap[indicatorName]];
            let currentSettingIndicatorOptions = {};
            if (modalType === 'maSetting') {
                currentSettingIndicatorOptions = ma[indicatorName] && ma[indicatorName][indicatorId];
            } else {
                let indicatorIndex = calculatorObj[indicatorName].findIndex((item) => item.chartId === indicatorId);
                currentSettingIndicatorOptions = calculatorObj[indicatorName] &&
                    calculatorObj[indicatorName][indicatorIndex] &&
                    calculatorObj[indicatorName][indicatorIndex].options
            }
            let currentIndicatorOptions = lodash.merge({}, defaultIndicatorOptions, currentSettingIndicatorOptions);
            // console.log(currentIndicatorOptions)
            this.setState({
                visible: true,
                modalType,
                currentIndicatorOptions,
                clickArr
            });
        }

    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    renderModal() {
        let { modalType } = this.state;
        let tradingChartBackgroundColor = this.trading_chart && this.trading_chart.style.backgroundColor;
        let { intl } = this.props;
        let Style = intl.formatMessage({ id: 'Style', defaultMessage: 'Style' });
        let Scales = intl.formatMessage({ id: 'Scales', defaultMessage: 'Scales' });
        let Background = intl.formatMessage({ id: 'Background', defaultMessage: 'Background' });
        if (modalType === 'setting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    wrapClassName="settingModal"
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Tabs type="card">
                        <TabPane tab={Style} key="1">
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <span className="settingNameSpan">
                                        <FormattedMessage
                                            id='Style'
                                            defaultMessage='Style' />
                                    </span>
                                    <Select defaultValue="candle" style={{ width: 120 }}
                                        onChange={(value) => this.changeChartType(value)}
                                        value={this.state.chartType}
                                    >
                                        <Option value='candle'>
                                            <FormattedMessage
                                                id='Candles'
                                                defaultMessage='Candles' />
                                        </Option>
                                        <Option value='line'>
                                            <FormattedMessage
                                                id='Line'
                                                defaultMessage='Line' />
                                        </Option>
                                        <Option value='area'>
                                            <FormattedMessage
                                                id='Area'
                                                defaultMessage='Area' />
                                        </Option>
                                    </Select>
                                </div>
                            </div>
                            {
                                this.settingWithChartType()
                            }
                        </TabPane>
                        <TabPane tab={Scales} key="2">
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.chart.CandlestickSeries.YAxis && this.state.chart.CandlestickSeries.YAxis.left ? true : false}
                                        onChange={(e) => this.CheckYAxis('left', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='LeftAxis'
                                                defaultMessage='Left Axis' />
                                        </span>
                                    </Checkbox>
                                </div>
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.chart.CandlestickSeries.YAxis ? this.state.chart.CandlestickSeries.YAxis.right ? true : false : true}
                                        onChange={(e) => this.CheckYAxis('right', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='RightAxis'
                                                defaultMessage='Right Axis' />
                                        </span>
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.settingObj.CurrentCoordinate}
                                        onChange={(e) => this.changeSetting('CurrentCoordinate', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='CurrentCoordinate'
                                                defaultMessage='CurrentCoordinate' />
                                        </span>
                                    </Checkbox>
                                </div>
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.settingObj.HoverTooltip}
                                        onChange={(e) => this.changeSetting('HoverTooltip', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='HoverTooltip'
                                                defaultMessage='HoverTooltip' />
                                        </span>
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.settingObj.CandleEdge}
                                        onChange={(e) => this.changeSetting('CandleEdge', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='CandleEdge'
                                                defaultMessage='Candle Edge' />
                                        </span>
                                    </Checkbox>
                                </div>
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.settingObj.VolEdge}
                                        onChange={(e) => this.changeSetting('VolEdge', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='VolEdge'
                                                defaultMessage='Volume Edge' />
                                        </span>
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.ZoomAndPan.mouseMoveEvent === void (0) ? true : this.state.ZoomAndPan.mouseMoveEvent}
                                        onChange={(e) => this.CheckZoomAndPan('mouseMoveEvent', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='EnableMouseMove'
                                                defaultMessage='Enable MouseMove' />
                                        </span>
                                    </Checkbox>
                                </div>
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.ZoomAndPan.panEvent === void (0) ? true : this.state.ZoomAndPan.panEvent}
                                        onChange={(e) => this.CheckZoomAndPan('panEvent', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='EnablePan'
                                                defaultMessage='Enable Pan' />
                                        </span>
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.ZoomAndPan.zoomEvent === void (0) ? true : this.state.ZoomAndPan.zoomEvent}
                                        onChange={(e) => this.CheckZoomAndPan('zoomEvent', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='EnableZoom'
                                                defaultMessage='Enable Zoom' />
                                        </span>
                                    </Checkbox>
                                </div>
                                <div className="settingWithChartTypeCol">
                                    <Checkbox
                                        checked={this.state.ZoomAndPan.clamp === void (0) ? false : this.state.ZoomAndPan.clamp}
                                        onChange={(e) => this.CheckZoomAndPan('clamp', e.target.checked)}>
                                        <span className="settingNameCheckSpan">
                                            <FormattedMessage
                                                id='EnableClamp'
                                                defaultMessage='Enable Clamp' />
                                        </span>
                                    </Checkbox>
                                </div>
                            </div>
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <span>
                                        <FormattedMessage
                                            id='ZoomAnchor'
                                            defaultMessage='Zoom Anchor' />
                                    </span>
                                    <Select defaultValue="candle" style={{ width: 180, marginLeft: 20 }}
                                        onChange={(value) => this.CheckZoomAndPan('zoomAnchor', value)}
                                        value={this.state.ZoomAndPan.zoomAnchor ? this.state.ZoomAndPan.zoomAnchor : 'mouseBasedZoomAnchor'}
                                    >
                                        <Option value='mouseBasedZoomAnchor'>
                                            <FormattedMessage
                                                id='MousePosition'
                                                defaultMessage='Mouse Position' />
                                        </Option>
                                        <Option value='lastVisibleItemBasedZoomAnchor'>
                                            <FormattedMessage
                                                id='LastVisibleCandle'
                                                defaultMessage='Last Visible Candle' />
                                        </Option>
                                        <Option value='rightDomainBasedZoomAnchor'>
                                            <FormattedMessage
                                                id='RightExtremePoint'
                                                defaultMessage='Right Extreme Point' />
                                        </Option>
                                    </Select>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab={Background} key="3">
                            <div className="settingWithChartTypeRow">
                                <div className="settingWithChartTypeCol">
                                    <span className="settingNameSpan">
                                        <FormattedMessage
                                            id='Background'
                                            defaultMessage='Background' />
                                    </span>
                                    <ColorPicker
                                        showText={false}
                                        disableAlpha={true}
                                        color={tradingChartBackgroundColor ? tradingChartBackgroundColor : '#22272B'}
                                        onChange={(color) => this.trading_chart.style.backgroundColor = color.hex}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <div className="resetChartBox">
                        <Button style={{ backgroundColor: '#D9534F', color: '#FFF' }}
                            onClick={() => this.resetChart()}
                        >
                            <FormattedMessage
                                id='Defaults'
                                defaultMessage='Defaults' />
                        </Button>
                    </div>
                </Modal>
            )
        } else if (modalType === 'maSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for Moving Average</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Period</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text" style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.windowSize}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('windowSize', e.target.value)}
                                />
                            </div>
                        </div>
                        {/*<Select defaultValue="close" style={{ width: 200 }}
                                onChange={(value)=>this.changeMovingAverageType('movingAverageType',value)}
                                value={this.state.currentIndicatorOptions.movingAverageType}
                        >
                            <Option value='ema'>ema</Option>
                            <Option value='sma'>sma</Option>
                        </Select>*/}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Source</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => { this.changeCurrentIndicatorOptions('sourcePath', value) }}
                                    value={this.state.currentIndicatorOptions.sourcePath}
                                >
                                    <Option value='open'>open</Option>
                                    <Option value='high'>high</Option>
                                    <Option value='low'>low</Option>
                                    <Option value='close'>close</Option>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'macdSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for MACD</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Fast</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text" style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.fast}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('fast', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Slow</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.slow}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('slow', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Signal</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.signal}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('signal', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Source</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => { this.changeCurrentIndicatorOptions('sourcePath', value) }}
                                    value={this.state.currentIndicatorOptions.sourcePath}
                                >
                                    <Option value='open'>open</Option>
                                    <Option value='high'>high</Option>
                                    <Option value='low'>low</Option>
                                    <Option value='close'>close</Option>
                                </Select>
                            </div>
                        </div>

                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'atrSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for ATR</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Period</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text" style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.windowSize}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('windowSize', e.target.value)}
                                />
                            </div>
                        </div>
                        {/*<div style={{display:'flex',alignItems: 'center',marginBottom:15}}>
                            <div style={{flex:1,textAlign:'right',paddingRight:30,fontSize: 16,fontWeight: 'bold'}}>Source</div>
                            <div style={{flex:2}}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                        onChange={(value)=>{this.changeCurrentIndicatorOptions('sourcePath',value)}}
                                        value={this.state.currentIndicatorOptions.sourcePath}
                                >
                                    <Option value='open'>open</Option>
                                    <Option value='high'>high</Option>
                                    <Option value='low'>low</Option>
                                    <Option value='close'>close</Option>
                                </Select>
                            </div>
                        </div>*/}
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'bollingerBandSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for BollingerBand</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Period</div>
                            <div style={{ flex: 2 }}>
                                {/*<Input type="text" value={String(this.state.currentIndicatorOptions.fast)} style={{width:200}}/>*/}
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={String(this.state.currentIndicatorOptions.windowSize)}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('windowSize', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Multiplier</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={String(this.state.currentIndicatorOptions.multiplier)}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('multiplier', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>MA Type</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => this.changeCurrentIndicatorOptions('movingAverageType', value)}
                                    value={this.state.currentIndicatorOptions.movingAverageType}
                                >
                                    <Option value='ema'>ema</Option>
                                    <Option value='sma'>sma</Option>
                                </Select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Source</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => this.changeCurrentIndicatorOptions('sourcePath', value)}
                                    value={this.state.currentIndicatorOptions.sourcePath}
                                >
                                    <Option value='open'>open</Option>
                                    <Option value='high'>high</Option>
                                    <Option value='low'>low</Option>
                                    <Option value='close'>close</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'elderRaySetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for Elder Ray</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Period</div>
                            <div style={{ flex: 2 }}>
                                {/*<Input type="text" value={String(this.state.currentIndicatorOptions.fast)} style={{width:200}}/>*/}
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={String(this.state.currentIndicatorOptions.windowSize)}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('windowSize', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>MA Type</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => this.changeCurrentIndicatorOptions('movingAverageType', value)}
                                    value={this.state.currentIndicatorOptions.movingAverageType}
                                >
                                    <Option value='ema'>ema</Option>
                                    <Option value='sma'>sma</Option>
                                </Select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Source</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => this.changeCurrentIndicatorOptions('sourcePath', value)}
                                    value={this.state.currentIndicatorOptions.sourcePath}
                                >
                                    <Option value='open'>open</Option>
                                    <Option value='high'>high</Option>
                                    <Option value='low'>low</Option>
                                    <Option value='close'>close</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'forceIndexSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for Force Index</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Smoothing Period</div>
                            <div style={{ flex: 2 }}>
                                {/*<Input type="text" value={String(this.state.currentIndicatorOptions.fast)} style={{width:200}}/>*/}
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={String(this.state.currentIndicatorOptions.smoothingWindow)}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('smoothingWindow', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Smoothing Type</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => this.changeCurrentIndicatorOptions('smoothingType', value)}
                                    value={this.state.currentIndicatorOptions.smoothingType}
                                >
                                    <Option value='ema'>ema</Option>
                                    <Option value='sma'>sma</Option>
                                </Select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Source</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => this.changeCurrentIndicatorOptions('sourcePath', value)}
                                    value={this.state.currentIndicatorOptions.sourcePath}
                                >
                                    <Option value='open'>open</Option>
                                    <Option value='high'>high</Option>
                                    <Option value='low'>low</Option>
                                    <Option value='close'>close</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'rsiSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for RSI</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Period</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text" style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.windowSize}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('windowSize', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Source</div>
                            <div style={{ flex: 2 }}>
                                <Select defaultValue="close" style={{ width: 200 }}
                                    onChange={(value) => { this.changeCurrentIndicatorOptions('sourcePath', value) }}
                                    value={this.state.currentIndicatorOptions.sourcePath}
                                >
                                    <Option value='open'>open</Option>
                                    <Option value='high'>high</Option>
                                    <Option value='low'>low</Option>
                                    <Option value='close'>close</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'sarSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for RSI</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Acceleration Factor</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text" style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.accelerationFactor}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('accelerationFactor', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Max Acceleration Factor</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text" style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.maxAccelerationFactor}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('maxAccelerationFactor', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        } else if (modalType === 'stochasticOscillatorSetting') {
            return (
                <Modal
                    visible={this.state.visible}
                    style={styles.contentStyle}
                    mask={false}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 20 }}>Change Settings for Stochastic Oscillator</div>
                    <div style={{ paddingTop: 30, paddingBottom: 15, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>Period</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text" style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.windowSize}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('windowSize', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>K</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.kWindowSize}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('kWindowSize', e.target.value)}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
                            <div style={{ flex: 1, textAlign: 'right', paddingRight: 30, fontSize: 16, fontWeight: 'bold' }}>D</div>
                            <div style={{ flex: 2 }}>
                                <Input type="text"
                                    style={{ width: 200 }}
                                    value={this.state.currentIndicatorOptions.dWindowSize}
                                    onChange={(e) => this.changeCurrentIndicatorOptions('dWindowSize', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <div style={{ textAlign: 'right' }}>
                            <Button style={{ backgroundColor: '#D9534F', color: '#FFF', marginRight: 20 }}
                                onClick={() => this.removeChart()}
                            >
                                Remove this
                            </Button>
                            <Button style={{ backgroundColor: '#5CB85C', color: '#FFF' }}
                                onClick={() => this.changeChart()}
                            >
                                Change
                            </Button>
                        </div>
                    </div>
                </Modal>
            )
        }
    }
    // 切换蜡烛图颜色
    changeCandelesColor(type, direction, color) {
        let chart = lodash.cloneDeep(this.state.chart);
        if (!chart.CandlestickSeries[type]) {
            chart.CandlestickSeries[type] = {};
        }
        chart.CandlestickSeries[type][direction] = color;
        this.setState({
            chart
        }, this.saveChartSetting);
    }
    // 根据图形类型调整设置
    settingWithChartType() {
        let { chartType } = this.state
        let CandlestickSeries = this.state.chart.CandlestickSeries;
        let { intl } = this.props;
        let upColor = intl.formatMessage({ id: 'upColor', defaultMessage: '#2be594' });
        let downColor = intl.formatMessage({ id: 'downColor', defaultMessage: '#ff6060' });
        if (chartType === 'candle') {
            return (
                <div className="settingWithChartTypeBox">
                    <div className="settingWithChartTypeRow">
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='Candles'
                                    defaultMessage='Candles' />
                            </span>
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries.fill && CandlestickSeries.fill.upColor ? CandlestickSeries.fill.upColor : upColor}
                                onChange={(color) => this.changeCandelesColor('fill', 'upColor', color.hex)}
                            />
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries.fill && CandlestickSeries.fill.downColor ? CandlestickSeries.fill.downColor : downColor}
                                onChange={(color) => this.changeCandelesColor('fill', 'downColor', color.hex)}
                            />
                        </div>
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='Borders'
                                    defaultMessage='Borders' />
                            </span>
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries.stroke && CandlestickSeries.stroke.upColor ? CandlestickSeries.stroke.upColor : upColor}
                                onChange={(color) => this.changeCandelesColor('stroke', 'upColor', color.hex)}
                            />
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries.stroke && CandlestickSeries.stroke.downColor ? CandlestickSeries.stroke.downColor : downColor}
                                onChange={(color) => this.changeCandelesColor('stroke', 'downColor', color.hex)}
                            />
                        </div>
                    </div>
                    <div className="settingWithChartTypeRow">
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='Wicks'
                                    defaultMessage='Wicks' />
                            </span>
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries.wickStroke && CandlestickSeries.wickStroke.upColor ? CandlestickSeries.wickStroke.upColor : upColor}
                                onChange={(color) => this.changeCandelesColor('wickStroke', 'upColor', color.hex)}
                            />
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries.wickStroke && CandlestickSeries.wickStroke.downColor ? CandlestickSeries.wickStroke.downColor : downColor}
                                onChange={(color) => this.changeCandelesColor('wickStroke', 'downColor', color.hex)}
                            />
                        </div>
                    </div>
                </div>
            )
        } else if (chartType === 'line') {
            let CandlestickSeries = this.state.chart.CandlestickSeries;
            return (
                <div className="settingWithChartTypeBox">
                    <div className="settingWithChartTypeRow">
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='PriceSource'
                                    defaultMessage='Price Source' />
                            </span>
                            <Select defaultValue="close" style={{ width: 120 }}
                                onChange={(value) => this.changeLineYAccessor(value)}
                            >
                                <Option value='open'>
                                    <FormattedMessage
                                        id='Open'
                                        defaultMessage='Open' />
                                </Option>
                                <Option value='high'>
                                    <FormattedMessage
                                        id='High'
                                        defaultMessage='High' />
                                </Option>
                                <Option value='low'>
                                    <FormattedMessage
                                        id='Low'
                                        defaultMessage='Low' />
                                </Option>
                                <Option value='close'>
                                    <FormattedMessage
                                        id='CLose'
                                        defaultMessage='Close' />
                                </Option>
                                <Option value='HL'>
                                    <FormattedMessage
                                        id='HL'
                                        defaultMessage='(H+L)/2' />
                                </Option>
                                <Option value='HLC'>
                                    <FormattedMessage
                                        id='HLC'
                                        defaultMessage='(H+L+C)/3' />
                                </Option>
                                <Option value='OHLC'>
                                    <FormattedMessage
                                        id='OHLC'
                                        defaultMessage='(O+H+L+C)/4' />
                                </Option>
                            </Select>
                        </div>
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='strokeDash'
                                    defaultMessage='strokeDash' />
                            </span>
                            <Select defaultValue="Solid" style={{ width: 120 }}
                                onChange={(value) => this.changeLineOptions('strokeDasharray', value)}
                            >
                                <Option value='Solid'>
                                    <FormattedMessage
                                        id='Solid'
                                        defaultMessage='Solid' />
                                </Option>
                                <Option value='ShortDash'>
                                    <FormattedMessage
                                        id='ShortDash'
                                        defaultMessage='ShortDash' />
                                </Option>
                                <Option value='ShortDot'>
                                    <FormattedMessage
                                        id='ShortDot'
                                        defaultMessage='ShortDot' />
                                </Option>
                                <Option value='ShortDashDot'>
                                    <FormattedMessage
                                        id='ShortDashDot'
                                        defaultMessage='ShortDashDot' />
                                </Option>
                                <Option value='ShortDashDotDot'>
                                    <FormattedMessage
                                        id='ShortDashDotDot'
                                        defaultMessage='ShortDashDotDot' />
                                </Option>
                                <Option value='Dot'>
                                    <FormattedMessage
                                        id='Dot'
                                        defaultMessage='Dot' />
                                </Option>
                                <Option value='Dash'>
                                    <FormattedMessage
                                        id='Dash'
                                        defaultMessage='Dash' />
                                </Option>
                                <Option value='LongDash'>
                                    <FormattedMessage
                                        id='LongDash'
                                        defaultMessage='LongDash' />
                                </Option>
                                <Option value='DashDot'>
                                    <FormattedMessage
                                        id='DashDot'
                                        defaultMessage='DashDot' />
                                </Option>
                                <Option value='LongDashDot'>
                                    <FormattedMessage
                                        id='LongDashDot'
                                        defaultMessage='LongDashDot' />
                                </Option>
                                <Option value='LongDashDotDot'>
                                    <FormattedMessage
                                        id='LongDashDotDot'
                                        defaultMessage='LongDashDotDot' />
                                </Option>
                            </Select>
                        </div>
                    </div>
                    <div className="settingWithChartTypeRow">
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='LineColor'
                                    defaultMessage='Line Color' />
                            </span>
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries && CandlestickSeries.stroke ? CandlestickSeries.stroke : lineColor}
                                onChange={(color) => this.changeLineOptions('stroke', color.hex)}
                            />
                        </div>
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='LineWidth'
                                    defaultMessage='Line Width' />
                            </span>
                            <Slider style={{ width: 100 }} min={1} max={3} onChange={(value) => this.changeLineOptions('strokeWidth', value)} defaultValue={1} />
                        </div>
                    </div>
                </div>
            )
        } else if (chartType === 'area') {
            let CandlestickSeries = this.state.chart.CandlestickSeries;
            return (
                <div className="settingWithChartTypeBox">
                    <div className="settingWithChartTypeRow">
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='PriceSource'
                                    defaultMessage='Price Source' />
                            </span>
                            <Select defaultValue="close" style={{ width: 120 }}
                                onChange={(value) => this.changeLineYAccessor(value)}
                            >
                                <Option value='open'>
                                    <FormattedMessage
                                        id='Open'
                                        defaultMessage='Open' />
                                </Option>
                                <Option value='high'>
                                    <FormattedMessage
                                        id='High'
                                        defaultMessage='High' />
                                </Option>
                                <Option value='low'>
                                    <FormattedMessage
                                        id='Low'
                                        defaultMessage='Low' />
                                </Option>
                                <Option value='close'>
                                    <FormattedMessage
                                        id='CLose'
                                        defaultMessage='Close' />
                                </Option>
                                <Option value='HL'>
                                    <FormattedMessage
                                        id='HL'
                                        defaultMessage='(H+L)/2' />
                                </Option>
                                <Option value='HLC'>
                                    <FormattedMessage
                                        id='HLC'
                                        defaultMessage='(H+L+C)/3' />
                                </Option>
                                <Option value='OHLC'>
                                    <FormattedMessage
                                        id='OHLC'
                                        defaultMessage='(O+H+L+C)/4' />
                                </Option>
                            </Select>
                        </div>
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='strokeDash'
                                    defaultMessage='strokeDash' />
                            </span>
                            <Select defaultValue="Solid" style={{ width: 120 }}
                                onChange={(value) => this.changeLineOptions('strokeDasharray', value)}
                            >
                                <Option value='Solid'>
                                    <FormattedMessage
                                        id='Solid'
                                        defaultMessage='Solid' />
                                </Option>
                                <Option value='ShortDash'>
                                    <FormattedMessage
                                        id='ShortDash'
                                        defaultMessage='ShortDash' />
                                </Option>
                                <Option value='ShortDot'>
                                    <FormattedMessage
                                        id='ShortDot'
                                        defaultMessage='ShortDot' />
                                </Option>
                                <Option value='ShortDashDot'>
                                    <FormattedMessage
                                        id='ShortDashDot'
                                        defaultMessage='ShortDashDot' />
                                </Option>
                                <Option value='ShortDashDotDot'>
                                    <FormattedMessage
                                        id='ShortDashDotDot'
                                        defaultMessage='ShortDashDotDot' />
                                </Option>
                                <Option value='Dot'>
                                    <FormattedMessage
                                        id='Dot'
                                        defaultMessage='Dot' />
                                </Option>
                                <Option value='Dash'>
                                    <FormattedMessage
                                        id='Dash'
                                        defaultMessage='Dash' />
                                </Option>
                                <Option value='LongDash'>
                                    <FormattedMessage
                                        id='LongDash'
                                        defaultMessage='LongDash' />
                                </Option>
                                <Option value='DashDot'>
                                    <FormattedMessage
                                        id='DashDot'
                                        defaultMessage='DashDot' />
                                </Option>
                                <Option value='LongDashDot'>
                                    <FormattedMessage
                                        id='LongDashDot'
                                        defaultMessage='LongDashDot' />
                                </Option>
                                <Option value='LongDashDotDot'>
                                    <FormattedMessage
                                        id='LongDashDotDot'
                                        defaultMessage='LongDashDotDot' />
                                </Option>
                            </Select>
                        </div>
                    </div>
                    <div className="settingWithChartTypeRow">
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='LineColor'
                                    defaultMessage='Line Color' />
                            </span>
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={CandlestickSeries && CandlestickSeries.stroke ? CandlestickSeries.stroke : lineColor}
                                onChange={(color) => this.changeLineOptions('stroke', color.hex)}
                            />
                        </div>
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='LineWidth'
                                    defaultMessage='Line Width' />
                            </span>
                            <Slider style={{ width: 100 }} min={1} max={3} onChange={(value) => this.changeLineOptions('strokeWidth', value)} defaultValue={1} />
                        </div>
                    </div>
                    <div className="settingWithChartTypeRow">
                        <div className="settingWithChartTypeCol">
                            <span className="settingNameSpan">
                                <FormattedMessage
                                    id='FillArea'
                                    defaultMessage='Fill Area' />
                            </span>
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={CandlestickSeries && CandlestickSeries.fill ? CandlestickSeries.fill : lineColor}
                                opacity={1}
                                onChange={(color) => this.changeLineOptions('fill', color.hex, 'opacity', color.rgb.a)}
                            />
                        </div>
                    </div>
                </div>
            )
        }
    }
    // 修改LineYAccessor
    changeLineYAccessor(yAccessor) {
        switch (yAccessor) {
            case 'HL':
                yAccessor = (d) => (d.high + d.low) / 2;
                break;
            case 'HLC':
                yAccessor = (d) => (d.high + d.low + d.close) / 3;
                break;
            case 'OHLC':
                yAccessor = (d) => (d.open + d.high + d.low + d.close) / 4;
                break;
            default:
                break;
        }
        let chart = lodash.cloneDeep(this.state.chart);
        chart.CandlestickSeries.yAccessor = yAccessor;
        this.setState({
            chart
        }, this.saveChartSetting);
    }
    // 修改Line参数选项
    changeLineOptions(type, value, type2, value2) {
        let chart = lodash.cloneDeep(this.state.chart);
        chart.CandlestickSeries[type] = value;
        if (type2 && value2) {
            chart.CandlestickSeries[type2] = value2;
        }
        this.setState({
            chart
        }, this.saveChartSetting);
    }
    // 选择Y轴
    CheckYAxis(direction, value) {
        let chart = lodash.cloneDeep(this.state.chart);
        if (!chart.CandlestickSeries.YAxis) {
            chart.CandlestickSeries.YAxis = {};
        }
        if (value) {
            chart.CandlestickSeries.YAxis[direction] = {};
        } else {
            if (chart.CandlestickSeries.YAxis[direction]) {
                delete chart.CandlestickSeries.YAxis[direction]
            }
        }
        this.setState({
            chart
        }, this.saveChartSetting);
    }
    changeSetting(type, value) {
        let settingObj = lodash.cloneDeep(this.state.settingObj);
        settingObj[type] = value;
        this.setState({
            settingObj
        }, this.saveChartSetting);
    }
    CheckZoomAndPan(type, value) {
        let ZoomAndPan = lodash.cloneDeep(this.state.ZoomAndPan);
        ZoomAndPan[type] = value;
        this.setState({
            ZoomAndPan
        }, this.saveChartSetting);
    }
    // 恢复默认设置
    resetChart() {
        let chart = {
            CandlestickSeries: {
                GroupTooltip: {
                    onClick: (e) => { this.showModal('maSetting', [e.type, e.maId]); }
                }
            },
            volume: {},
            calculatorObj: {},
        };
        let ma = {
            sma: [{ windowSize: 10 }, { windowSize: 20 }, { windowSize: 30 }]
        };
        let drawObj = {};
        drawTypeArr.forEach((item) => {
            drawObj[item] = {
                enable: false,
                data_1: []
            }
        });
        this.trading_chart.style.backgroundColor = '#22272B';
        this.setState({
            ma,
            chart,
            chartType: 'candle',
            ZoomAndPan: {},
            mouseType: 'cross',
            drawObj,
            selectedDraw: {},
            settingObj: {
                CurrentCoordinate: true,
                HoverTooltip: true,
                CandleEdge: true,
                VolEdge: true,
            }
        }, () => this.addCalculator('macd'));
    }
    // 增加均线
    addMA(MAtype) {
        let ma = lodash.cloneDeep(this.state.ma);
        let maArr = ma[MAtype] || [];
        maArr.push({
            windowSize: 10
        });
        ma[MAtype] = maArr;
        this.setState({
            ma,
            toggleIndicatorBox: false
        }, this.saveChartSetting);
    }
    // 增加计算指标
    addCalculator(type) {
        let chart = lodash.cloneDeep(this.state.chart);
        let calculatorObj = chart.calculatorObj;
        // 仅显示一次的指标
        if (onlyOneIndicator.includes(type)) {
            if (!calculatorObj[type]) {
                calculatorObj[type] = [];
                let tooltipClickObj = {
                    [tooltipMap[type]]: {
                        onClick: () => { this.showModal(`${type}Setting`, [type, 0]) }
                    }
                };
                calculatorObj[type].push({
                    chartId: 0,
                    ...tooltipClickObj
                });
            } else {
                delete calculatorObj[type];  // 再次点击删除该指标
            }
        } else {
            // 可以显示多个的指标
            if (!calculatorObj[type]) calculatorObj[type] = [];
            let chartLength = calculatorObj[type].length;
            let tooltipClickObj = {
                [tooltipMap[type]]: { onClick: () => { this.showModal(`${type}Setting`, [type, chartLength]) } }
            };
            calculatorObj[type].push({
                chartId: chartLength,
                ...tooltipClickObj
            });
        }
        this.setState({
            chart,
            toggleIndicatorBox: false
        }, this.saveChartSetting);
    }
    // 修改当前指标选项
    changeCurrentIndicatorOptions(type, value) {
        let { currentIndicatorOptions } = this.state;
        currentIndicatorOptions[type] = value;
        // console.log(currentIndicatorOptions);
        this.setState({
            currentIndicatorOptions
        });
    }
    // 删除图形及均线
    removeChart() {
        let chart = lodash.cloneDeep(this.state.chart);
        let ma = lodash.cloneDeep(this.state.ma);
        let calculatorObj = chart.calculatorObj;
        let { clickArr, modalType } = this.state;
        let indicatorName = clickArr[0];
        let indicatorId = clickArr[1];
        if (modalType === 'maSetting') {
            ma[indicatorName] = ma[indicatorName].filter((item, i) => i !== indicatorId);
            if (ma[indicatorName].length === 0) {
                delete ma[indicatorName];
            }
            // console.log(ma)
        } else {
            calculatorObj[indicatorName] = calculatorObj[indicatorName].filter(item => item.chartId !== indicatorId);
            if (calculatorObj[indicatorName].length === 0) {
                delete calculatorObj[indicatorName];
            }
            // console.log(calculatorObj)
        }
        this.setState({
            chart,
            ma,
            visible: false
        }, this.saveChartSetting);
    }
    // 修改图形选项
    changeChart() {
        let { currentIndicatorOptions, clickArr } = this.state;
        let chart = lodash.cloneDeep(this.state.chart);
        let ma = lodash.cloneDeep(this.state.ma);
        let calculatorObj = chart.calculatorObj;
        let indicatorName = clickArr[0];
        let indicatorId = clickArr[1];
        let options = lodash.cloneDeep(currentIndicatorOptions);
        for (let key in options) {
            options[key] = Number.isNaN(+options[key]) ? options[key] : +options[key]
        }
        if (this.state.modalType === 'maSetting') {
            ma[indicatorName][indicatorId] = options;
            // console.log(ma)
        } else {
            let indicatorIndex = calculatorObj[indicatorName].findIndex((item) => item.chartId === indicatorId);
            calculatorObj[indicatorName][indicatorIndex].options = options;
            // console.log(calculatorObj)
        }
        this.setState({
            chart,
            ma,
            visible: false
        }, this.saveChartSetting);
    }
    // 开始画图
    drawStart(type) {
        let drawObj = lodash.cloneDeep(this.state.drawObj);
        if (drawObj[type].enable) {
            drawObj[type].enable = false;
        } else {
            for (let key in drawObj) {
                if (key === 'selectorEnable') continue;
                drawObj[key].enable = false;
            }
            drawObj[type].enable = true;
        }
        if (type === 'InteractiveYCoordinate' || type === 'InteractiveText') {
            drawObj.selectorEnable = true;
        } else {
            drawObj.selectorEnable = false;
        }
        if (this.state.mouseType === 'eraser') {
            document.querySelector('.react-stockcharts-crosshair-cursor').style.cursor = 'crosshair';
        }
        this.setState({
            drawObj,
            mouseType: (this.state.mouseType === 'eraser') ? 'cross' : this.state.mouseType
        }, this.saveChartSetting)
    }
    // 画图设置盒子
    renderDrawSettingBox() {
        let { selectedDraw } = this.state;
        if (lodash.isEmpty(selectedDraw)) {
            return null;
        } else {
            let type = selectedDraw && selectedDraw.type;
            let index = selectedDraw && selectedDraw.index;
            let chartId = selectedDraw && selectedDraw.chartId;
            let drawObj = lodash.cloneDeep(this.state.drawObj);
            let currentInteractiveOptions = drawObj[type][`data_${chartId}`][index];
            // console.log(selectedDraw.data)
            switch (type) {
                case "TrendLine":
                    return (
                        <div className="drawSettingBoxMain">
                            <Select style={{ width: 85 }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('type', value) }}
                                value={currentInteractiveOptions.type}
                            >
                                <Option value='RAY'>RAY</Option>
                                <Option value='LINE'>LINE</Option>
                                <Option value='XLINE'>XLINE</Option>
                            </Select>
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={currentInteractiveOptions.appearance.stroke}
                                onChange={(color) => this.changeDrawInteractiveOptions('stroke', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('strokeOpacity', color.rgb.a) })}
                            />
                            <Select style={{ width: 50 }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('strokeWidth', value) }}
                                value={currentInteractiveOptions.appearance.strokeWidth}
                            >
                                <Option value={1}>1</Option>
                                <Option value={2}>2</Option>
                                <Option value={3}>3</Option>
                                <Option value={4}>4</Option>
                                <Option value={5}>5</Option>
                            </Select>
                            <Select style={{ width: 180, margin: '0 10px' }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('strokeDasharray', value) }}
                                value={currentInteractiveOptions.appearance.strokeDasharray}
                            >
                                {
                                    strokeDashArray.map((item) => {
                                        return (
                                            <Option key={item} value={item}>{item}</Option>
                                        )
                                    })
                                }
                            </Select>
                            <i className="iconfont icon-del" style={{ fontSize: 30, color: '#73838E', cursor: 'pointer' }}
                                onClick={() => { this.changeDrawInteractiveOptions('del') }}></i>
                        </div>
                    );

                case "FibonacciRetracement":
                    return (
                        <div className="drawSettingBoxMain">
                            <Select style={{ width: 95 }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('type', value) }}
                                value={currentInteractiveOptions.type}
                            >
                                <Option value='EXTEND'>EXTEND</Option>
                                <Option value='RAY'>RAY</Option>
                                <Option value='BOUND'>BOUND</Option>
                            </Select>
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={currentInteractiveOptions.appearance.stroke}
                                opacity={currentInteractiveOptions.appearance.strokeOpacity}
                                onChange={(color) => this.changeDrawInteractiveOptions('stroke', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('strokeOpacity', color.rgb.a) })}
                            />
                            <Select style={{ width: 50 }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('strokeWidth', value) }}
                                value={currentInteractiveOptions.appearance.strokeWidth}
                            >
                                <Option value={1}>1</Option>
                                <Option value={2}>2</Option>
                                <Option value={3}>3</Option>
                                <Option value={4}>4</Option>
                                <Option value={5}>5</Option>
                            </Select>
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={currentInteractiveOptions.appearance.fontFill}
                                onChange={(color) => this.changeDrawInteractiveOptions('fontFill', color.hex)}
                            />
                            <i className="iconfont icon-del" style={{ fontSize: 30, color: '#73838E', cursor: 'pointer' }}
                                onClick={() => { this.changeDrawInteractiveOptions('del') }}></i>
                        </div>
                    );

                case "EquidistantChannel":
                    return (
                        <div className="drawSettingBoxMain">
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={currentInteractiveOptions.appearance.stroke}
                                opacity={currentInteractiveOptions.appearance.strokeOpacity}
                                onChange={(color) => this.changeDrawInteractiveOptions('stroke', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('strokeOpacity', color.rgb.a) })}
                            />
                            <Select style={{ width: 50 }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('strokeWidth', value) }}
                                value={currentInteractiveOptions.appearance.strokeWidth}
                            >
                                <Option value={1}>1</Option>
                                <Option value={2}>2</Option>
                                <Option value={3}>3</Option>
                                <Option value={4}>4</Option>
                                <Option value={5}>5</Option>
                            </Select>
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={currentInteractiveOptions.appearance.fill}
                                opacity={currentInteractiveOptions.appearance.fillOpacity}
                                onChange={(color) => this.changeDrawInteractiveOptions('fill', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('fillOpacity', color.rgb.a) })}
                            />
                            <i className="iconfont icon-del" style={{ fontSize: 30, color: '#73838E', cursor: 'pointer' }}
                                onClick={() => { this.changeDrawInteractiveOptions('del') }}></i>
                        </div>
                    );

                case 'StandardDeviationChannel':
                    return (
                        <div className="drawSettingBoxMain">
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={currentInteractiveOptions.appearance.stroke}
                                opacity={currentInteractiveOptions.appearance.strokeOpacity}
                                onChange={(color) => this.changeDrawInteractiveOptions('stroke', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('strokeOpacity', color.rgb.a) })}
                            />
                            <Select style={{ width: 50 }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('strokeWidth', value) }}
                                value={currentInteractiveOptions.appearance.strokeWidth}
                            >
                                <Option value={1}>1</Option>
                                <Option value={2}>2</Option>
                                <Option value={3}>3</Option>
                                <Option value={4}>4</Option>
                                <Option value={5}>5</Option>
                            </Select>
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={currentInteractiveOptions.appearance.fill}
                                opacity={currentInteractiveOptions.appearance.fillOpacity}
                                onChange={(color) => this.changeDrawInteractiveOptions('fill', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('fillOpacity', color.rgb.a) })}
                            />
                            <i className="iconfont icon-del" style={{ fontSize: 30, color: '#73838E', cursor: 'pointer' }}
                                onClick={() => { this.changeDrawInteractiveOptions('del') }}></i>
                        </div>
                    );

                case 'GannFan':
                    return (
                        <div className="drawSettingBoxMain">
                            <ColorPicker
                                showText={true}
                                disableAlpha={false}
                                color={currentInteractiveOptions.appearance.stroke}
                                opacity={currentInteractiveOptions.appearance.strokeOpacity}
                                onChange={(color) => this.changeDrawInteractiveOptions('stroke', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('strokeOpacity', color.rgb.a) })}
                            />
                            <Select style={{ width: 50 }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('strokeWidth', value) }}
                                value={currentInteractiveOptions.appearance.strokeWidth}
                            >
                                <Option value={1}>1</Option>
                                <Option value={2}>2</Option>
                                <Option value={3}>3</Option>
                                <Option value={4}>4</Option>
                                <Option value={5}>5</Option>
                            </Select>
                            <i className="iconfont icon-del" style={{ fontSize: 30, color: '#73838E', cursor: 'pointer' }}
                                onClick={() => { this.changeDrawInteractiveOptions('del') }}></i>
                        </div>
                    );

                case 'InteractiveText':
                    return (
                        <div className="drawSettingBoxMain">
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={currentInteractiveOptions.textFill}
                                onChange={(color) => this.changeDrawInteractiveOptions('textFill', color.hex)}
                            />
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={currentInteractiveOptions.bgFill}
                                onChange={(color) => this.changeDrawInteractiveOptions('bgFill', color.hex)}
                            />
                            <Input type="text"
                                autoFocus
                                style={{ width: 80, zIndex: 9999 }}
                                value={currentInteractiveOptions.text}
                                onChange={(e) => { this.changeDrawInteractiveOptions('text', e.target.value) }} />
                            <Select style={{ width: 50, margin: '0 10px' }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('fontSize', value) }}
                                value={currentInteractiveOptions.fontSize}
                            >
                                <Option value={10}>10</Option>
                                <Option value={11}>11</Option>
                                <Option value={12}>12</Option>
                                <Option value={14}>14</Option>
                                <Option value={16}>16</Option>
                                <Option value={18}>18</Option>
                                <Option value={20}>20</Option>
                                <Option value={22}>22</Option>
                                <Option value={24}>24</Option>
                                <Option value={28}>28</Option>
                                <Option value={32}>32</Option>
                            </Select>
                            <span className="fontSpan" style={{ backgroundColor: currentInteractiveOptions.fontWeight === 'bold' ? '#38A89D' : '#FFF' }}
                                onClick={() => this.changeDrawInteractiveOptions('fontWeight', currentInteractiveOptions.fontWeight === 'bold' ? 'normal' : 'bold')}
                            >
                                B
                            </span>
                            <span className="fontSpan" style={{ backgroundColor: currentInteractiveOptions.fontStyle === 'italic' ? '#38A89D' : '#FFF' }}
                                onClick={() => this.changeDrawInteractiveOptions('fontStyle', currentInteractiveOptions.fontStyle === 'italic' ? 'normal' : 'italic')}
                            >
                                /
                            </span>
                            <i className="iconfont icon-del" style={{ fontSize: 30, color: '#73838E', cursor: 'pointer' }}
                                onClick={() => { this.changeDrawInteractiveOptions('del') }}></i>
                        </div>
                    );

                case 'InteractiveYCoordinate':
                    return (
                        <div className="drawSettingBoxMain">
                            <ColorPicker
                                showText={false}
                                disableAlpha={true}
                                color={currentInteractiveOptions.stroke}
                                onChange={(color) => this.changeDrawInteractiveOptions('stroke', color.hex, color,
                                    (color) => { this.changeDrawInteractiveOptions('textFill', color.hex) })}
                            />
                            <Select style={{ width: 50, margin: '0 10px' }}
                                onChange={(value) => { this.changeDrawInteractiveOptions('strokeWidth', value) }}
                                value={currentInteractiveOptions.strokeWidth}
                            >
                                <Option value={1}>1</Option>
                                <Option value={2}>2</Option>
                                <Option value={3}>3</Option>
                                <Option value={4}>4</Option>
                                <Option value={5}>5</Option>
                            </Select>
                            <Input type="text"
                                autoFocus
                                style={{ width: 80, zIndex: 9999 }}
                                value={currentInteractiveOptions.text}
                                onChange={(e) => { this.changeDrawInteractiveOptions('text', e.target.value) }} />
                            <i className="iconfont icon-del" style={{ fontSize: 30, color: '#73838E', cursor: 'pointer' }}
                                onClick={() => { this.changeDrawInteractiveOptions('del') }}></i>
                        </div>
                    );


                default:
                    break;
            }
        }
    }
    // 修改画图参数
    changeDrawInteractiveOptions(settingType, value, valueAll, cb) {
        let { selectedDraw } = this.state;
        if (lodash.isEmpty(selectedDraw)) return;
        let type = selectedDraw && selectedDraw.type;
        let index = selectedDraw && selectedDraw.index;
        let chartId = selectedDraw && selectedDraw.chartId;
        let drawObj = lodash.cloneDeep(this.state.drawObj);
        let currentInteractiveOptions = drawObj[type][`data_${chartId}`][index];
        if (settingType === 'type') {
            currentInteractiveOptions[settingType] = value;
        } else if (settingType === 'del') {
            selectedDraw = {};
            drawObj[type][`data_${chartId}`].splice(index, 1);
        } else {
            if (type === 'InteractiveYCoordinate' || type === 'InteractiveText') {
                currentInteractiveOptions[settingType] = value;
            } else {
                currentInteractiveOptions.appearance[settingType] = value;
            }
        }
        this.setState({
            drawObj,
            selectedDraw
        }, () => {
            cb && cb(valueAll);
            this.saveChartSetting();
        });
    }
    // 画图完成方法
    onDrawCompleteChart(drawDataArr, moreProps) {
        // console.log(drawDataArr);
        let { selectedDraw } = this.state;
        let chartId = moreProps.chartId;
        let drawObj = lodash.cloneDeep(this.state.drawObj);
        let typeMark = drawDataArr[0].appearance.typeMark;
        drawObj[typeMark][`data_${chartId}`] = drawDataArr;
        drawObj[typeMark].enable = false;
        drawObj.selectorEnable = true;
        selectedDraw.chartId = chartId;
        selectedDraw.type = typeMark;
        selectedDraw.index = drawDataArr.length - 1;
        selectedDraw.data = drawDataArr[drawDataArr.length - 1];
        this.setState({
            drawObj,
            // selectedDraw
        }, this.saveChartSetting);
    }
    // 拖拽完成方法（InteractiveYCoordinate , InteractiveText）
    onDragComplete(data, moreProps) {
        // console.log(data);
        // console.log(moreProps);
        const { id: chartId } = moreProps.chartConfig;
        let drawObj = lodash.cloneDeep(this.state.drawObj);
        drawObj[data[0].typeMark][`data_${chartId}`] = data;
        drawObj[data[0].typeMark].enable = false;
        this.setState({
            drawObj
        }, this.saveChartSetting);
    }
    // 画图选择方法
    handleSelection(interactives, moreProps, e) {
        // InteractiveYCoordinate 画预警线  ||  InteractiveText 文字
        if (this.state.drawObj.InteractiveYCoordinate.enable || this.state.drawObj.InteractiveText.enable) {
            let independentCharts = moreProps.currentCharts;
            if (independentCharts.length > 0) {
                const first = head(independentCharts);

                const morePropsForChart = getMorePropsForChart(moreProps, first);

                if (this.state.drawObj.InteractiveYCoordinate.enable) {
                    const {
                        mouseXY: [, mouseY],
                        chartConfig: { yScale },
                    } = morePropsForChart;

                    const yValue = round(yScale.invert(mouseY), 2);

                    const newAlert = {
                        ...InteractiveYCoordinate.defaultProps.defaultPriceCoordinate,
                        yValue,
                        id: shortid.generate(),
                        draggable: true,
                        typeMark: 'InteractiveYCoordinate'
                    };
                    this.handleChoosePosition(newAlert, morePropsForChart, e);
                } else if (this.state.drawObj.InteractiveText.enable) {
                    const {
                        mouseXY: [, mouseY],
                        chartConfig: { yScale },
                        xAccessor,
                        currentItem,
                    } = morePropsForChart;

                    const position = [xAccessor(currentItem), yScale.invert(mouseY)];
                    const newText = {
                        ...InteractiveText.defaultProps.defaultText,
                        position,
                        text: "Text...",
                        typeMark: 'InteractiveText'
                    };
                    this.handleChoosePosition(newText, morePropsForChart, e);
                }
            }
        } else {
            // 更换点击状态
            let drawObj = lodash.cloneDeep(this.state.drawObj);
            let selectedDraw = {};
            // console.log(interactives)
            drawTypeArr.forEach((value, i) => {
                let filterInteractives = interactives.filter((item) => item.type === value);
                // console.log(filterInteractives);
                let dataArr = toObject(filterInteractives, each => {
                    // return [`trends_${each.chartId}`, each.objects];
                    return [`data_${each.chartId}`, each.objects];
                });
                drawObj[value] = dataArr;
                drawObj[value].enable = false;
                // 当前选择的图形
                filterInteractives.forEach((item, i) => {
                    let selectedIndex = item.objects.findIndex((value) => value.selected);
                    if (selectedIndex > -1) {
                        selectedDraw.type = item.type;
                        selectedDraw.index = selectedIndex;
                        selectedDraw.chartId = i + 1;
                        selectedDraw.data = item.objects[selectedIndex];
                        // 橡皮擦鼠标
                        if (this.state.mouseType === 'eraser') {
                            drawObj[item.type][`data_${i + 1}`].splice(selectedIndex, 1);
                            selectedDraw = {};
                        }
                    }
                });
            });
            this.setState({
                drawObj,
                selectedDraw
            }, this.saveChartSetting);
        }
    }
    // 获取选择的位置
    handleChoosePosition(data, moreProps) {
        const { id: chartId } = moreProps.chartConfig;
        let drawObj = lodash.cloneDeep(this.state.drawObj);
        drawObj[data.typeMark][`data_${chartId}`] = [
            ...drawObj[data.typeMark][`data_${chartId}`],
            data
        ];
        // console.log(drawObj);
        drawObj[data.typeMark].enable = false;
        this.setState({
            drawObj,
        }, () => {
            let drawObj = lodash.cloneDeep(this.state.drawObj);
            let selectedDraw = {};
            selectedDraw.type = data.typeMark;
            selectedDraw.index = drawObj[data.typeMark][`data_${chartId}`].length - 1;
            selectedDraw.chartId = chartId;
            selectedDraw.data = data;
            this.setState({ selectedDraw });

            this.saveChartSetting();
        })
    }
    // 删除画图方法
    onDrawDelete(drawData, moreProps) {
        let selectedDraw = this.state.selectedDraw;
        let index = selectedDraw && selectedDraw.index;
        let chartId = moreProps.chartId;
        let drawObj = lodash.cloneDeep(this.state.drawObj);
        selectedDraw = {};
        drawObj.InteractiveYCoordinate[`data_${chartId}`].splice(index, 1);
        this.setState({
            drawObj,
            selectedDraw
        }, this.saveChartSetting);
    }
    getInteractiveNode(type, chartId) {
        this.node = this.interactiveNodes[`${type}_${chartId}`].node;
    }
    // 键盘事件
    onKeyPress(e) {
        if (this.props.isIntelliScript === true)
            return
        const keyCode = e.which;
        // console.log(keyCode);
        switch (keyCode) {
            case 46: { // DEL 删除
                this.changeDrawInteractiveOptions('del');
                this.canvasNode.cancelDrag();
                break;
            }
            case 27: { // ESC 取消画线
                if (this.node) {
                    this.node.terminate();
                    this.canvasNode.cancelDrag();
                    let drawObj = lodash.cloneDeep(this.state.drawObj);
                    for (let key in drawObj) {
                        if (key === 'selectorEnable') continue;
                        drawObj[key].enable = false;
                    }
                    this.node = void (0);
                }
                break;
            }
            default:
                break
        }
    }
    saveChartSetting() {
        let { ma, ZoomAndPan, chart, settingObj, chartType, selectedDraw, drawObj, mouseType } = this.state;
        let chartSetting = {
            ma,
            ZoomAndPan,
            chart,
            settingObj,
            chartType,
            selectedDraw,
            drawObj,
            mouseType
        };
        localStorage.setItem('chartSetting', JSON.stringify(chartSetting));
    }
    changeMACD() {
        let chart = lodash.cloneDeep(this.state.chart);
        chart.macd = {
            MACDSeries: {
                stroke: {
                    macd: "#00FF00",
                    signal: "#00FFFF",
                },
                fill: {
                    divergence: '#FF0000'
                }
            }
        };
        this.setState({ chart });
    }
    resetMACD() {
        let chart = lodash.cloneDeep(this.state.chart);
        chart.macd = {};
        this.setState({ chart });
    }
    addBuyPoint() {
        let realData = lodash.cloneDeep(this.state.realData)
        console.log(realData)
        realData.forEach((point, index) => {

        });
        realData[realData.length - 15].signal = 'buy'
        realData[realData.length - 10].signal = 'sell'
        // console.log(realData)
        this.setState({
            realData
        })
    }
    removeBuyPoint() {
        let realData = lodash.cloneDeep(this.state.realData)
        realData.data.forEach((item) => {
            if (item.signal) {
                item.signal = ''
            }
        })
        this.setState({
            realData
        })
    }
}
var styles = {
    contentStyle: {
        top: '30%',
    },
}

TradeRoomChart.childContextTypes = {
    tradingRoomThis: PropTypes.object.isRequired,
};

//默认参数
TradeRoomChart.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight - 60,
    minuteData: [
        { title: '1 minute', value: '1 m', period: 'M1' },
        { title: '3 minute', value: '3 m', period: 'M3' },
        { title: '5 minute', value: '5 m', period: 'M5' },
        { title: '15 minute', value: '15 m', period: 'M15' },
        { title: '30 minute', value: '30m', period: 'M30' },
        { title: '1 Hour', value: '1 H', period: 'H1' },
        { title: '4 Hour', value: '4 H', period: 'H4' },
        { title: '1 Day', value: '1 D', period: 'D1' },
        { title: '7 Day', value: '7 D', period: 'D7' },
        { title: '1 Month', value: '1 M', period: '1M' },
    ]

}

export default injectIntl(TradeRoomChart);