import React, { Component } from 'react'
import './index.less'
import icon_cancel from './assets/icon_cancel.png'
import { message, Checkbox } from 'antd'
import { login } from '../../../../service/serivce'

export default class Login extends Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
        }
    }
    onChangeEmail(e) {
        this.setState({ email: e.target.value })
    }
    onChangePassword(e) {
        this.setState({ password: e.target.value })
    }
    onSubmit() {
        const { email, password } = this.state

        if (password === "") {
            message.error('please input password')
            return
        }

        login({ username: email, password }).then(res => {
            if (res.data && res.data.status === "1") {
                localStorage.setItem('userInfo', JSON.stringify(res.data))
                this.props.isLogin(res.data)
            } else {
                message.error(res.error)
            }

        })

    }
    render() {
        const { email, password } = this.state
        return (
            <div className="login-wrapper">
                <div className="login">
                    <img src={icon_cancel} alt="" className="icon-cancel" onClick={() => this.props.cancelLogin()} />
                    <div className="title">Sign In</div>
                    <div className="input-wrapper">
                        <div className="text-title">User</div>
                        <input className="phone" type="email" placeholder="your email" onChange={this.onChangeEmail.bind(this)} value={email} />
                        <div className="text-title">Password</div>
                        <input className="password" type="password" placeholder="6-20 letters and numbers" onChange={this.onChangePassword.bind(this)} value={password} />
                        <div className="check-box">
                            <Checkbox>Google Authentication</Checkbox>
                        </div>
                        <div className="login-btn" onClick={this.onSubmit.bind(this)}>Sign In</div>
                        <div className="footer">
                            <div className="to-register" onClick={() => this.props.toRegister()}>Register</div>
                            <div className="to-register" onClick={() => this.props.toRegister()}>Forgot Password</div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}