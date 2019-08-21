import React from 'react';
import PropTypes from "prop-types";
import PureComponent from "../../utils/PureComponent";

import { ChartCanvas, Chart ,ZoomButtons} from "react-stockcharts";
import {
    LineSeries,
    AreaSeries,
    BarSeries,
    CandlestickSeries,
    MACDSeries,
    OHLCSeries,
    KagiSeries,
    BollingerSeries,
    RSISeries,
    SARSeries,
    ElderRaySeries,
    AlternatingFillAreaSeries,
    StochasticSeries,
    VolumeProfileSeries,
} from "react-stockcharts/lib/series";
import { YAxis } from "react-stockcharts/lib/axes";
import {XAxis} from '../customchart/xaxis/XAxis'

import {
    CrossHairCursor,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import {
    HoverTooltip,
    OHLCTooltip,
    MovingAverageTooltip,
    // MACDTooltip,
    GroupTooltip,
    BollingerBandTooltip,
    SingleValueTooltip,
    RSITooltip,
    StochasticTooltip,
} from "react-stockcharts/lib/tooltip";

import { MACDTooltipCustom } from "../customchart/tooltip/MACDTooltip";

import {
    Annotate,
    // SvgPathAnnotation,
    // buyPath,
    // sellPath,
} from "react-stockcharts/lib/annotation";

import {
    mouseBasedZoomAnchor,
    lastVisibleItemBasedZoomAnchor,
    rightDomainBasedZoomAnchor,
} from "react-stockcharts/lib/utils/zoomBehavior";

import {
    // ClickCallback,
    TrendLine,
    FibonacciRetracement,
    EquidistantChannel,
    StandardDeviationChannel,
    GannFan,
    InteractiveText,
    InteractiveYCoordinate,
    DrawingObjectSelector,
} from "react-stockcharts/lib/interactive";

import { fitWidth } from "react-stockcharts/lib/helper";

const componentMap = {
    XAxis,
    YAxis,
    LineSeries,
    AreaSeries,
    BarSeries,
    CandlestickSeries,
    MACDSeries,
    OHLCSeries,
    KagiSeries,
    BollingerSeries,
    RSISeries,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY,
    HoverTooltip,
    OHLCTooltip,
    MovingAverageTooltip,
    MACDTooltip:MACDTooltipCustom,
    GroupTooltip,
    BollingerBandTooltip,
    SingleValueTooltip,
    RSITooltip,
    StochasticTooltip,
    SARSeries,
    ElderRaySeries,
    AlternatingFillAreaSeries,
    StochasticSeries,
    VolumeProfileSeries,
    ZoomButtons,
    Annotate,
    mouseBasedZoomAnchor,
    lastVisibleItemBasedZoomAnchor,
    rightDomainBasedZoomAnchor,
};

// TrendLine外观样式
const TrendLineAppearance = {
    typeMark:'TrendLine',
    stroke: "#53B78C",
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeDasharray: "Solid",
    edgeStrokeWidth: 1,
    edgeFill: "#FFFFFF",
    edgeStroke: "#000000",
    r: 6,
};

// FibonacciRetracement外观样式
const FibonacciRetracementAppearance = {
    typeMark:'FibonacciRetracement',
    stroke: "#53B78C",
    strokeWidth: 1,
    strokeOpacity: 1,
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 11,
    fontFill: "#FFFFFF",
    edgeStroke: "#000000",
    edgeFill: "#FFFFFF",
    nsEdgeFill: "#4BFB5F",
    edgeStrokeWidth: 1,
    r: 5,
};

// EquidistantChannel外观样式
const EquidistantChannelAppearance = {
    typeMark:'EquidistantChannel',
    stroke: "#53B78C",
    strokeOpacity: 1,
    strokeWidth: 1,
    fill: "#D1A3FF",
    fillOpacity: 0.7,
    edgeStroke: "#000000",
    edgeFill: "#FFFFFF",
    edgeFill2: "#35D4FC",
    edgeStrokeWidth: 1,
    r: 5,
};

// StandardDeviationChannel外观样式
const StandardDeviationChannelAppearance = {
    typeMark:'StandardDeviationChannel',
    stroke: "#53B78C",
    strokeOpacity: 1,
    strokeWidth: 1,
    fill: "#8AAFE2",
    fillOpacity: 0.2,
    edgeStroke: "#000000",
    edgeFill: "#FFFFFF",
    edgeStrokeWidth: 2,
    r: 5,
};

// GannFanAppearance外观样式
const GannFanAppearance = {
    typeMark:'GannFan',
    stroke: "#53B78C",
    fillOpacity: 0.2,
    strokeOpacity: 1,
    strokeWidth: 1,
    edgeStroke: "#000000",
    edgeFill: "#FFFFFF",
    edgeStrokeWidth: 1,
    r: 5,
    fill: [
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
    ],
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 12,
    fontFill: "#FFFFFF",
};

// InteractiveTextAppearance外观样式
const InteractiveTextAppearance = {
    typeMark:'InteractiveText',
    bgFill: "#D3D3D3",
    bgOpacity: 1,
    textFill: "#F10040",
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    text: "Text..."
};

class StockChart extends PureComponent {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const { height,margin,type,suffix, data, width, ratio ,chart,xScale ,xAccessor,displayXAccessor,xExtents,CrossHairCursor:CrossHairCursorData , ZoomAndPan} = this.props;
        ZoomAndPan.zoomAnchor = componentMap[ZoomAndPan.zoomAnchor];  // 映射缩放锚点
        let that = this.context.tradingRoomThis;  //  tradingRoom中的this
        return (
            <ChartCanvas
                ref={(node)=>that.canvasNode = node}
                height={height}
                ratio={ratio}
                width={width}
                margin={margin}
                type={type}
                seriesName={`BitStation_${suffix}`}
                data={data}
                xScale={xScale}
                xAccessor={xAccessor}
                {...ZoomAndPan}
                displayXAccessor={displayXAccessor}
                xExtents={xExtents}
            >
                {/* render Charts*/}
                {
                    chart.map((item,i)=>
                        item?<Chart key={i} id={i+1} {...item.options}>
                            {
                                Object.keys(item).map((componentName)=> {
                                    let Component = componentMap[componentName];
                                    return (componentMap[componentName]?
                                        isArray(item[componentName])?
                                            item[componentName].map((opts,j)=>
                                                <Component key={`chart+ ${(i+1)} + ${componentName.toString() + j}`} {...opts}/>
                                            ):
                                            <Component key={`chart+ ${(i+1)} + ${componentName.toString()}`} {...item[componentName]}/>
                                        :null);
                                })
                            }
                            {/*<ClickCallback
                                onMouseMove={ (moreProps, e) => {
                                    console.log("onMouseMove", moreProps, e)
                                    console.log(moreProps.currentItem.close.toFixed(10))
                                    console.log(moreProps.currentItem.open.toFixed(10))
                                    let { tradeData } = that.state;
                                    tradeData.last = moreProps.currentItem.close.toFixed(10)
                                    that.setState({tradeData})
                                } }
                            />*/}
                            <TrendLine
                                ref={that.saveInteractiveNodes("TrendLine", i+1)}
                                enabled={that.state.drawObj.TrendLine.enable}
                                snap={false}
                                type="LINE"
                                onStart={()=>that.getInteractiveNode('TrendLine',i+1)}
                                onComplete={that.onDrawCompleteChart}
                                trends={that.state.drawObj.TrendLine[`data_${i+1}`]}
                                appearance={TrendLineAppearance}
                            />
                            <FibonacciRetracement
                                ref={that.saveInteractiveNodes("FibonacciRetracement", i+1)}
                                enabled={that.state.drawObj.FibonacciRetracement.enable}
                                type="BOUND"
                                onStart={()=>that.getInteractiveNode('FibonacciRetracement',i+1)}
                                onComplete={that.onDrawCompleteChart}
                                retracements={that.state.drawObj.FibonacciRetracement[`data_${i+1}`]}
                                appearance={FibonacciRetracementAppearance}
                                currentPositionStroke="#FFFFFF"
                            />
                            <EquidistantChannel
                                ref={that.saveInteractiveNodes("EquidistantChannel", i+1)}
                                enabled={that.state.drawObj.EquidistantChannel.enable}
                                onStart={()=>that.getInteractiveNode('EquidistantChannel',i+1)}
                                onComplete={that.onDrawCompleteChart}
                                channels={that.state.drawObj.EquidistantChannel[`data_${i+1}`]}
                                appearance={EquidistantChannelAppearance}
                            />
                            <StandardDeviationChannel
                                ref={that.saveInteractiveNodes("StandardDeviationChannel", i+1)}
                                enabled={that.state.drawObj.StandardDeviationChannel.enable}
                                onStart={()=>that.getInteractiveNode('StandardDeviationChannel',i+1)}
                                onComplete={that.onDrawCompleteChart}
                                channels={that.state.drawObj.StandardDeviationChannel[`data_${i+1}`]}
                                appearance={StandardDeviationChannelAppearance}
                            />
                            <GannFan
                                ref={that.saveInteractiveNodes("GannFan", i+1)}
                                enabled={that.state.drawObj.GannFan.enable}
                                onStart={()=>that.getInteractiveNode('GannFan',i+1)}
                                onComplete={that.onDrawCompleteChart}
                                fans={that.state.drawObj.GannFan[`data_${i+1}`]}
                                appearance={GannFanAppearance}
                            />
                            <InteractiveText
                                ref={that.saveInteractiveNodes("InteractiveText", i+1)}
                                enabled={that.state.drawObj.InteractiveText.enable}
                                defaultText={InteractiveTextAppearance}
                                onDragComplete={that.onDragComplete}
                                textList={that.state.drawObj.InteractiveText[`data_${i+1}`]}
                            />
                            <InteractiveYCoordinate
                                ref={that.saveInteractiveNodes("InteractiveYCoordinate", i+1)}
                                enabled={that.state.drawObj.InteractiveYCoordinate.enable}
                                onDragComplete={that.onDragComplete}
                                onDelete={that.onDrawDelete}
                                yCoordinateList={that.state.drawObj.InteractiveYCoordinate[`data_${i+1}`]}
                            />

                        </Chart>:null
                    )
                }
                {/* render CrossHairCursor*/}
                {
                    CrossHairCursorData?
                        <CrossHairCursor {...CrossHairCursorData}/>:
                        null
                }
                <DrawingObjectSelector
                    enabled={that.state.drawObj.selectorEnable}
                    getInteractiveNodes={that.getInteractiveNodes}
                    drawingObjectMap={{
                        TrendLine: "trends",
                        FibonacciRetracement: "retracements",
                        EquidistantChannel: "channels",
                        StandardDeviationChannel: "channels",
                        GannFan:'fans',
                        InteractiveText: "textList",
                        InteractiveYCoordinate: "yCoordinateList"
                    }}
                    onSelect={that.handleSelection}
                />
            </ChartCanvas>
        );
    }
}

StockChart.propTypes = {
    data: PropTypes.array.isRequired,  // ChartCanvas 数据
    width: PropTypes.number.isRequired,  // ChartCanvas 宽度
    ratio: PropTypes.number.isRequired,  // ChartCanvas 比例
    type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,  // ChartCanvas 类型
    height: PropTypes.number,  // ChartCanvas 总高度
    margin: PropTypes.shape({
        left: PropTypes.number.isRequired,
        right: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        bottom: PropTypes.number.isRequired
    }),  // ChartCanvas margin
    // Chart: PropTypes.objectOf(PropTypes.number),  // ChartCanvas Chart
    crossHairCursor: PropTypes.object,  // ChartCanvas 十字光标
};

StockChart.defaultProps = {
    type: "svg",
    height:300,
    margin:{ left: 40, right: 40, top: 10, bottom: 30 },
    crossHairCursor:{stroke:"#FFFFFF"}
};

StockChart.contextTypes = {
    tradingRoomThis: PropTypes.object.isRequired,
};

StockChart = fitWidth(StockChart );
export default StockChart;

function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}