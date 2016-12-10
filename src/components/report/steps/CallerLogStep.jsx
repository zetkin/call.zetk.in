import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import {
    finishCallReport,
    setCallerLogMessage,
} from '../../../actions/call';


export default class CallerLogStep extends ReportStepBase {
    getRenderMode(report) {
        return (report.get('step') === 'caller_log')?
            'form' : 'summary';
    }

    renderForm(report) {
        let log = report.get('callerLog');
        let saveLabelMsg = log.length?
            'report.steps.callerLog.options.saveWithLog' :
            'report.steps.callerLog.options.saveWithoutLog';

        return [
            <Msg key="question" tagName="p"
                id="report.steps.callerLog.question"/>,
            <textarea key="message" value={ report.get('callerLog') }
                onChange={ this.onChangeMessage.bind(this) }/>,
            <Button key="saveButton"
                labelMsg={ saveLabelMsg }
                onClick={ this.onClickSave.bind(this) }/>,
        ];
    }

    renderSummary(report) {
        let log = report.get('callerLog') || '';
        if (log.length) {
            return [
                <Msg key="summary" tagName="p"
                    id="report.steps.callerLog.summary.leftLog"/>,
                <p key="log" className="logMessage">{ log }</p>
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
        this.props.dispatch(setCallerLogMessage(
            this.props.call, ev.target.value));
    }

    onClickSave() {
        this.props.dispatch(finishCallReport(this.props.call));
    }
}
