import React,{Component} from 'react'
import './index.less'

export default class Build extends Component{
    state = {
        step:0
    }
    render(){
        // const { step } = this.state
        return (
            <div className="build-wrapper container">
                 <div className="header-link">
                    <span className="btn">Ai-Trade</span>
                    <span className="arrow">></span>
                    <span className="btn title">Build Strategy</span>
                </div>
                <div className="step-img-wrapper">
                    {/* {step === 0 ? <img src={step_1} alt="" /> : null}
                    {step === 1 ? <img src={step_2} alt="" /> : null}
                    {step === 2 ? <img src={step_3} alt="" /> : null}
                    {step === 3 ? <img src={step_4} alt="" /> : null}
                    <span className={step === 0 ? "step-1 active" : 'step-1'} >1、选择股票池</span>
                    <span className={step === 1 ? "step-2 active" : 'step-2'} >2、交易设置</span>
                    <span className={step === 2 ? "step-3 active" : 'step-3'} >3、大盘择时</span>
                    <span className={step === 3 ? "step-4 active" : 'step-4'} >4、风险设置</span> */}
                   
                </div>
            </div>
        )
    }
}