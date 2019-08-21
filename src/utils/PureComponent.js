import React from "react";
import lodash from 'lodash';

function identicallyEqual(value, other){
    return lodash.isEqual(value, other)
}

class PureComponent extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return !identicallyEqual(this.props, nextProps)
			|| !identicallyEqual(this.state, nextState)
			|| !identicallyEqual(this.context, nextContext);
	}
}

export default PureComponent;
