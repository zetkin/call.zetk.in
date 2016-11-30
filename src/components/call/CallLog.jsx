import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../utils/PropTypes';


export default class CallLog extends React.Component {
    static propTypes = {
        calls: PropTypes.list.isRequired,
    };

    render() {
        let callItems = this.props.calls.map(call => {
            let success = call.get('state') == 1;
            let classes = cx('CallLog-item', {
                success: success,
                failed: !success,
            });

            return (
                <li key={ call.get('id') } className={ classes }>
                    <div className="CallLog-timeStamp">
                        { call.get('allocation_time') }</div>
                    <div className="CallLog-summary">
                        { call.get('notes') }</div>
                    <div className="CallLog-caller">
                        { call.getIn(['caller', 'name']) }</div>
                </li>
            );
        });

        if (callItems.size === 0) {
            callItems = (
                <Msg id="misc.callLog.emptyLabel"/>
            );
        }

        return (
            <ul className="CallLog">
                { callItems }
            </ul>
        )
    }
}

CallLog.propTypes = {
        personId: React.PropTypes.any, // TODO: Use string
};
