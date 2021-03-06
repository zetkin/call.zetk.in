import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


export default class SuccessOrFailureStep extends ReportStepBase {
    getRenderMode(report) {
        return (report.get('step') === 'success_or_failure')?
            'form' : 'summary';
    }

    renderForm(report) {
        let target = this.props.target.get('first_name');
        return [
            <Msg key="question" tagName="p"
                id="report.steps.successOrFailure.question"
                values={{ target }}/>,
            <Button key="yesButton"
                labelMsg="report.steps.successOrFailure.options.success"
                onClick={ this.onClickOption.bind(this, true) }/>,
            <Button key="noButton"
                labelMsg="report.steps.successOrFailure.options.failure"
                onClick={ this.onClickOption.bind(this, false) }/>,
        ];
    }

    renderSummary(report) {
        let target = this.props.target.get('first_name');
        let msgId = report.get('success')?
            'report.steps.successOrFailure.summary.success' :
            'report.steps.successOrFailure.summary.failure';

        return (
            <Msg tagName="p" id={ msgId } values={{ target }}/>
        );
    }

    renderEffect(report) {
        let target = this.props.target.get('first_name');
        let msgId = report.get('success')?
            'report.steps.successOrFailure.effect.success' :
            'report.steps.successOrFailure.effect.failure';

        return (
            <Msg tagName="p" id={ msgId } values={{ target }}/>
        );
    }

    onClickOption(success) {
        this.props.dispatch(setCallReportField(
            this.props.call, 'success', success));
    }
}
