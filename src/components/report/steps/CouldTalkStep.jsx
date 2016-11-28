import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


export default class CouldTalkStep extends ReportStepBase {
    getRenderMode(report) {
        if (!report.get('success')) {
            // Don't render this step for failed calls
            return 'none';
        }
        else {
            return (report.get('step') === 'success_could_talk')?
                'form' : 'summary';
        }
    }

    renderForm(report) {
        let target = this.props.target.get('first_name');
        return [
            <Msg key="question" tagName="p"
                id="report.steps.successCouldTalk.question"
                values={{ target }}/>,
            <Button key="yesButton"
                labelMsg="report.steps.successCouldTalk.options.couldTalk"
                onClick={ this.onClickOption.bind(this, true) }/>,
            <Button key="noButton"
                labelMsg="report.steps.successCouldTalk.options.callBack"
                onClick={ this.onClickOption.bind(this, false) }/>,
        ];
    }

    renderSummary(report) {
        let target = this.props.target.get('first_name');
        let msgId = report.get('targetCouldTalk')?
            'report.steps.successCouldTalk.summary.couldTalk' :
            'report.steps.successCouldTalk.summary.callBack';

        return (
            <Msg tagName="p" id={ msgId } values={{ target }}/>
        );
    }

    onClickOption(success) {
        this.props.dispatch(setCallReportField(
            this.props.call, 'targetCouldTalk', success));
    }
}
