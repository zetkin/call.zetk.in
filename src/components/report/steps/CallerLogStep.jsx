import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import {
    finishCallReport,
    setCallerLogMessage,
} from '../../../actions/call';


export default class CallerLogStep extends ReportStepBase {
    componentDidMount() {
        // Skip this step if caller notes are disabled
        if (this.props.report.get('step') == 'caller_log') {
            if (this.props.report.get('disableCallerNotes')) {
                this.props.dispatch(finishCallReport(this.props.call));
            }
        }
    }

    getRenderMode(report) {
        return (report.get('step') === 'caller_log')?
            'form' : 'summary';
    }

    renderForm(report) {
        let log = report.get('callerLog');
        let saveLabelMsg = log.length?
            'report.steps.callerLog.options.saveWithLog' :
            'report.steps.callerLog.options.saveWithoutLog';

        let input = (
            <textarea key="message" value={ report.get('callerLog') }
                onChange={ this.onChangeMessage.bind(this) }/>
        );

        if (report.get('disableCallerNotes')) {
            input = (
                <Msg key="disabled" tagName="small"
                    id="report.steps.callerLog.disabled"/>
            );
        }

        return [
            <Msg key="question" tagName="p"
                id="report.steps.callerLog.question"/>,
            input,
            <Button key="saveButton"
                labelMsg={ saveLabelMsg }
                onClick={ this.onClickSave.bind(this) }/>,
        ];
    }

    renderSummary(report) {
        let log = report.get('callerLog') || '';
        if (log.length) {
            return (
                <Msg tagName="p"
                    id="report.steps.callerLog.summary.leftLog"/>
            );
        }
        else {
            return (
                <Msg tagName="p"
                    id="report.steps.callerLog.summary.emptyLog"/>
            );
        }
    }

    renderEffect(report) {
        let log = report.get('callerLog') || '';

        if (report.get('disableCallerNotes')) {
            return [
                <Msg key="disabled" tagName="p"
                    id="report.steps.callerLog.disabled"/>,
            ];
        }
        else if (log.length) {
            return [
                <Msg key="effect" tagName="p"
                    id="report.steps.callerLog.effect.leftLog"/>,
                <p key="log" className="logMessage">{ log }</p>
            ];
        }
        else {
            return null;
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
