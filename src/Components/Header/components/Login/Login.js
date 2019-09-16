import React, { Component } from 'react'
import './index.less'
import icon_cancel from './assets/icon_cancel.png'
import { message ,Checkbox} from 'antd'
// import {login} from '../../../../serivce'

export default class Login extends Component {
    constructor(){
        super()
        this.state = {
            phone:"",
            password:"",
        }
    }
    onChangePhone(e){
        this.setState({phone:e.target.value})
    }
    onChangePassword(e){
        this.setState({password:e.target.value})
    }
    onSubmit(){
        const {phone,password} = this.state
        if(phone===""||phone.length<11){
            message.error('请输入正确的手机号！')
            return
        }
        if(password===""){
            message.error('请输入密码')
            return
        }
        // login({username:phone,password}).then(res=>{
        //     if(res.error){
        //         message.error(res.error)
        //     }else if(res.success==='登录成功！'){
        //         localStorage.setItem("token",res.token)
        //         this.props.isLogin(res.token)
        //     }
        // })
    
    }
    render() {
        const {phone,password} = this.state
        return (
            <div className="login-wrapper">
                <div className="login">
                    <img src={icon_cancel} alt="" className="icon-cancel" onClick={()=>this.props.cancelLogin()} />
                    <div className="title">Sign In</div>
                    <div className="input-wrapper">
                        <div className="text-title">User</div>
                        <input className="phone" type="number" placeholder="your email" onChange={this.onChangePhone.bind(this)} value={phone}/>
                        <div className="text-title">Password</div>
                        <input className="password" type="password" placeholder="6-20 letters and numbers" onChange={this.onChangePassword.bind(this)} value={password}/>
                        <div className="check-box">
                            <Checkbox>Google Authentication</Checkbox>
                        </div>
                        <div className="login-btn" onClick={this.onSubmit.bind(this)}>Sign In</div>
                        <div className="footer">
                            {/* <div className="forgot" onClick={()=>this.props.toForget()}>忘记密码？</div> */}
                            <div className="to-register" onClick={()=>this.props.toRegister()}>Register</div>
                            <div className="to-register" onClick={()=>this.props.toRegister()}>Forgot Password</div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}