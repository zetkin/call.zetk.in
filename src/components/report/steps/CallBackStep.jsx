import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


export default class CallBackStep extends ReportStepBase {
    getRenderMode(report) {
        if (report.get('success') && report.get('targetCouldTalk')) {
            // Don't render this step for successfull calls where
            // the target had time to talk right now.
            return 'none';
        }
        else if (!report.get('success')
            && report.get('failureReason') !== 'notAvailable') {
            // Don't render this step for failed calls unless the
            // reason was that caller is not available
            return 'none';
        }
        else {
            return (report.get('step') === 'call_back')?
                'form' : 'summary';
        }
    }

    renderForm(report) {
        return [
            <Msg key="question" tagName="p"
                id="report.steps.callBack.question"/>,
            <Button key="noResponseButton"
                labelMsg="report.steps.callBack.options.asap"
                onClick={ this.onClickOption.bind(this, 'asap') }/>,
            <Button key="otherPersonButton"
                labelMsg="report.steps.callBack.options.fewDays"
                onClick={ this.onClickOption.bind(this, 'fewDays') }/>,
            <Button key="wrongNumberButton"
                labelMsg="report.steps.callBack.options.oneWeek"
                onClick={ this.onClickOption.bind(this, 'oneWeek') }/>,
            <Button key="lineBusyButton"
                labelMsg="report.steps.callBack.options.twoWeeks"
                onClick={ this.onClickOption.bind(this, 'twoWeeks') }/>,
        ];
    }

    renderSummary(report) {
        let cba = report.get('callBackAfter');
        let msgId = 'report.steps.callBack.summary.' + cba;

        return (
            <Msg tagName="p" id={ msgId }/>
        );
    }

    onClickOption(option) {
        this.props.dispatch(setCallReportField(
            this.props.call, 'callBackAfter', option));
    }
}
