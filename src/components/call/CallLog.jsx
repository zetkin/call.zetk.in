import React from 'react';

export default class CallLog extends React.Component {
    render() {
        return (
            <ul className="CallLog">
                <li className="CallLog-item">
                    <div className="CallLog-timeStamp">22/6 2016 17:31</div>
                    <div className="CallLog-summary">Anmäldes på 3 aktioner i Välfärdskampanjen.</div>
                    <div className="CallLog-caller">Rosa Luxemburg</div>
                </li>
                <li className="CallLog-item">
                    <div className="CallLog-timeStamp">22/6 2016 17:31</div>
                    <div className="CallLog-summary">Genomförde enkäten Medlemsenkät 2016.</div>
                    <div className="CallLog-caller">Rosa Luxemburg</div>
                </li>
            </ul>
        )
    }
}

CallLog.propTypes = {
        personId: React.PropTypes.any, // TODO: Use string
};