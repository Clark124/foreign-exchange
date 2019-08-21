import React, {Component} from 'react';
import { injectIntl , FormattedMessage } from 'react-intl'

import TradeRoomChart from '../traderoomchart/traderoomchart'
import './tradingroom.css'
import {post,tick_size,getEncodeString,getQueryString,readUrlToParams,getDecodeString,changeNumber} from  '../../utils/util'
import Moment from 'moment'
import lodash from 'lodash';
// 假数据
import { tsvParse, csvParse } from  "d3-dsv";
import {timeFormat, timeParse} from "d3-time-format";
// 假数据
// 假数据
function parseData(parse) {
    return function(d) {
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
    const promiseMSFT = fetch("//rrag.github.io/react-stockcharts/data/MSFT.tsv")
        .then(response => response.text())
        .then(data => tsvParse(data, parseData(parseDate)))
    return promiseMSFT;
}

const minuteData=[
    {title:'1 minute',value:'1 m',period:1},
    {title:'5 minute',value:'5 m',period:2},
    {title:'15 minute',value:'15 m',period:3},
    {title:'30 minute',value:'30m',period:4},
    {title:'1 Hour',value:'1 H',period:5},
    {title:'1 Day',value:'1 D',period:6},
    {title:'7 Day',value:'7 D',period:7},
    {title:'1 Month',value:'1 M',period:8},
]

class TradingRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url:'',
            urlParam:'',
            data:[]
        }
    }

    render() {
        return (
            this.state.data.length>0?
                <TradeRoomChart
                    data={this.state.data}
                    width={window.innerWidth}
                    height={window.innerHeight - 60}
                    minuteData={minuteData}  //可根据股票或者外汇来设定
                    periodCallback={this.periodCallback} //周期回调
                    urlParam={this.state.urlParam}
                />:null
        );
    }
    componentDidMount(){
        clearInterval(this.timer)

        window.addEventListener('resize',this.update);
        if(!localStorage.getItem('TICK_SIZE')){
            tick_size().then(()=>{
                this.getUrlParam()
            })
        }else{
            this.getUrlParam()
        }
        // getData().then(data => {
        //     console.log(data)
        //     this.setState({ data:data })
        // });
        // console.log(getEncodeString('https://www.bitstation.co/real/ticker?symbols=BTCUSD'))

    }
    getUrlParam=(period)=>{
        if(getQueryString('url1')){
            let url1=decodeURIComponent(getDecodeString(getQueryString('url1')));  //行情url
            let urlParam=readUrlToParams(url1);
            if(period){
                urlParam={...urlParam,period:period}
            }
            let quoteUrl=url1.split('?')[0];
            let code=urlParam.code?urlParam.code:urlParam.symbols
            let tickSize=urlParam.symbols?JSON.parse(localStorage.getItem('TICK_SIZE'))[urlParam.symbols]:2
            //第一次取出行情
            post(quoteUrl,urlParam).then((data)=>{
                let newArray=changeNumber(data.data[code],tickSize)
                // console.log(newArray)
                this.setState({
                    data:newArray,
                    urlParam,
                    quoteUrl
                })

                //刷新行情
                if(isNaN(this.state.urlParam.period)){
                    if(this.state.urlParam.period.indexOf('D')===-1&&this.state.urlParam.period.indexOf('M')===-1){
                        this.tickFunc()
                        this.timer=setInterval(()=>{
                            this.tickFunc()
                        },5000)
                    }
                }else{
                    if(this.state.urlParam.period<6){
                        this.tickFunc()
                        this.timer=setInterval(()=>{
                            this.tickFunc()
                        },5000)
                    }
                }

                //取买卖点
                if(getQueryString('url3')){
                    let url3=decodeURIComponent(getDecodeString(getQueryString('url3')));  //买卖点
                    let tradeUrl=url3.split('?')[0]
                    let tradeParam=readUrlToParams(url3);
                    // const alert=[{
                    //     type:1,
                    //     time:'2018-10-05 10:38:00'
                    // },{
                    //     type:3,
                    //     time:'2018-10-05 10:40:00'
                    // }]

                    post(tradeUrl,tradeParam).then((data)=>{
                        let alert=data.data
                        if(alert.length>0){
                            let timeMinute=alert[0].time.split(' ')[1]
                            if(timeMinute.split(':')[0]==='00'&&timeMinute.split(':')[1]==='00'&&timeMinute.split(':')[2]==='00'){//日期为YYYY-MM-DD
                                newArray.forEach((data)=>{
                                    alert.forEach((item)=>{
                                        if(Moment(data.date).format('YYYY-MM-DD')===Moment(item.time,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')){
                                            data.signal = item.type === 1 ? 'buy' : 'sell';
                                        }
                                    })
                                })
                            }else{
                                newArray.forEach((data)=>{
                                    alert.forEach((item)=>{
                                        if(Moment(data.date).format('YYYY-MM-DD HH:mm:ss')===item.time){
                                            data.signal = item.type === 1 ? 'buy' : 'sell';
                                        }
                                    })
                                })
                            }
                        }
                    })
                }

            })

        }
    }
    tickFunc(){
        var newArray=this.state.data;
        // console.log(newArray)
        let {quoteUrl}=this.state
        let newUrlParam=lodash.cloneDeep(this.state.urlParam)
        let hour=Moment(new Date()).format('HH')
        let minute=Moment(new Date()).format('mm')
        if(getQueryString('url2')){
            let url2=decodeURIComponent(getDecodeString(getQueryString('url2')));  //刷新url
            let tickerUrl=url2.split('?')[0]
            let tickerParam=readUrlToParams(url2);
            let tickSize=tickerParam.symbols?JSON.parse(localStorage.getItem('TICK_SIZE'))[tickerParam.symbols]:2
            //最新行情
            post(tickerUrl,tickerParam).then((data)=>{
                let newTicker=data.data
                newUrlParam={...newUrlParam,count:2}
                //替换正在刷新的一根k线的前一根k线（成交量数据可能不准确）
                post(quoteUrl,newUrlParam).then((data)=>{
                    // console.log(data)
                    let preKlineData=data.data[newUrlParam.code][0]
                    newTicker.forEach((item)=>{
                        let current=item
                        if(isNaN(this.state.urlParam.period)){
                            var dateString=this.state.urlParam.period.indexOf('D')>-1||this.state.urlParam.period.indexOf('M')>-1?'YYYY-MM-DD':'YYYY-MM-DD HH:mm'
                        }else{
                            var dateString = this.state.urlParam.period>=6?'YYYY-MM-DD':'YYYY-MM-DD HH:mm'
                        }

                        let date1Y=Moment(newArray[newArray.length-1].date).format('YYYY-MM-DD')
                        let hour1Y=Moment(newArray[newArray.length-1].date).format('HH:mm')

                        let date2Y=Moment(new Date(current.timestamp)).format('YYYY-MM-DD')
                        let hour2Y=Moment(new Date(current.timestamp)).add(1,'minute').format('HH:mm')
                        let tickIndex =-1
                        if(hour1Y==hour2Y){
                            tickIndex =newArray.length-1
                        }
                        //交易时间内

                        let dateYYY=Moment(current.timestamp).add(1,'minute').format('YYYY/MM/DD HH:mm')

                        if(typeof this.state.urlParam.period ==='number'){  //股票  typeof this.state.urlParam.period ==='number'
                            if (hour == 9 && minute >= 30 || hour == 9 && minute <= 60 || hour == 10 && minute >= 0 && minute < 60 || hour == 11 && minute <= 30 || hour >= 13 && hour <= 14 && minute >= 0 && minute < 60 || hour == 15 && minute >= 0 && minute <= 30) {
                                if(tickIndex===-1){
                                    newArray.push({
                                        close:+(item.last).toFixed(tickSize),
                                        high:+(item.last).toFixed(tickSize),
                                        low:+(item.last).toFixed(tickSize),
                                        open:+(item.last).toFixed(tickSize),
                                        date:new Date(dateYYY),
                                        volume:0,
                                        firstVolumeTotal:item.volumeQuote?+item.volumeQuote:0
                                    })

                                    let preKlineIndex=newArray.findIndex(v=>Moment(v.date).format(dateString)===Moment(new Date(preKlineData.timestamp)).format(dateString))

                                    if(preKlineIndex>-1){
                                        // console.log(preKlineIndex,preKlineData.volumeQuote)
                                        newArray[preKlineIndex].volume=+preKlineData.volumeQuote
                                        newArray[preKlineIndex].open=preKlineData.open
                                        newArray[preKlineIndex].close=preKlineData.close
                                        newArray[preKlineIndex].high=preKlineData.max
                                        newArray[preKlineIndex].low=preKlineData.min
                                    }
                                }
                                if(tickIndex>-1){
                                    newArray[tickIndex].high=item.last>newArray[tickIndex].high?+(item.last).toFixed(tickSize):+(newArray[tickIndex].high).toFixed(tickSize)
                                    newArray[tickIndex].low=item.last< newArray[tickIndex].low?+(item.last).toFixed(tickSize):+(newArray[tickIndex].low).toFixed(tickSize)
                                    newArray[tickIndex].close=(item.last).toFixed(tickSize)
                                    newArray[tickIndex].volume=item.volumeQuote-newArray[newArray.length-1].volumeQuote?newArray[newArray.length-1].volumeQuote:0
                                }
                            }
                        }else{
                            if(tickIndex===-1){
                                newArray.push({
                                    close:+(item.last).toFixed(tickSize),
                                    high:+(item.last).toFixed(tickSize),
                                    low:+(item.last).toFixed(tickSize),
                                    open:+(item.last).toFixed(tickSize),
                                    date:new Date(dateYYY),
                                    volume:0,
                                    firstVolumeTotal:item.volumeQuote?+item.volumeQuote:0
                                })
                                let preKlineIndex=newArray.findIndex(v=>Moment(v.date).format(dateString)===Moment(new Date(preKlineData.timestamp)).format(dateString))

                                if(preKlineIndex>-1){
                                    // console.log(preKlineIndex,preKlineData.volumeQuote)
                                    newArray[preKlineIndex].volume=preKlineData.volumeQuote
                                    newArray[preKlineIndex].open=preKlineData.open
                                    newArray[preKlineIndex].close=preKlineData.close
                                    newArray[preKlineIndex].high=preKlineData.max
                                    newArray[preKlineIndex].low=preKlineData.min
                                }
                            }
                            if(tickIndex>-1){

                                newArray[tickIndex].high=item.last>newArray[tickIndex].high?+(item.last).toFixed(tickSize):+(newArray[tickIndex].high).toFixed(tickSize)
                                newArray[tickIndex].low=item.last< newArray[tickIndex].low?+(item.last).toFixed(tickSize):+(newArray[tickIndex].low).toFixed(tickSize)
                                newArray[tickIndex].close=(item.last).toFixed(tickSize)
                                newArray[tickIndex].volume=item.volumeQuote-newArray[newArray.length-1].firstVolumeTotal?newArray[newArray.length-1].firstVolumeTotal:0
                            }
                        }

                    })
                    this.setState({
                        data:lodash.cloneDeep(newArray)
                    })
                })



            })
        }
    }
    periodCallback=(item)=>{
        console.log(item)
        clearInterval(this.timer)
        this.getUrlParam(item.period)
    }
    update = ()=>{
        this.forceUpdate()
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.update);
    }
}


export default injectIntl(TradingRoom);