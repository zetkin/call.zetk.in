import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import CallLogItem from './CallLogItem';
import PropTypes from '../../../utils/PropTypes';


export default class CallLog extends React.Component {
    static propTypes = {
        calls: PropTypes.list.isRequired,
    };

    render() {
        let callItems = this.props.calls.map(call => (
            <li key={ call.get('id') }>
                <CallLogItem call={ call }/>
            </li>
        ));

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
