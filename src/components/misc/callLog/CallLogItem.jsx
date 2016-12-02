import React from 'react';


export default function CallLogItem(props) {
    let call = props.call;

    return (
        <div className="CallLogItem">
            <div className="CallLogItem-timeStamp">
                { call.get('allocation_time') }</div>
            <div className="CallLogItem-summary">
                { call.get('notes') }</div>
            <div className="CallLogItem-caller">
                { call.getIn(['caller', 'name']) }</div>
        </div>
    );
}
