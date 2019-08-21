

import React, { Component } from "react";
import PropTypes from "prop-types";
import { functor } from "react-stockcharts/lib/utils";

class SvgPathAnnotation extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e) {
		const { onClick } = this.props;

		if (onClick) {
			const { xScale, yScale, datum } = this.props;
			onClick({ xScale, yScale, datum }, e);
		}
	}
	render() {
		const { className, stroke, opacity } = this.props;
		const { xAccessor, xScale, yScale } = this.props;

		const { x, y, fill, tooltip, text } = helper(this.props, xAccessor, xScale, yScale);
		return (<g className={className} onClick={this.handleClick}>
			<title>{tooltip}</title>
			<circle cx={x} cy={y} r="8" stroke={stroke} fill={fill} opacity={fill === '#000000' ? 0 : opacity}/>
			<text stroke="null" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" id="svg_2" y={y ? (y + 3) : ''} x={x ? (x - 5) : ''} strokeOpacity="null" strokeWidth="0" fill={"#ffffff"} opacity={opacity}>{tooltip || ''}</text>
		</g>);
	}
}

function helper(props, xAccessor, xScale, yScale) {
	const { x, y, datum, fill, tooltip, plotData } = props;

	const xFunc = functor(x);
	const yFunc = functor(y);

	const [xPos, yPos] = [xFunc({ xScale, xAccessor, datum, plotData }), yFunc({ yScale, datum, plotData })];

	return {
		x: xPos,
		y: yPos,
		fill: functor(fill)(datum),
		tooltip: functor(tooltip)(datum),
	};
}

SvgPathAnnotation.propTypes = {
	className: PropTypes.string,
	path: PropTypes.func.isRequired,
	onClick: PropTypes.func,
	xAccessor: PropTypes.func,
	xScale: PropTypes.func,
	yScale: PropTypes.func,
	datum: PropTypes.object,
	stroke: PropTypes.string,
	// fill: PropTypes.string,
	opacity: PropTypes.number,
};

SvgPathAnnotation.defaultProps = {
	className: "react-stockcharts-svgpathannotation",
	opacity: 1,
	x: ({ xScale, xAccessor, datum }) => xScale(xAccessor(datum)),
};

export default SvgPathAnnotation;