import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../../misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


@connect()
export default class CallBackStep extends ReportStepBase {
    getRenderMode(report) {
        if (!report.get('success') || report.get('targetCouldTalk')) {
            // Don't render this step for failed calls
            return 'none';
        }
        else {
            return (report.get('step') === 'success_call_back')?
                'form' : 'summary';
        }
    }

    renderForm(report) {
        return [
            <Msg key="question" tagName="p"
                id="report.steps.successCallBack.question"/>,
            <Button key="noResponseButton"
                labelMsg="report.steps.successCallBack.options.asap"
                onClick={ this.onClickOption.bind(this, 'asap') }/>,
            <Button key="otherPersonButton"
                labelMsg="report.steps.successCallBack.options.fewDays"
                onClick={ this.onClickOption.bind(this, 'fewDays') }/>,
            <Button key="wrongNumberButton"
                labelMsg="report.steps.successCallBack.options.oneWeek"
                onClick={ this.onClickOption.bind(this, 'oneWeek') }/>,
            <Button key="lineBusyButton"
                labelMsg="report.steps.successCallBack.options.twoWeeks"
                onClick={ this.onClickOption.bind(this, 'twoWeeks') }/>,
        ];
    }

    renderSummary(report) {
        let cba = report.get('callBackAfter');
        let msgId = 'report.steps.successCallBack.summary.' + cba;

        return (
            <Msg tagName="p" id={ msgId }/>
        );
    }

    onClickOption(option) {
        this.props.dispatch(setCallReportField('callBackAfter', option));
    }
}
