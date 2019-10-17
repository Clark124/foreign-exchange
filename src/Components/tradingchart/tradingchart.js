import React from 'react';
import PropTypes from "prop-types";
import PureComponent from "../../utils/PureComponent";
import { injectIntl } from 'react-intl'
import StockChart from '../tradingchart/stockChart'

// import '../../css/media.css'
import './tradingchart.css'
import lodash from 'lodash';

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import * as indicatorMap from "react-stockcharts/lib/indicator";
// import { LabelAnnotation } from "react-stockcharts/lib/annotation";
import SvgPathAnnotation from "../customchart/SvgPathAnnotation";
import { StochasticSeries } from "react-stockcharts/lib/series";
import { buyPath } from "react-stockcharts/lib/annotation";
import { default as smoothedForceIndex } from "../customchart/indicator/smoothedForceIndex";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
// const dateFormat = timeFormat("%Y-%m-%d");

indicatorMap.smoothedForceIndex = smoothedForceIndex;
// 默认指标名称的映射
const defaultOptionsForComputationMap = {
    atr:'ATR',
    bollingerBand:'BollingerBand',
    change:'Change',
    compare:'Compare',
    ema:'EMA',
    elderImpulse:'ElderImpulse',
    elderRay:'ElderRay',
    forceIndex:'ForceIndex',
    stochasticOscillator:'FullStochasticOscillator',
    heikinAshi:'heikinAshi',
    kagi:'kagi',
    macd:'MACD',
    pointAndFigure:'PointAndFigure',
    rsi:'RSI',
    renko:'Renko',
    sar:'SAR',
    sma:'SMA',
    smoothedForceIndex:'SmoothedForceIndex',
    tma:'TMA',
    wma:'WMA',
};
// 是需要增加副图的图形指标，同时也是可以多个开启的指标
const isChartIndicator = ['macd','atr','elderRay','forceIndex','rsi','stochasticOscillator'];

// K线根数
// const CANDLESTICKLENGTH = 60;

// X轴参数
var XAxisOptions = {
    axisAt: "bottom",
    orient: "bottom",
    ticks: 6,
    stroke:'#2B3238',
    tickStroke: "#758795",
    zoomEnabled: false,
};

// Y轴参数
var YAxisOptions = {
    axisAt: "right",
    orient: "right",
    ticks: 7,
    stroke:'#2B3238',
    tickStroke: "#758795",
    fontFamily:'Microsoft YaHei',
    fontSize:12,
};

// X轴参数
const gridOptions = {
    // innerTickSize: -1 * gridWidth,
    tickStrokeDasharray: 'Dash',
    tickStrokeOpacity: 0.2,
    tickStrokeWidth: 1,
};


// hover提示框
const HoverTooltipOptions = {
    fontSize:14,
    fill:"#3F4B57",
    bgFill:"transparent",
    fontFill:"#8C9AA7",
    bgOpacity:0.5,
    stroke:"#3F4B57"
};

// 边缘指标
const EdgeIndicatorOptions = {
    itemType:"last",
    orient:"right",
    edgeAt:"right",
    lineStroke:'#FFFFFF'
};

// 鼠标坐标Y轴
const MouseCoordinateYOptions = {
    at: "right",
    orient: "right",
    displayFormat:format(".2f"),
};
// 鼠标坐标X轴
const MouseCoordinateXOptions = {
    at: "bottom",
    orient: "bottom",
    displayFormat: timeFormat("%Y-%m-%d"),
    rectRadius: 5,
    textFill: "#542605",
    stroke: "#05233B",
    strokeOpacity: 1,
    strokeWidth: 3,
    arrowWidth: 5,
    fill: "#BCDEFA",
};

// 分时线
const miniteLineSeries = {
    yAccessor: d => d.close,
    stroke: "#4b8fdf",
};

const AreaSeriesOptions = {
    yAccessor:d => d.close,
};


// 缩放按钮
const ZoomButtonsOptions = {};

// 蜡烛图
const CandlestickSeries = {
    opacity:1
};

// 主图型Y轴数据数组
var CandlestickSeriesChartOptionsYExtentsValueArr = [];
var CandlestickSeriesChartOptionsYExtentsArr = [];

// 蜡烛图
const CandlestickSeriesChartOptions = {
    padding:{
        top:40,
        bottom:0
    },
    yExtents: d => [d.high,d.low],
};

// 分时图
// const miniteChartOptions = {
//     yExtents: d => d.close,
// };

// MACD提示工具外观
const MACDTooltipAppearance = {
    stroke: {
        macd: "#FF0000",
        signal: "#00F300",
    },
    fill: {
        divergence: "#4682B4"
    }
};

// MACD提示工具
const MACDTooltipOptionsArr = [];
const MACDTooltipOptions = {
    fontSize:14,
    labelFill:'#758795',
    origin:[0, 15],
    displayFormat:format(".2f"),
    // yAccessor:d => d.macd,
    // options:macdCalculator.options(),
    appearance: MACDTooltipAppearance
};

// MACD指标参数
const MACDSeriesOptionsArr = [];
const MACDSeriesOptions = {
    // yAccessor: d => d.macd,
    ...MACDTooltipAppearance
};

// MACD-Chart参数
const MACDOptionsArr = [];
const MACDOptions ={
    // yExtents:macdCalculator.accessor(),
    padding:{ top: 10, bottom: 10 }
};


// BOLL提示工具外观
const BollingerSeriesAppearance = {
    stroke: {
        top: "#964B00",
        middle: "#000000",
        bottom: "#964B00",
    },
    fill: "#4682B4"
};

// BOLL指标参数
const BollingerSeriesOptions = {
    // yAccessor : d => d.bb,
    ...BollingerSeriesAppearance
};

// BOLL提示工具参数
const BollingerBandTooltipOptions = {
    origin:[0, 50],
    fontSize:14,
    textFill:'#758795',
    displayFormat:format(".2f"),
    // yAccessor:d => d.bb,
    // options:bb.options()
};

// SAR指标参数
const SARSeriesOptions = {
    // yAccessor : d => d.sar,
};

// SAR提示工具参数
const SARTooltipOptions = {
    fontSize:14,
    origin:[0, 75],
    valueFill:'#758795',
    labelFill:'#4682B4',
    // yDisplayFormat:format(".2f"),
    // yLabel:`SAR (${accelerationFactor}, ${maxAccelerationFactor})`,
    // yAccessor:d => d.sar,
};

// VolumeProfile指标参数
const VolumeProfileOptions = {
    // opacity: 0.5,
    fill: ({ type }) => type === "up" ? "#2be594" : "#ff6060",
};

// ATR-Chart参数
const ATROptionsArr = [];
const ATROptions = {
    // yExtents:atrCalculator.accessor(),
    padding:{ top: 10, bottom: 10 }
};

// ATR指标参数
const ATRSeriesOptionsArr = [];
const ATRSeriesOptions = {
    // yAccessor:atr14.accessor(),
    // stroke:atr14.stroke()
    stroke:'#4682B4',
};

// ATR提示工具
const ATRTooltipOptionsArr = [];
const ATRTooltipOptions = {
    fontSize:14,
    yDisplayFormat:format(".2f"),
    valueFill:'#758795',
    origin:[0, 15],
    labelFill:'#4682B4',
    // yAccessor:atr14.accessor(),
    // yLabel:`ATR (${atr14.options().windowSize})`
};

// RSI-Chart参数
const RSIOptionsArr = [];
const RSIOptions = {
    yExtents:[0, 100],
    padding:{ top: 10, bottom: 10 }
};

// RSI指标参数
const RSISeriesOptionsArr = [];
const RSISeriesOptions = {
    // yAccessor:d => d.rsi,
    stroke: {
        top: '#43474B',
        middle: '#43474B',
        bottom:'#43474B',
        outsideThreshold: '#000084',
        insideThreshold: '#4682B4'
    },
    opacity: {
        top: 1,
        middle: 1,
        bottom: 1
    },
    /*overSold: 70,
    middle: 50,
    overBought: 30,*/
};

// RSI提示工具
const RSITooltipOptionsArr = [];
const RSITooltipOptions = {
    fontSize: 14,
    displayFormat: format(".2f"),
    origin: [0, 15],
    labelFill: '#4682B4',
    textFill: '#758795',
    // yAccessor:d => d.rsi,
    // options: rsi14.options(),
};

// ElderRay-Chart参数
const ElderRayOptionsArr = [];
const ElderRayOptions = {
    // yExtents:[0, elder.accessor()],
    padding:{ top: 10, bottom: 10 }
};

// ElderRay指标参数
const ElderRaySeriesOptionsArr = [];
const ElderRaySeriesOptions = {
    // yAccessor:elder.accessor(),
    fill:"#FF0000",
};

// ElderRay提示工具
const ElderRayTooltipOptionsArr = [];
const ElderRayTooltipOptions = {
    fontSize:14,
    yDisplayFormat:d => `bullPower:${format(".2f")(d.bullPower)}, bearPower:${format(".2f")(d.bearPower)}`,
    valueFill:'#758795',
    origin:[0, 15],
    labelFill:'#4682B4',
    // yAccessor:d => elder.accessor(),
    yLabel:"Elder Ray",
};

// ElderRay提示工具数组
/*const ElderRayTooltipOptionsArr = [
    Object.assign({},ElderRayTooltipOptions,{
        yDisplayFormat:d => format(".2f")(d.bullPower),
        origin:[0, 15],
        labelFill:'#6BA583',
        yLabel:"Elder Ray - Bull Power",
    }),
    Object.assign({},ElderRayTooltipOptions,{
        yDisplayFormat:d => format(".2f")(d.bearPower),
        origin:[0, 35],
        labelFill:'#FF0000',
        yLabel:"Elder Ray - Bear Power",
    }),
];*/

// Force Index -Chart参数
const ForceIndexOptionsArr = [];
const ForceIndexOptions = {
    // yExtents:fi.accessor(),
    padding:{ top: 10, bottom: 10 }
};

// Force Index指标参数
const ForceIndexSeriesOptionsArr = [];
const ForceIndexSeriesOptions = {
    baseAt:0,
    // yAccessor:fi.accessor(),
};

// Force Index提示工具
const ForceIndexTooltipOptionsArr = [];
const ForceIndexTooltipOptions = {
    fontSize:14,
    yDisplayFormat:format(".4s"),
    valueFill:'#758795',
    labelFill:'#4682B4',
    origin:[0, 15],
    // yAccessor:fi.accessor(),
    // yLabel:`ForceIndex (${fi.options().windowSize})`
};

// Stochastic Oscillator -Chart参数
const StochasticOscillatorOptionsArr = [];
const StochasticOscillatorOptions = {
    yExtents:[0, 100],
    padding:{ top: 10, bottom: 10 }
};

const stoAppearance = {
    stroke: Object.assign({}, StochasticSeries.defaultProps.stroke)
};

// Stochastic Oscillator指标参数
const StochasticOscillatorSeriesOptionsArr = [];
const StochasticOscillatorSeriesOptions = {
    // yAccessor:d => d.fastSTO,
    ...stoAppearance
};

// Stochastic Oscillator提示工具
const StochasticOscillatorTooltipOptionsArr = [];
const StochasticOscillatorTooltipOptions = {
    fontSize:14,
    origin:[0, 15],
    // yAccessor:d => d.slowSTO,
    // options:slowSTO.options(),
    label:"Stochastic Oscillator",
    appearance:stoAppearance
};

// 坐标轴标线
const StraightLineOptions = {
    yValue:0
};


// 成交量chart参数
const volumeOptions = {
    yExtents:d => d.volume,
};

// 成交量柱状图
const BarSeriesOptions = {
    yAccessor:d => d.volume,
    // fill:d => d.close > d.open ? '#2be594' : '#ff6060',
    opacity:1
};

// 高开低收提示
const OHLCTooltipOptions = {
    origin:[0, 0],
    textFill:'#758795',
    fontSize:14
};

// 十字光标
const CrossHairCursorOptions = {
    stroke: '#FFFFFF'
};

// 均线提示
const MovingAverageTooltipOptions= {
    origin:[0, 25],
    // onClick:e => console.log(e)
};

// 提示工具组
const GroupTooltipOptions = {
    origin: [0, 27],
    fontSize:14,
    layout: "horizontalInline",
    displayFormat:format(".2f"),
    // onClick:e => console.log(e)
};

//买卖点
const AnnotationOptions = {
    with:SvgPathAnnotation,
    when:d => d.signal,
    usingProps:{
        // fontFamily:'iconfont',
        // fontSize: 20,
        path: buyPath,
        y: ({ yScale, datum,d }) =>datum.signal==='buy'? yScale(datum.low):yScale(datum.high),
        fill: d => d.signal === "buy"?'#ff6060':'#2be594',
        // fill: d => d.signal === "buy"?'#fff':'#fff',
        // path: buyPath,
        text: d => d.signal === "buy"? "\ue7ca":"\ue7c9",
        tooltip: d => d.signal === "buy"?"B":"S",
    }

};

// chartOptions
const chartOptions = {};

// 需要格式化小数点位数的数据
var displayFormatArr = [
    MACDTooltipOptions,
    BollingerBandTooltipOptions,
    MouseCoordinateYOptions,
    GroupTooltipOptions,
    EdgeIndicatorOptions,
];
var HoverTooltipArr;
// 创建MA
function createMA(type,id,options) {
    let labelName = `${type}${options.windowSize}(${options.sourcePath?options.sourcePath.slice(0,1):'c'})`;
    let MAFunc = indicatorMap[type]()
        .id(id)
        .options(options)
        .merge((d, c) => { d[labelName] = c; })
        .accessor(d => d[labelName]);
    // 添加鼠标悬停提示参数
    HoverTooltipArr.push({
        label: labelName,
        stroke: MAFunc.stroke()
    });
    CandlestickSeriesChartOptionsYExtentsArr.push(MAFunc.accessor());
    return MAFunc;
}

// 创建 指标
function createIndicator(type , options , index) {
    let indicatorCalFunc;
    if(type === 'volumeProfile'){
        indicatorCalFunc = indicatorMap.change();
    } else {
        let value = '';
        let newOptions = lodash.merge({},indicatorMap.defaultOptionsForComputation[defaultOptionsForComputationMap[type === 'forceIndex'?'smoothedForceIndex':type]],options);
        if(newOptions.windowSize){
            value = newOptions.windowSize;
        } else {
            switch (type){
                case 'macd':
                    value = `${newOptions.fast}${newOptions.slow}${newOptions.signal}`;
                    break;
                case 'forceIndex':
                    value = newOptions.smoothingWindow;
                    break;
                default:
                    break;
            }
        }
        // console.log(newOptions);
        indicatorCalFunc = indicatorMap[type === 'forceIndex'?'smoothedForceIndex':type]()
            .options( newOptions )
            .merge((d, c) => { d[type+value] = (type === 'forceIndex'?c.smoothed:c); })
            .accessor(d => d[type+value]);
        fixIndicatorOptions(type,type+value,indicatorCalFunc,index);
        if(type === 'bollingerBand' || type === 'sar'){
            HoverTooltipArr.push({
                label: (type+value),
                stroke: '#3399ff'
            });
        }
    }
    return indicatorCalFunc;
}

// 修复动态指标
function fixIndicatorOptions(type,name,indicatorCalFunc) {
    switch (type) {
        case 'macd':
            MACDTooltipOptions.yAccessor = nameToFunc(name);
            MACDTooltipOptions.options = indicatorCalFunc.options();
            MACDSeriesOptions.yAccessor = nameToFunc(name);
            MACDOptions.yExtents = indicatorCalFunc.accessor();
            MACDTooltipOptionsArr.push(lodash.cloneDeep(MACDTooltipOptions));
            MACDSeriesOptionsArr.push(lodash.cloneDeep(MACDSeriesOptions));
            MACDOptionsArr.push(lodash.cloneDeep(MACDOptions));
            break;
        case 'bollingerBand':
            BollingerBandTooltipOptions.yAccessor = nameToFunc(name);
            BollingerBandTooltipOptions.options = indicatorCalFunc.options();
            BollingerSeriesOptions.yAccessor = nameToFunc(name);
            CandlestickSeriesChartOptionsYExtentsArr.push(indicatorCalFunc.accessor());
            break;
        case 'atr':
            ATROptions.yExtents = indicatorCalFunc.accessor();
            ATRSeriesOptions.yAccessor = indicatorCalFunc.accessor();
            // ATRSeriesOptions.stroke = indicatorCalFunc.stroke();
            ATRTooltipOptions.yAccessor = indicatorCalFunc.accessor();
            ATRTooltipOptions.yLabel = `ATR (${indicatorCalFunc.options().windowSize})`;
            // ATRTooltipOptions.labelFill = indicatorCalFunc.stroke();
            ATRTooltipOptionsArr.push(lodash.cloneDeep(ATRTooltipOptions));
            ATRSeriesOptionsArr.push(lodash.cloneDeep(ATRSeriesOptions));
            ATROptionsArr.push(lodash.cloneDeep(ATROptions));
            break;
        case 'rsi':
            RSISeriesOptions.yAccessor = nameToFunc(name);
            RSITooltipOptions.yAccessor = nameToFunc(name);
            RSITooltipOptions.options = indicatorCalFunc.options();
            RSISeriesOptionsArr.push(lodash.cloneDeep(RSISeriesOptions));
            RSITooltipOptionsArr.push(lodash.cloneDeep(RSITooltipOptions));
            break;
        case 'sar':
            SARSeriesOptions.yAccessor  = nameToFunc(name);
            SARTooltipOptions.yAccessor  = nameToFunc(name);
            SARTooltipOptions.yLabel = `SAR (${indicatorCalFunc.options().accelerationFactor}, ${indicatorCalFunc.options().maxAccelerationFactor})`;
            CandlestickSeriesChartOptionsYExtentsValueArr.push(name);
            break;
        case 'elderRay':
            ElderRayOptions.yExtents = [0, indicatorCalFunc.accessor()];
            ElderRaySeriesOptions.yAccessor = indicatorCalFunc.accessor();
            ElderRayTooltipOptions.yAccessor = indicatorCalFunc.accessor();
            // ElderRayTooltipOptionsArr[0].yAccessor = indicatorCalFunc.accessor();
            // ElderRayTooltipOptionsArr[1].yAccessor = indicatorCalFunc.accessor();
            ElderRayTooltipOptionsArr.push(lodash.cloneDeep(ElderRayTooltipOptions));
            ElderRaySeriesOptionsArr.push(lodash.cloneDeep(ElderRaySeriesOptions));
            ElderRayOptionsArr.push(lodash.cloneDeep(ElderRayOptions));
            break;
        case 'forceIndex':
            ForceIndexOptions.yExtents = indicatorCalFunc.accessor();
            ForceIndexSeriesOptions.yAccessor = indicatorCalFunc.accessor();
            ForceIndexTooltipOptions.yAccessor = indicatorCalFunc.accessor();
            ForceIndexTooltipOptions.yLabel = `ForceIndex (${indicatorCalFunc.options().smoothingWindow})`;
            ForceIndexTooltipOptionsArr.push(lodash.cloneDeep(ForceIndexTooltipOptions));
            ForceIndexSeriesOptionsArr.push(lodash.cloneDeep(ForceIndexSeriesOptions));
            ForceIndexOptionsArr.push(lodash.cloneDeep(ForceIndexOptions));
            break;
        case 'stochasticOscillator':
            StochasticOscillatorSeriesOptions.yAccessor = nameToFunc(name);
            StochasticOscillatorTooltipOptions.yAccessor = nameToFunc(name);
            StochasticOscillatorTooltipOptions.options = indicatorCalFunc.options();
            StochasticOscillatorTooltipOptionsArr.push(lodash.cloneDeep(StochasticOscillatorTooltipOptions));
            StochasticOscillatorSeriesOptionsArr.push(lodash.cloneDeep(StochasticOscillatorSeriesOptions));
            break;
        default:
                break;
    }
}

function nameToFunc(name) {
    return d=>(typeof name === 'string')?d[name]:name.map(item=>d[item])
}

// 需要清空数据的数组
const needEmptyArr = [
    MACDTooltipOptionsArr,  // MACD提示选项数组
    MACDSeriesOptionsArr,  // MACD图形数组
    MACDOptionsArr,  // MACD选项数组
    ATRTooltipOptionsArr,  // ATR提示选项数组
    ATRSeriesOptionsArr,  // ATR图形数组
    ATROptionsArr,  // ATR选项数组
    RSITooltipOptionsArr,  // RSI提示选项数组
    RSISeriesOptionsArr,  // RSI图形数组
    RSIOptionsArr,  // RSI选项数组
    ElderRayTooltipOptionsArr,  // ForceIndex提示选项数组
    ElderRaySeriesOptionsArr,  // ForceIndex图形数组
    ElderRayOptionsArr,  // ForceIndex选项数组
    ForceIndexTooltipOptionsArr,  // ForceIndex提示选项数组
    ForceIndexSeriesOptionsArr,  // ForceIndex图形数组
    ForceIndexOptionsArr,  // ForceIndex选项数组
    StochasticOscillatorTooltipOptionsArr,  // ATR提示选项数组
    StochasticOscillatorSeriesOptionsArr,  // ATR图形数组
    StochasticOscillatorOptionsArr,  // ATR选项数组
];

// let firstFlag = true;

class TradingChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            suffix: 1
        };
        this.handleReset = this.handleReset.bind(this);
    }

    render() {
        // console.log(this.props.period,isNaN(this.props.period))
        let dateFormat
        if(isNaN(this.props.period)){
            // var dateFormat=timeFormat("%Y-%m-%d")
             dateFormat = this.props.period.indexOf('D')>-1||this.props.period.indexOf('M')>-1?timeFormat("%Y-%m-%d"):timeFormat("%Y-%m-%d %-H:%M");

        }else{
            // var dateFormat=timeFormat("%Y-%m-%d")
             dateFormat = this.props.period>=6?timeFormat("%Y-%m-%d"):timeFormat("%Y-%m-%d %-H:%M");
        }

        HoverTooltipArr = [];  //鼠标悬停提示数组
        CandlestickSeriesChartOptionsYExtentsArr = [];  // 蜡烛图图形Y轴数据数组
        // 清空需要清空的数组
        needEmptyArr.forEach(arr=>arr.length=0);

        let MALineSeries =[];
        let CurrentCoordinateArr =[];
        let CandleEdgeIndicatorArr = [];
        // let VolEdgeIndicatorArr = [];
        let MovingAverageTooltipOptionsSeries = [];
        let GroupTooltipOptionsSeries = [];
        let { intl ,data: initialData , width , height , margin  , ZoomAndPan , settingObj } = this.props;
      
        let chart = lodash.cloneDeep(this.props.chart);
        let calculatorObj = chart.calculatorObj;
        if(!chart.CandlestickSeries.YAxis) chart.CandlestickSeries.YAxis = {right:{}};

        let upColor = intl.formatMessage({id: 'upColor', defaultMessage:'#2be594'});
        let downColor = intl.formatMessage({id: 'downColor', defaultMessage:'#ff6060'});
        let date = intl.formatMessage({id: 'date', defaultMessage:'Date'});
        let open = intl.formatMessage({id: 'open', defaultMessage:'O'});
        let high = intl.formatMessage({id: 'high', defaultMessage:'H'});
        let low = intl.formatMessage({id: 'low', defaultMessage:'L'});
        let close = intl.formatMessage({id: 'close', defaultMessage:'C'});
        let vol = intl.formatMessage({id: 'vol', defaultMessage:'Vol'});
        let na = intl.formatMessage({id: 'na', defaultMessage:'n/a'});
        let OPEN = intl.formatMessage({id: 'OPEN', defaultMessage:'open'});
        let HIGH = intl.formatMessage({id: 'HIGH', defaultMessage:'high'});
        let LOW = intl.formatMessage({id: 'LOW', defaultMessage:'low'});
        let CLOSE = intl.formatMessage({id: 'CLOSE', defaultMessage:'close'});
        let VOL = intl.formatMessage({id: 'VOL', defaultMessage:'volume'});

        // 处理小数点
        // const TICK_SIZE = JSON.parse(localStorage.getItem('TICK_SIZE'));
        let tickSize =  4;

            displayFormatArr.forEach((item)=>{
            item.displayFormat = format(`.${tickSize}f`);
        });

        let chartHight = height;
        let calculatedData = initialData;

        // 计算并添加MA设置
        Object.entries(this.props.ma).forEach((maType,typeIndex)=>{
            maType[1].forEach((maValue,i)=>{
                let maFunc = createMA(maType[0], String(typeIndex)+i , maValue);
                calculatedData = maFunc(calculatedData);
                // MALineSeriesStrokeArr.push(maFunc.stroke());
                MALineSeries.push({
                    yAccessor: maFunc.accessor(),
                    stroke: maFunc.stroke()
                });
                CurrentCoordinateArr.push({
                    yAccessor: maFunc.accessor(),
                    fill: maFunc.stroke()
                });
                CandleEdgeIndicatorArr.push({
                    yAccessor: maFunc.accessor(),
                    fill: maFunc.stroke(),
                    ...EdgeIndicatorOptions
                });
                MovingAverageTooltipOptionsSeries.push({
                    yAccessor: maFunc.accessor(),
                    type: maFunc.type(),
                    stroke: maFunc.stroke(),
                    windowSize: maFunc.options().windowSize,
                });
                GroupTooltipOptionsSeries.push({
                    yAccessor: maFunc.accessor(),
                    yLabel: `${maFunc.type()}${maFunc.options().windowSize}(${maFunc.options().sourcePath.slice(0,1)})`,
                    labelFill: maFunc.stroke(),
                    valueFill: '#758795',
                    withShape: true,
                    maId:i,
                    type:maType[0]
                });
            });
        });

        // 计算并添加指标设置
        Object.entries(calculatorObj).forEach((maType)=>{
            maType[1].forEach((item , index )=>{
                let indicatorCalFunc = createIndicator(maType[0], item.options , index);
                calculatedData = indicatorCalFunc(calculatedData);
            });
        });

        const xScaleProvider = discontinuousTimeScaleProvider
            .inputDateAccessor(d => d.date);
        var {
            data,
            xScale,
            xAccessor,
            displayXAccessor,
        } = xScaleProvider(calculatedData);

        // if(this.symbol !== this.props.tradeCode.symbol || this.minutesName !== this.props.minutesName){
        //     firstFlag = true;
        // }
        // if(data && data.length > 0 && firstFlag){
        //     data = lodash.cloneDeep(data).slice(data.length > CANDLESTICKLENGTH?data.length - CANDLESTICKLENGTH - 1:0, data.length - 1);
        //     firstFlag = false;
        //     setTimeout(()=>this.context.tradingRoomThis.forceUpdate());
        //     this.symbol = this.props.tradeCode.symbol;
        //     this.minutesName = this.props.minutesName;
        // }
        // console.log(data)

        var options =  {
            data,
            type:'hybrid',
            xScale,
            xAccessor,
            displayXAccessor,
            height,
            suffix:this.state.suffix,
            ZoomAndPan:lodash.cloneDeep(ZoomAndPan),
            chart: [],
            CrossHairCursor: CrossHairCursorOptions,
            };

        // 处理国际化
        function tooltipContent(ys) {
            return ({ currentItem, xAccessor }) => {
                return {
                    x: dateFormat(xAccessor(currentItem)),
                    y: [
                        {
                            label: OPEN,
                            value: (+currentItem.open).toFixed(tickSize),
                            stroke:'#3399ff'
                        },
                        {
                            label: HIGH,
                            value: (+currentItem.high).toFixed(tickSize),
                            stroke:'#3399ff'
                        },
                        {
                            label: LOW,
                            value: (+currentItem.low).toFixed(tickSize),
                            stroke:'#3399ff'
                        },
                        {
                            label: CLOSE,
                            value: (+currentItem.close).toFixed(tickSize),
                            stroke:'#3399ff'
                        },
                        {
                            label: VOL,
                            value: (+currentItem.volume).toFixed(tickSize),
                            stroke:'#3399ff'
                        },

                    ]
                        .concat(
                            ys.map(each => ({
                                label: (each.label.indexOf('bollingerBand') > -1)?each.label.replace('bollingerBand','boll'):each.label,
                                value: (each.label.indexOf('bollingerBand') > -1)?
                                    `${(currentItem[each.label].top).toFixed(tickSize)},${(currentItem[each.label].middle).toFixed(tickSize)},${(currentItem[each.label].bottom).toFixed(tickSize)}`
                                    :(+currentItem[each.label]).toFixed(tickSize),
                                stroke: each.stroke
                            }))
                        )
                        .filter(line => line.value)
                };
            };
        }
        HoverTooltipOptions.tooltipContent = tooltipContent(HoverTooltipArr);  // 鼠标浮动提示工具
        OHLCTooltipOptions.displayTexts = {d: date, o: open, h: high, l: low, c: close, v: vol, na: na};  // 高开低收提示工具
        OHLCTooltipOptions.ohlcFormat = format(`.${tickSize}f`);
        OHLCTooltipOptions.volumeFormat = format(`.${tickSize}f`);
        OHLCTooltipOptions.xDisplayFormat = dateFormat;

        // 设置宽度
        if(width){
            options.width = width;
        }

        // 蜡烛图（主图形）选项
        chartOptions.CandlestickSeriesChartOptions = {
            options: CandlestickSeriesChartOptions,
            YAxis: YAxisOptions,
            LineSeries: [],
            CurrentCoordinate: [],
            EdgeIndicator:[],
            OHLCTooltip:OHLCTooltipOptions,
            // HoverTooltip: HoverTooltipOptions,
            MouseCoordinateY: MouseCoordinateYOptions,
            Annotate:AnnotationOptions
        };

        // 增加坐标轴网格
        // let gridOptionsXAxis = Object.assign({},gridOptions,{
        //     innerTickSize: -1 * (height - margin.top - margin.bottom),
        // });
        let gridOptionsYAxis = Object.assign({},gridOptions,{
            innerTickSize: -1 * (width - margin.left - margin.right),
            // outerTickSize: margin.right
        });
        // XAxisOptions = Object.assign(XAxisOptions,gridOptionsXAxis);
        let YAxisOptionsCandlestickSeries = Object.assign({},YAxisOptions,gridOptionsYAxis);
        chartOptions.CandlestickSeriesChartOptions.YAxis = YAxisOptionsCandlestickSeries;

        // 增加主图中的动态指标
        chartOptions.CandlestickSeriesChartOptions.LineSeries.push(...MALineSeries);

        // 是否在均线上显示当前坐标点
        if(settingObj.CurrentCoordinate === true){
            chartOptions.CandlestickSeriesChartOptions.CurrentCoordinate.push(...CurrentCoordinateArr);
        }

        // 是否显示 HoverTooltip
        if(settingObj.HoverTooltip === true){
            chartOptions.CandlestickSeriesChartOptions.HoverTooltip = HoverTooltipOptions;
        }

        // 是否显示 boll
        if(calculatorObj.bollingerBand){
            chartOptions.CandlestickSeriesChartOptions.BollingerSeries = BollingerSeriesOptions;
            chartOptions.CandlestickSeriesChartOptions.BollingerBandTooltip = BollingerBandTooltipOptions;
        }

        // 是否显示 sar
        if(calculatorObj.sar){
            SARTooltipOptions.yDisplayFormat = format(`.${tickSize}f`);  // 处理 SAR 数据小数点位数
            chartOptions.CandlestickSeriesChartOptions.SARSeries = SARSeriesOptions;
            chartOptions.CandlestickSeriesChartOptions.SingleValueTooltip = SARTooltipOptions;
        }

        // 是否显示 volumeProfile
        if(calculatorObj.volumeProfile){
            chartOptions.CandlestickSeriesChartOptions.VolumeProfileSeries = VolumeProfileOptions;
            chartOptions.CandlestickSeriesChartOptions.VolumeProfileSeries.fill =  ({ type }) => type === "up" ? upColor : downColor;
        }

        // 切换图表类型
        const upDownColorFunc = colorObj=>d => d.close > d.open ? (colorObj&&colorObj.upColor?colorObj.upColor:upColor) : (colorObj&&colorObj.downColor?colorObj.downColor:downColor);
        const yAccessorFunc = (priceSource) => d => priceSource&&d[priceSource]?d[priceSource]:(typeof priceSource === 'function')?priceSource(d):d.close;
        switch (this.props.chartType) {
            case 'candle':
                // 处理蜡烛图自定义颜色参数
                CandlestickSeries.stroke = upDownColorFunc(chart.CandlestickSeries.stroke);
                CandlestickSeries.wickStroke = upDownColorFunc(chart.CandlestickSeries.wickStroke);
                CandlestickSeries.fill = upDownColorFunc(chart.CandlestickSeries.fill);
                /*Object.entries(chart.CandlestickSeries).forEach((item)=>{
                    if(item[0] === 'stroke' || item[0] === 'wickStroke' || item[0] === 'fill'){
                        CandlestickSeries[item[0]] = upDownColorFunc(item[1]);
                    } else {
                        CandlestickSeries[item[0]] = item[1];
                    }
                });*/
                chartOptions.CandlestickSeriesChartOptions.CandlestickSeries = CandlestickSeries;
                CandlestickSeriesChartOptionsYExtentsValueArr.push('high','low');
                break;
            case 'line':
                // 处理Line自定义参数
                Object.entries(chart.CandlestickSeries).forEach((item)=>{
                    if(item[0] === 'yAccessor'){
                        miniteLineSeries[item[0]] = yAccessorFunc(item[1]);
                    } else {
                        miniteLineSeries[item[0]] = item[1];
                    }
                });
                chartOptions.CandlestickSeriesChartOptions.LineSeries.unshift(miniteLineSeries);
                CandlestickSeriesChartOptionsYExtentsValueArr.push('close');
                break;
            case 'area':
                // 处理Area自定义参数
                Object.entries(chart.CandlestickSeries).forEach((item)=>{
                    if(item[0] === 'yAccessor'){
                        AreaSeriesOptions[item[0]] = yAccessorFunc(item[1]);
                    } else {
                        AreaSeriesOptions[item[0]] = item[1];
                    }
                });
                chartOptions.CandlestickSeriesChartOptions.AreaSeries = AreaSeriesOptions;
                CandlestickSeriesChartOptionsYExtentsValueArr.push('close');
                break;
            default:
                break;
        }
        // 调整蜡烛图yExtents参数
        CandlestickSeriesChartOptionsYExtentsArr.push(nameToFunc(CandlestickSeriesChartOptionsYExtentsValueArr));
        chartOptions.CandlestickSeriesChartOptions.options.yExtents = CandlestickSeriesChartOptionsYExtentsArr;

        // 增加均线提示工具参数
        MovingAverageTooltipOptions.options = MovingAverageTooltipOptionsSeries;
        GroupTooltipOptions.options = GroupTooltipOptionsSeries;

        // 增加均线提示工具
        // chartOptions.CandlestickSeriesChartOptions.MovingAverageTooltip = MovingAverageTooltipOptions;
        chartOptions.CandlestickSeriesChartOptions.GroupTooltip = GroupTooltipOptions;

        // 成交量图形选项
        let YAxisOptionsVol = Object.assign({},YAxisOptions,{ticks:2});
        let MouseCoordinateYOptionsVol =  Object.assign({},MouseCoordinateYOptions,{displayFormat:format(".2f")});
        BarSeriesOptions.fill = upDownColorFunc(chart.volume.fill);
        chartOptions.volumeChartOptions = {
            options: volumeOptions,
            BarSeries: BarSeriesOptions,
            MouseCoordinateY: MouseCoordinateYOptionsVol,
            YAxis:YAxisOptionsVol,
            EdgeIndicator:[]
        };

        // MACD图形选项
        let YAxisOptionsMACD = Object.assign({},YAxisOptions,{ticks:2});
        // let MouseCoordinateYOptionsMACD =  Object.assign({},MouseCoordinateYOptions,{displayFormat:format(".2f")});
        let YAxisOptionsMACDArr = [];
        let MouseCoordinateYOptionsMACDArr = [];

        // ATR图形选项
        let YAxisOptionsATR = Object.assign({},YAxisOptions,{ticks:2});
        ATRTooltipOptions.yDisplayFormat = format(`.${tickSize}f`);
        let YAxisOptionsATRArr = [];
        let MouseCoordinateYOptionsArr = [];

        // RSI图形选项
        let YAxisOptionsRSI = Object.assign({},YAxisOptions,{tickValues:[30, 50, 70]});
        let MouseCoordinateYOptionsRSI =  Object.assign({},MouseCoordinateYOptions,{displayFormat:format(".2f")});
        let YAxisOptionsRSIArr = [];
        let MouseCoordinateYOptionsRSIArr = [];

        // Elder Ray图形选项
        let YAxisOptionsElderRay = Object.assign({},YAxisOptions,{ticks:2});
        ElderRayTooltipOptions.yDisplayFormat = d => `bullPower: ${format(".2f")(d.bullPower)}, bearPower: ${format(".2f")(d.bearPower)}`;
        let YAxisOptionsElderRayArr = [];
        let MouseCoordinateYOptionsElderRayArr = [];

        // Force Index图形选项
        let YAxisOptionsForceIndex = Object.assign({},YAxisOptions,{ticks:2});
        let MouseCoordinateYOptionsForceIndex =  Object.assign({},MouseCoordinateYOptions,{displayFormat:format(".4s")});
        let YAxisOptionsForceIndexArr = [];
        let MouseCoordinateYOptionsForceIndexArr = [];

        // Stochastic Oscillator图形选项
        let YAxisOptionsStochasticOscillator = Object.assign({},YAxisOptions,{tickValues:[20, 50, 80]});
        // let MouseCoordinateYOptionsStochasticOscillator =  Object.assign({},MouseCoordinateYOptions,{displayFormat:format(".4s")});
        let YAxisOptionsStochasticOscillatorArr = [];
        let MouseCoordinateYOptionsStochasticOscillatorArr = [];

        // 处理自定义Y轴
        if(chart.CandlestickSeries.YAxis){
            chartOptions.CandlestickSeriesChartOptions.YAxis = [];
            chartOptions.CandlestickSeriesChartOptions.MouseCoordinateY = [];
            chartOptions.volumeChartOptions.YAxis = [];
            chartOptions.volumeChartOptions.MouseCoordinateY = [];
            Object.entries(chart.CandlestickSeries.YAxis).forEach((item)=>{
                // 蜡烛图Y轴和鼠标坐标
                chartOptions.CandlestickSeriesChartOptions.YAxis.push(Object.assign({},YAxisOptions,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                chartOptions.CandlestickSeriesChartOptions.MouseCoordinateY.push(Object.assign({},MouseCoordinateYOptions,item[1],{
                    at: item[0],
                    orient: item[0],
                }));

                // 是否显示 主图边缘指标
                if(settingObj.CandleEdge === true){
                    let newCandleEdgeIndicatorArr = lodash.cloneDeep(CandleEdgeIndicatorArr);
                    newCandleEdgeIndicatorArr.forEach((value)=>{
                        value.edgeAt = item[0];
                        value.orient = item[0];
                        value.itemType = item[0] === 'left'?"first":"last";
                    });
                    chartOptions.CandlestickSeriesChartOptions.EdgeIndicator.push(...newCandleEdgeIndicatorArr);
                }

                // 成交量Y轴和鼠标坐标
                chartOptions.volumeChartOptions.YAxis.push(Object.assign({},YAxisOptionsVol,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                chartOptions.volumeChartOptions.MouseCoordinateY.push(Object.assign({},MouseCoordinateYOptionsVol,item[1],{
                    at: item[0],
                    orient: item[0],
                }));

                // 是否显示 成交量边缘指标
                if(settingObj.VolEdge === true){
                    chartOptions.volumeChartOptions.EdgeIndicator.push(Object.assign({},EdgeIndicatorOptions,{
                        yAccessor: d => d.volume,
                        fill: "#0F0F0F",
                        itemType : item[0] === 'left'?"first":"last",
                        edgeAt : item[0],
                        orient : item[0],
                    }));
                }

                // macd指标Y轴和鼠标坐标
                YAxisOptionsMACDArr.push(Object.assign({},YAxisOptionsMACD,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                MouseCoordinateYOptionsMACDArr.push(Object.assign({},MouseCoordinateYOptions,item[1],{
                    at: item[0],
                    orient: item[0],
                }));
                // ATR指标Y轴和鼠标坐标
                YAxisOptionsATRArr.push(Object.assign({},YAxisOptionsATR,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                MouseCoordinateYOptionsArr.push(Object.assign({},MouseCoordinateYOptions,item[1],{
                    at: item[0],
                    orient: item[0],
                }));
                // RSI指标Y轴和鼠标坐标
                YAxisOptionsRSIArr.push(Object.assign({},YAxisOptionsRSI,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                MouseCoordinateYOptionsRSIArr.push(Object.assign({},MouseCoordinateYOptionsRSI,item[1],{
                    at: item[0],
                    orient: item[0],
                }));
                // Elder Ray指标Y轴和鼠标坐标
                YAxisOptionsElderRayArr.push(Object.assign({},YAxisOptionsElderRay,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                MouseCoordinateYOptionsElderRayArr.push(Object.assign({},MouseCoordinateYOptions,item[1],{
                    at: item[0],
                    orient: item[0],
                }));
                // Force Index指标Y轴和鼠标坐标
                YAxisOptionsForceIndexArr.push(Object.assign({},YAxisOptionsForceIndex,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                MouseCoordinateYOptionsForceIndexArr.push(Object.assign({},MouseCoordinateYOptionsForceIndex,item[1],{
                    at: item[0],
                    orient: item[0],
                }));
                // Stochastic Oscillator指标Y轴和鼠标坐标
                YAxisOptionsStochasticOscillatorArr.push(Object.assign({},YAxisOptionsStochasticOscillator,item[1],{
                    axisAt: item[0],
                    orient: item[0],
                }));
                MouseCoordinateYOptionsStochasticOscillatorArr.push(Object.assign({},MouseCoordinateYOptions,item[1],{
                    at: item[0],
                    orient: item[0],
                }));
            });
        }

        // 添加MACD图形
        let macdChartOptionsTemp = {
            MouseCoordinateY: MouseCoordinateYOptionsMACDArr,
            YAxis:YAxisOptionsMACDArr,
        };
        calculatorObj.macd&&calculatorObj.macd.forEach((item,i)=>{
            chartOptions[`macd${i}ChartOptions`] = lodash.merge({},macdChartOptionsTemp,{
                options:MACDOptionsArr[i],
                MACDSeries:MACDSeriesOptionsArr[i],
                MACDTooltip:MACDTooltipOptionsArr[i],
            });
        });

        // 添加ATR图形
        let atrChartOptionsTemp = {
            MouseCoordinateY: MouseCoordinateYOptionsArr,
            YAxis:YAxisOptionsATRArr,
        };
        calculatorObj.atr&&calculatorObj.atr.forEach((item,i)=>{
            chartOptions[`atr${i}ChartOptions`] = lodash.merge({},atrChartOptionsTemp,{
                options:ATROptionsArr[i],
                LineSeries: ATRSeriesOptionsArr[i],
                SingleValueTooltip:ATRTooltipOptionsArr[i],
            });
        });

        // 添加RSI图形
        let rsiChartOptionsTemp = {
            MouseCoordinateY: MouseCoordinateYOptionsRSIArr,
            YAxis:YAxisOptionsRSIArr,
        };

        calculatorObj.rsi&&calculatorObj.rsi.forEach((item,i)=>{
            chartOptions[`rsi${i}ChartOptions`] = lodash.merge({},rsiChartOptionsTemp,{
                // options:RSIOptionsArr[i],
                options:RSIOptions,
                RSISeries: RSISeriesOptionsArr[i],
                RSITooltip:RSITooltipOptionsArr[i],
            });
        });

        // 添加Elder Ray图形
        let elderRayChartOptionsTemp = {
            MouseCoordinateY: MouseCoordinateYOptionsElderRayArr,
            YAxis:YAxisOptionsElderRayArr,
            StraightLine:StraightLineOptions
        };

        calculatorObj.elderRay&&calculatorObj.elderRay.forEach((item,i)=>{
            chartOptions[`elderRay${i}ChartOptions`] = lodash.merge({},elderRayChartOptionsTemp,{
                options:ElderRayOptionsArr[i],
                ElderRaySeries: ElderRaySeriesOptionsArr[i],
                SingleValueTooltip:ElderRayTooltipOptionsArr[i],
            });
        });

        // 添加Force Index图形
        let forceIndexChartOptionsTemp = {
            MouseCoordinateY: MouseCoordinateYOptionsForceIndexArr,
            YAxis:YAxisOptionsForceIndexArr,
            StraightLine:StraightLineOptions
        };

        calculatorObj.forceIndex&&calculatorObj.forceIndex.forEach((item,i)=>{
            chartOptions[`forceIndex${i}ChartOptions`] = lodash.merge({},forceIndexChartOptionsTemp,{
                options:ForceIndexOptionsArr[i],
                AlternatingFillAreaSeries: ForceIndexSeriesOptionsArr[i],
                SingleValueTooltip:ForceIndexTooltipOptionsArr[i],
            });
        });

        // 添加Stochastic Oscillator图形
        let stochasticOscillatorChartOptionsTemp = {
            MouseCoordinateY: MouseCoordinateYOptionsStochasticOscillatorArr,
            YAxis:YAxisOptionsStochasticOscillatorArr,
            StraightLine:StraightLineOptions
        };

        calculatorObj.stochasticOscillator&&calculatorObj.stochasticOscillator.forEach((item,i)=>{
            chartOptions[`stochasticOscillator${i}ChartOptions`] = lodash.merge({},stochasticOscillatorChartOptionsTemp,{
                // options:StochasticOscillatorOptionsArr[i],
                options:StochasticOscillatorOptions,
                StochasticSeries: StochasticOscillatorSeriesOptionsArr[i],
                StochasticTooltip:StochasticOscillatorTooltipOptionsArr[i],
            });
        });

        delete chart.calculatorObj;
        let chartArr = Object.entries(chart);
        // 调整蜡烛图和成交量图的位置
        let CandlestickSeriesIndex = chartArr.findIndex((item,i)=>{
            return item[0] === "CandlestickSeries";
        });
        if(CandlestickSeriesIndex >= 0){
            chartArr.splice(0, 0, chartArr.splice(CandlestickSeriesIndex, 1)[0]);
        }
        let volumeIndex = chartArr.findIndex((item,i)=>{
            return item[0] === "volume";
        });
        if(volumeIndex >= 0) {
            chartArr.splice((CandlestickSeriesIndex>=0?1:0), 0, chartArr.splice(volumeIndex, 1)[0]);
        }
        // 处理chartArr中calculatorObj中的增加副图的图形
        for (let key in calculatorObj){
            if(isChartIndicator.includes(key)){
                calculatorObj[key].forEach((item,i)=>{
                    // console.log(item)
                    chartArr.push([key+i,item]);
                })
            } else {
                calculatorObj[key].forEach((item)=>{
                    chartOptions.CandlestickSeriesChartOptions = lodash.merge(chartOptions.CandlestickSeriesChartOptions,item);
                })
            }
        }

        // 设置图形参数
        chartArr.forEach((chartType,typeIndex)=>{
            // console.log(chartType)
            let chartTypeOptions = chartOptions[chartType[0]+'ChartOptions'];
            // console.log(chartTypeOptions)
            let chartTypeOptionsChagnes =  chartType[1];
            // console.log(chartType[1])
            // console.log(chartTypeOptionsChagnes)
            chartTypeOptions = lodash.merge({},chartTypeOptions,chartTypeOptionsChagnes);
            // console.log(chartTypeOptions)
            options.chart.push(chartTypeOptions);
            // console.log(chartTypeOptions)
        });

        // 计算高度
        if(margin){
            options.margin = margin;
            chartHight = height - margin.top - margin.bottom;
        } else {
            chartHight = height - 10 - 30;
        }
        let indicatorHight = parseInt(chartHight / ( options.chart.length + (CandlestickSeriesIndex>=0?2.2:1) ));

        // 设置各图形高度及位置  添加X轴分割线
        let XAxisOptionsWithoutTicks = Object.assign({},XAxisOptions,{showTicks:false,outerTickSize:0,strokeWidth:2});
        options.chart.forEach((item,i)=>{
            //
            if(i === 0){
                item.options.height = chartHight - indicatorHight*(options.chart.length - 1);
            } else {
                item.options.height = indicatorHight;
                item.options.origin = (w, h) => [0, h - (options.chart.length-i)*indicatorHight];
            }
            // 添加X轴分割线
            item.XAxis = XAxisOptionsWithoutTicks;
        });


        ZoomButtonsOptions.onReset = this.handleReset;
        // 处理 ZoomButtons 和 XAxis
        let repetitionOptions = {
            'ZoomButtons':ZoomButtonsOptions,
            'XAxis':XAxisOptions,
            MouseCoordinateX: MouseCoordinateXOptions,
        };
        Object.entries(repetitionOptions).forEach((item)=>{
            options.chart[options.chart.length - 1][item[0]] = item[1];
        });
        // console.log(options);
        return (
            <StockChart {...options}/>
        );
    }

    handleReset() {
        // firstFlag = true;
        this.setState({
            suffix: this.state.suffix + 1
        });
    }
}

TradingChart.contextTypes = {
    tradingRoomThis: PropTypes.object.isRequired,
};

export default injectIntl(TradingChart);