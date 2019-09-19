import React, { Component } from 'react'
import './index.less'
import icon_cancel from './assets/icon_cancel.png'

import { sendActiveEamil } from '../../../../service/serivce'
import { message } from 'antd';
import Loading from '../../../Loading/index'

interface Iprops {
    closeVerificate:any;

}
interface IState{
    status:string;
}

export default class Verification extends Component<Iprops> {
    state:IState={
        status:''
    }
    onResend() {
        const userId = localStorage.getItem('userId')
        const data = {
            user_id: userId
        }
        this.setState({status:"loading"})
        sendActiveEamil(data).then(res => {
            if (res.data === 'fail') {
                message.error('send fail')
                this.props.closeVerificate()
                this.setState({status:"fail"})
            }else{
                message.success('send success,please check your email')
                this.props.closeVerificate()
                this.setState({status:"success"})
            }
        }).catch(err => {
            this.setState({status:"fail"})
        })
    }
   
    render() {
        const {status} = this.state
        return (
            <div className="verificate-wrapper">
                {status==='loading'?<Loading/>:null}
                <div className="verificate">
                    <img src={icon_cancel} alt="" className="icon-cancel" onClick={() => this.props.closeVerificate()} />
                    <div className="title">Eamil Verification</div>
                    <div className="text-info">
                        Please log in your email and complete the verification in 24 hours.
                    </div>
                    <div className="text-info">If you can not find your verification email, please check your spam box.</div>
                    <div className="btn send" onClick={this.onResend.bind(this)}>Resend</div>
                </div>
            </div>
        )
    }
}