import React, { Component } from 'react'
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'

import './index.less'
import ylh_img from '../../assets/images/ylh.png'
import hcp_img from '../../assets/images/hcp.png'

type IProps = InjectedIntlProps


class Footer extends Component<IProps> {
    render() {
        return (
            <div className="footer-wrapper">
                <div className="footer">
                    <div className="footer-info">
                        <div className="link">
                            <div className="title"><FormattedMessage id={'relatedLinks'} defaultMessage={'Related links'}/></div>
                            <div className="info">谱数科技 &nbsp;&nbsp;&nbsp;&nbsp;<a href="http://www.pushutech.com/site/index" target="_blank" style={{ color: '#fff' }} rel="nofollow me noopener noreferrer">集金融技术服务、金融操盘技术与金融交易平台于一体</a></div>
                            <div className="info">练盘宝 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://www.pushutech.com/product/lpb/download" target="_blank" style={{ color: '#fff' }} rel="nofollow me noopener noreferrer">你与大师只差一万盘训练，专业炒股训练工具与股民成长平台</a></div>
                            <div className="info">慧操盘 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="http://www.pushutech.com/product/hcp/download" target="_blank" style={{ color: '#fff' }} rel="nofollow me noopener noreferrer">像高手一样炒股，专业操盘工具与盈利流程</a></div>
                        </div>
                        <div className="right">
                            <div className="contact">
                                <div className="title"><FormattedMessage id={'ContactUs'} defaultMessage={'Contact us'}/></div>
                                <div className="info">QQ group：34554345</div>
                                <div className="info">Telephone：027－87001455</div>
                                <div className="info">E-mail：info@spd9.com</div>
                            </div>
                            <div className="attation">
                                <div className="title">关注易量化</div>
                                <img src={ylh_img} alt="" />
                            </div>
                            <div className="download">
                                <div className="title">下载会操盘</div>
                                <div className="info">手机端“会操盘”</div>
                                <img src={hcp_img} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="mark">
                        <span className="company">©武汉谱数科技有限公司 鄂ICP备17022385</span> <span className="xieyi">User agreenment</span>
                        <div className="risk-tip">
                            Risk tip: investment is risky, please make your own decision. The above information is for communication, only for reference, do not constitute any <br/>investment advice to you, and operate accordingly, at your own risk.
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default injectIntl(Footer)