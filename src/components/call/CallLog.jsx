import React from 'react';

export default class CallLog extends React.Component {
    render() {
        return (
            <ul className="CallLog">
                <li className="CallLog-item success">
                    <div className="CallLog-timeStamp">22/6 2016 17:31</div>
                    <div className="CallLog-summary">Anmäldes på 3 aktioner i Välfärdskampanjen.</div>
                    <div className="CallLog-caller">Richard Olsson</div>
                </li>
                <li className="CallLog-item success">
                    <div className="CallLog-timeStamp">8/7 2016 19:03</div>
                    <div className="CallLog-summary">Genomförde enkäten Medlemsenkät 2016.</div>
                    <div className="CallLog-caller">Richard Olsson</div>
                </li>
                <li className="CallLog-item failed">
                    <div className="CallLog-timeStamp">1/6 2016 18:24</div>
                    <div className="CallLog-summary">Samtalet misslyckades</div>
                    <div className="CallLog-caller">Jens Börjesson</div>
                </li>
            </ul>
        )
    }
}

CallLog.propTypes = {
        personId: React.PropTypes.any, // TODO: Use string
};