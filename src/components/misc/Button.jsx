import cx from 'classnames';
import React from 'react';
import { injectIntl } from 'react-intl';

import FormattedLink from './FormattedLink';


@injectIntl
export default class Button extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        labelMsg: React.PropTypes.string.isRequired,
        labelValues: React.PropTypes.object,
        href: React.PropTypes.string,
        onClick: React.PropTypes.func,
    };

    render() {
        let msgId = this.props.labelMsg;

        let classes = cx('Button', this.props.className);

        let href = this.props.href;
        if (href) {
            return (
                <FormattedLink href={ href }
                    className={ this.props.className }
                    msgId={ msgId }
                    msgValues={ this.props.labelValues }
                    onClick={ this.props.onClick }/>
            );
        }
        else {
            let label = this.props.intl.formatMessage({ id: msgId },
                this.props.labelValues)

            return (
                <button className={ classes }
                    onClick={ this.props.onClick }>
                    { label }
                </button>
            )
        }
    }
}
