import React from 'react';
import cx from 'classnames';


export default function CallLogItem(props) {
    let call = props.call;
    let state = call.get('state');

    let classes = cx('CallLogItem', 'status' + state);

    return (
        <div className={ classes }>
            <div className="CallLogItem-status">
                <span className="CallLogItem-statusBar0"/>
                <span className="CallLogItem-statusBar1"/>
            </div>
            <div className="CallLogItem-timeStamp">
                { call.get('allocation_time') }</div>
            <div className="CallLogItem-summary">
                { call.get('notes') }</div>
            <div className="CallLogItem-caller">
                { call.getIn(['caller', 'name']) }</div>
        </div>
    );
}
