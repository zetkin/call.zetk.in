import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class ResumeOverlay extends React.Component {
    render() {
        return (
            <div className="ResumeOverlay">
                <Msg tagName="h1" id="overlays.resume.h"/>
                <Msg tagName="p" id="overlays.resume.p"/>
            </div>
        );
    }
}
