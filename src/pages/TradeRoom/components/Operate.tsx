import React, { Component } from 'react'
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'


import ModuleTrade from './ModuleTrade/ModuleTrade'

interface Props {
    quote: Quote;
    code:string;
}

type Iprops = Props & InjectedIntlProps

class Operate extends Component<Iprops> {

    render() {
        const {code} = this.props
        return (
            <div className="operate-wrapper">
                <div className="tab-list">
                    <span className="tab-item btn active"><FormattedMessage id={'trade'} defaultMessage={'Trade'} /></span>
                    <span className="tab-item btn"><FormattedMessage id={'Strategy'} defaultMessage={'Strategy'} /></span>
                </div>
                <ModuleTrade quote={this.props.quote} code={code}/>
            </div>
        )
    }
}

export default injectIntl(Operate)