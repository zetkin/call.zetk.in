import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import CallLogItem from './CallLogItem';
import PropTypes from '../../../utils/PropTypes';


export default class CallLog extends React.Component {
    static propTypes = {
        calls: PropTypes.list.isRequired,
    };

    render() {
        let callItems = this.props.calls.map((call, i) => {
            let style = {
                // Increase delay with 0.1s for each item
                animationDelay: 0.3 + i*0.1 + 's',
            };

            return (
                <li key={ call.get('id') } style={ style }>
                    <CallLogItem call={ call }/>
                </li>
            );
        });

        if (callItems.size === 0) {
            callItems = (
                <Msg id="misc.callLog.emptyLabel"/>
            );
        }

        return (
            <CSSTransitionGroup
                component="ul" className="CallLog"
                transitionName="CallLog"
                transitionLeave={ false }
                transitionAppear={ true }
                transitionEnterTimeout={ 2000 }
                transitionAppearTimeout={ 2000 }>
                { callItems }
            </CSSTransitionGroup>
        )
    }
}

CallLog.propTypes = {
        personId: React.PropTypes.any, // TODO: Use string
};
