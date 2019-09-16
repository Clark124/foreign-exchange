import React, { Component } from 'react'
import './index.less'
import icon_cancel from './assets/icon_cancel.png'

import { sendActiveEamil } from '../../../../service/serivce'
import { message } from 'antd';

interface Iprops {
    closeVerificate:any;
}

export default class Verification extends Component<Iprops> {

    onResend() {
        const userId = localStorage.getItem('userId')
        const data = {
            user_id: userId
        }
        sendActiveEamil(data).then(res => {
            if (res.data === 'fail') {
                message.error('send fail')
            }
        }).catch(err => {

        })
    }
   
    render() {
        return (
            <div className="verificate-wrapper">
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