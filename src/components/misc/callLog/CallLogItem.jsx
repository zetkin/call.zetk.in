import React from 'react';
import { FormattedDate } from 'react-intl';
import cx from 'classnames';


export default function CallLogItem(props) {
    let call = props.call;
    let state = call.get('state');

    let classes = cx('CallLogItem', 'status' + state);
    let allocTime = new Date(call.get('allocation_time'));

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
                { call.get('notes') }</div>
            <div className="CallLogItem-caller">
                { call.getIn(['caller', 'name']) }</div>
        </div>
    );
}
