import React from 'react';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';


export default function CallLogItem(props) {
    let call = props.call;
    let state = call.get('state');

    let classes = cx('CallLogItem', 'status' + state);
    let allocTime = new Date(call.get('allocation_time'));

    let summaryMsg = 'misc.callLog.summary.status' + state;
    let summaryValues = {
        caller: call.getIn(['caller', 'name']),
        target: call.getIn(['target', 'name']),
    };

    return (
        <div className={ classes }>
            <div className="CallLogItem-status">
                <span className="CallLogItem-statusBar0"/>
                <span className="CallLogItem-statusBar1"/>
            </div>
            <div className="CallLogItem-timeStamp">
                <FormattedDate value={ allocTime }
                    weekday="short"
                    day="numeric"
                    month="short"
                    year="numeric"
                    hour="2-digit"
                    minute="2-digit"
                    />
            </div>
            <div className="CallLogItem-summary">
                <Msg id={ summaryMsg }
                    values={ summaryValues }
                    />
            </div>
            <div className="CallLogItem-notes">
                { call.get('notes') }</div>
            <div className="CallLogItem-caller">
                { call.getIn(['caller', 'name']) }</div>
        </div>
    );
}
