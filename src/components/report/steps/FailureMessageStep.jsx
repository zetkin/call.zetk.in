import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


export default class FailureMessageStep extends ReportStepBase {
    getRenderMode(report) {
        if (report.get('success')) {
            // Don't render this step at all if the call was successful.
            return 'none';
        }
        else if (report.get('failureReason') !== 'noPickup') {
            // Also don't render this step if the failed call was because of
            // any other reason than the target not picking up.
            return 'none';
        }
        else {
            return (report.get('step') === 'failure_message')?
                'form' : 'summary';
        }
    }

    renderForm(report) {
        return [
            <Msg key="question" tagName="p"
                id="report.steps.failureMessage.question"/>,
            <Button key="messageButton"
                labelMsg="report.steps.failureMessage.options.leftMessage"
                onClick={ this.onClickOption.bind(this, true) }/>,
            <Button key="noMessageButton"
                labelMsg="report.steps.failureMessage.options.noMessage"
                onClick={ this.onClickOption.bind(this, false) }/>,
        ];
    }

    renderSummary(report) {
        let msgId = report.get('leftMessage')?
            'report.steps.failureMessage.summary.leftMessage' :
            'report.steps.failureMessage.summary.noMessage';

        return (
            <Msg tagName="p" id={ msgId }/>
        );
    }

    renderEffect(report) {
        if (report.get('leftMessage')) {
            return (
                <Msg tagName="p"
                    id="report.steps.failureMessage.effect.leftMessage"/>
            );
        }
        else {
            return null;
        }
    }

    onClickOption(leftMessage) {
        this.props.dispatch(setCallReportField(
            this.props.call, 'leftMessage', leftMessage));
    }
}
