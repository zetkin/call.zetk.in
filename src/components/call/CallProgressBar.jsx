import React from 'react';

export default function CallProgressBar(props) {
    let style;

    if (props.call) {
        let progress = props.call.get('progress');
        let pc = Math.ceil(progress * 100) + '%';
        style = { width: pc };
    }
    else {
        style = { width: 0 };
    }

    return (
        <div className="CallProgressBar">
            <div className="CallProgressBar-bar" style={ style }/>
        </div>
    );
}
