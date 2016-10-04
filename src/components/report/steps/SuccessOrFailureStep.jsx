import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../../misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


@connect()
export default class SuccessOrFailureStep extends ReportStepBase {
    getRenderMode(report) {
        return (report.get('step') === 'success_or_failure')?
            'form' : 'summary';
    }

    renderForm(report) {
        return [
            <Msg key="question" tagName="p"
                id="report.steps.successOrFailure.question"/>,
            <Button key="yesButton"
                labelMsg="report.steps.successOrFailure.options.success"
                onClick={ this.onClickOption.bind(this, true) }/>,
            <Button key="noButton"
                labelMsg="report.steps.successOrFailure.options.failure"
                onClick={ this.onClickOption.bind(this, false) }/>,
        ];
    }

    renderSummary(report) {
        let msgId = report.get('success')?
            'report.steps.successOrFailure.summary.success' :
            'report.steps.successOrFailure.summary.failure';
        return (
            <Msg tagName="p" id={ msgId }/>
        );
    }

    onClickOption(success) {
        this.props.dispatch(setCallReportField('success', success));
    }
}
