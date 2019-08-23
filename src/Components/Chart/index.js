
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
// import { curveMonotoneX } from "d3-shape";

import { ChartCanvas, Chart ,ZoomButtons} from "react-stockcharts";
import {
    LineSeries,
    // AreaSeries,
    BarSeries,
	CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";

import {
    CrossHairCursor,
    // EdgeIndicator,
    // CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import {
    HoverTooltip,
    OHLCTooltip,
    // MovingAverageTooltip,
} from "react-stockcharts/lib/tooltip";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

const dateFormat = timeFormat("%Y-%m-%d %-I:%M");
// const numberFormat = format(".10f");
function tooltipContent(ys) {
    return ({ currentItem, xAccessor }) => {
        return {
            x: dateFormat(xAccessor(currentItem)),
            y: [
                {
                    label: "open",
                    value: currentItem.open,
                    stroke:'#3399ff'
                },
                {
                    label: "high",
                    value: currentItem.high,
                    stroke:'#3399ff'
                },
                {
                    label: "low",
                    value: currentItem.low,
                    stroke:'#3399ff'
                },
                {
                    label: "close",
                    value: currentItem.close,
                    stroke:'#3399ff'
                },
                {
                    label: "volume",
                    value: currentItem.volume,
                    stroke:'#3399ff'
                },

            ]
                .concat(
                    ys.map(each => ({
                        label: each.label,
                        value: each.value(currentItem),
                        stroke: each.stroke
                    }))
                )
                .filter(line => line.value)
        };
    };
}
class CandleStickChartWithDarkTheme  extends React.Component {

	render() {
        let upColor = '#ff6060';
        let downColor = '#2be594';
		const { type, data: initialData, width, ratio,height } = this.props;
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);
		const xExtents = [
			xAccessor(last(data)),
			xAccessor(data[data.length > 60 ? data.length -  60 : 0 ])
		];
		return (
			<ChartCanvas
					height={height?height:300}
					ratio={ratio}
					width={width}
					margin={{ left: 20, right: this.props.period === 1 ? 20 : 40, top: 10, bottom: this.props.period === 1 ? 20 : 28 }}
					type={type}
					seriesName="MSFT"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={xExtents}>
				{this.props.period === 1 ? <Chart id={0} yExtents={d => d.close} height={200}>
					<HoverTooltip
						tooltipContent={tooltipContent([])}
						fontSize={14}
						fill="#3F4B57"
						bgFill="transparent"
						fontFill="#8C9AA7"
						bgOpacity={0.5}
						stroke="#3F4B57"
					/>
					<LineSeries
						yAccessor={d => d.close}
						stroke="#4b8fdf"/>
				</Chart> :
				<Chart id={0} yExtents={d => [d.high, d.low]}  height={266}>
					<HoverTooltip
						tooltipContent={tooltipContent([])}
						fontSize={14}
						fill="#3F4B57"
						bgFill="transparent"
						fontFill="#8C9AA7"
						bgOpacity={0.5}
						stroke="#3F4B57"
					/>
					{/* 日期显示 */}
					<OHLCTooltip origin={[-16, 0]} textFill="#8C9AA7" />
					<XAxis axisAt="bottom" orient="bottom" ticks={6} stroke='#2B3238'
					tickStroke="#758795"/>
					<YAxis axisAt="right" orient="right" ticks={5}  stroke='#2B3238'
					tickStroke= "#758795"/>
					{/* 十字光标 */}
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					{/* k线图 */}
					<CandlestickSeries fill={d => d.close > d.open ? upColor : downColor } stroke={d => d.close > d.open ? upColor : downColor} wickStroke={d => d.close > d.open ? upColor : downColor } opacity="1"/>
					{/* 缩放按钮 */}
					<ZoomButtons />
				</Chart> }
				<Chart id={2} yExtents={d => d.volume} height={80} origin={(w, h) => [0, h - 122]}>
					{/*<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>*/}
					<BarSeries yAccessor={d => d.volume}
							//    fill={d => d.close > d.open ? "#e85d5d" : "#72e890" }
                               fill={d => d.close > d.open ? upColor : downColor }
							   opacity={1}

					/>
					{/*<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d %-I:%M")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />*/}
				</Chart>

				{/*十字光标虚线*/}
				<CrossHairCursor stroke="#FFFFFF"/>
			</ChartCanvas>
		);
	}

}

CandleStickChartWithDarkTheme.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithDarkTheme.defaultProps = {
	type: "svg",
};
CandleStickChartWithDarkTheme  = fitWidth(CandleStickChartWithDarkTheme );

export default CandleStickChartWithDarkTheme;

