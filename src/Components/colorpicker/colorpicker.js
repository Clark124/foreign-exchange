import React from 'react'
import { SketchPicker } from 'react-color'
class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false,
            color: this.props.color? this.props.color:'#f17013',
            hexColor: this.props.color? this.props.color:'#f17013',
            opacity: this.props.opacity? (+this.props.opacity):1,
            disableAlpha:!(this.props.disableAlpha === false),
            showText:this.props.showText
        };
    }
    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };
    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };
    handleChange = (color) => {
        // console.log(color);
        this.setState({ color: color.rgb , opacity:color.rgb.a, hexColor:color.hex});
        let { onChange } = this.props;
        onChange && (typeof onChange === 'function') && onChange(color);
    };
    render() {
        let { color , hexColor , opacity ,displayColorPicker, disableAlpha , showText} = this.state;
        return (
            <div style={styles.colorpicker}>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.colorBox }>
                        <div style={{...styles.color , backgroundColor:hexColor , opacity }} />
                    </div>
                    {
                        showText ? <span style={styles.text}>{hexColor}{(disableAlpha === false)?`  (${(+opacity).toFixed(2)})`:null}</span> :null
                    }
                </div>
                { displayColorPicker ?
                    <div style={ styles.popover }>
                        <div style={ styles.cover } onClick={ this.handleClose }/>
                        <SketchPicker color={color} disableAlpha={disableAlpha} onChange={ this.handleChange } />
                    </div>
                    : null
                }
            </div>
        )
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.color !== this.props.color){
            this.setState({
                color:nextProps.color,
                hexColor:nextProps.color,
            })
        }
    }
}
var styles ={
    colorpicker:{
        // width: '36px',
        // height: '14px',
        display: 'inline-block'
    },
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        display: 'inline-block'
    },
    swatch: {
        height:'50px',
        lineHeight:'50px',
        padding: '5px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    colorBox:{
        padding: '5px',
        background: '#eaeaea',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    popover: {
        position: 'absolute',
        zIndex: '9999',
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
    text:{
        display: 'inline-block',
        marginLeft:'10px',
        fontSize:16,
        lineHeight:'16px',
    }
};
export default ColorPicker;