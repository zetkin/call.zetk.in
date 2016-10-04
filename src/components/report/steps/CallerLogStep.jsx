import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../misc/Button';
import ReportStepBase from './ReportStepBase';
import {
    setCallReportField,
    setCallerLogMessage,
} from '../../../actions/call';


export default class CallerLogStep extends ReportStepBase {
    getRenderMode(report) {
        return (report.get('step') === 'caller_log')?
            'form' : 'summary';
    }

    renderForm(report) {
        return [
            <Msg key="callerQuestion" tagName="p"
                id="report.steps.callerLog.callerQuestion"/>,
            <textarea key="message" value={ report.get('callerLog') }
                onChange={ this.onChangeMessage.bind(this) }/>,
            <Msg key="organizerQuestion" tagName="p"
                id="report.steps.callerLog.organizerQuestion"/>,
            <Button key="messageButton"
                labelMsg="report.steps.callerLog.options.organizerActionNeeded"
                onClick={ this.onClickOption.bind(this, true) }/>,
            <Button key="noMessageButton"
                labelMsg="report.steps.callerLog.options.noActionNeeded"
                onClick={ this.onClickOption.bind(this, false) }/>,
        ];
    }

    renderSummary(report) {
        let log = report.get('callerLog') || '';
        if (log.length) {
            return [
                <Msg key="summary" tagName="p"
                    id="report.steps.callerLog.summary.leftLog"/>,
                <p key="log">{ log }</p>
            ];
        }
        else {
            return (
                <Msg tagName="p"
                    id="report.steps.callerLog.summary.emptyLog"/>
            );
        }
    }

    onChangeMessage(ev) {
        this.props.dispatch(setCallerLogMessage(ev.target.value));
    }

    onClickOption(organizerActionNeeded) {
        this.props.dispatch(setCallReportField('organizerActionNeeded',
            organizerActionNeeded));
    }
}
