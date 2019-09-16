import React, { Component } from 'react'
import './index.less'
import icon_cancel from './assets/icon_cancel.png'
import { message, Checkbox } from 'antd'
import { register } from '../../../../service/serivce'
import { injectIntl, FormattedMessage } from 'react-intl'

class Register extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            passwordConfirm: "",
            agree: true,
        }
    }
    onChangeEmain(e) {
        this.setState({ email: e.target.value })
    }
    onChangePassword(e) {
        this.setState({ password: e.target.value })
    }


    onSubmit() {
        const { email, password, passwordConfirm, agree } = this.state

        if (password === "" || passwordConfirm === "" || password.length < 6) {
            message.error('请输入正确的密码')
            return
        }
        if (password !== passwordConfirm) {
            message.error('密码不一致')
            return
        }

        if (!agree) {
            message.error('请阅读并同意用户协议')
            return
        }
        const data = {
            email,
            password,
        }
        console.log(data)
        register(data).then(res => {
            if (res.data.id) {
                localStorage.setItem('userId', res.data.id)
                message.success("Register success")
                this.props.successRegister()
            }
        })



    }
    render() {
        const { email, password, passwordConfirm, agree } = this.state
        return (
            <div className="register-wrapper">
                <div className="login">
                    <img src={icon_cancel} alt="" className="icon-cancel" onClick={() => this.props.closeRegister()} />
                    <div className="title"><FormattedMessage id={'createAccount'} defaultMessage={'Create A New Account'} /></div>
                    <div className="input-wrapper">
                        <div className="text-title"><FormattedMessage id={'email'} defaultMessage={'Email'} /></div>
                        <input className="phone" type="email" placeholder="email address" onChange={this.onChangeEmain.bind(this)} value={email} />
                        <div className="text-title"><FormattedMessage id={'password'} defaultMessage={'Password'} /></div>
                        <input className="password" type="password" placeholder="6-20 letters and numbers" onChange={(e) => this.setState({ password: e.target.value })} value={password} />
                        <div className="text-title"><FormattedMessage id={'confirmPassword'} defaultMessage={'Confirm'} /></div>
                        <input className="password" type="password" placeholder="confirm password" onChange={(e) => this.setState({ passwordConfirm: e.target.value })} value={passwordConfirm} />
                        <div className="check-box">
                            <Checkbox>Google Authentication</Checkbox>
                        </div>
                        <div className="login-btn" onClick={this.onSubmit.bind(this)}><FormattedMessage id={'register'} defaultMessage={'Register'} /></div>
                        <div className="footer">
                            <div className="forgot">
                                <Checkbox checked={agree} style={{ marginRight: 5 }} onChange={(e) => this.setState({ agree: e.target.checked })} />read and agree to the  "
                                <span className="agreement" onClick={() => this.props.onShowAgreement()}>Term of Service</span>"
                            </div>

                        </div>
                        <div className="to-register" >Existing Account, <span className="btn" onClick={() => this.props.toLogin()}>SIGN IN</span></div>
                    </div>

                </div>
            </div>
        )
    }
}

export default injectIntl(Register)