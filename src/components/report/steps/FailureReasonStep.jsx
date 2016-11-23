import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


export default class FailureReasonStep extends ReportStepBase {
    getRenderMode(report) {
        if (report.get('success')) {
            // Don't render this step at all if the call was successful.
            return 'none';
        }
        else {
            return (report.get('step') === 'failure_reason')?
                'form' : 'summary';
        }
    }

    renderForm(report) {
        return [
            <Msg key="question" tagName="p"
                id="report.steps.failureReason.question"/>,
            <Button key="noResponseButton"
                labelMsg="report.steps.failureReason.options.noPickup"
                onClick={ this.onClickOption.bind(this, 'noPickup') }/>,
            <Button key="wrongNumberButton"
                labelMsg="report.steps.failureReason.options.wrongNumber"
                onClick={ this.onClickOption.bind(this, 'wrongNumber') }/>,
            <Button key="lineBusyButton"
                labelMsg="report.steps.failureReason.options.lineBusy"
                onClick={ this.onClickOption.bind(this, 'lineBusy') }/>,
        ];
    }

    renderSummary(report) {
        let reason = report.get('failureReason');
        let msgId = 'report.steps.failureReason.summary.' + reason;

        return (
            <Msg tagName="p" id={ msgId }/>
        );
    }

    onClickOption(option) {
        this.props.dispatch(setCallReportField('failureReason', option));
    }
}
