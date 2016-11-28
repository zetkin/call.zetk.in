import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import {
    finishCallReport,
    setCallReportField,
    setOrganizerLogMessage,
} from '../../../actions/call';


export default class OrganizerLogStep extends ReportStepBase {
    getRenderMode(report) {
        return (report.get('step') === 'organizer_log')?
            'form' : 'summary';
    }

    renderForm(report) {
        let log = report.get('organizerLog');
        let saveLabelMsg = log.length?
            'report.steps.organizerLog.options.saveWithLog' :
            'report.steps.organizerLog.options.saveWithoutLog';

        return [
            <Msg key="organizerQuestion" tagName="p"
                id="report.steps.organizerLog.question"/>,
            <Button key="noActionButton"
                labelMsg="report.steps.organizerLog.options.noActionNeeded"
                onClick={ this.onClickRemove.bind(this) }/>,
            <textarea key="message" value={ report.get('organizerLog') }
                onChange={ this.onChangeMessage.bind(this) }/>,
            <Button key="saveButton"
                labelMsg={ saveLabelMsg }
                onClick={ this.onClickAdd.bind(this) }/>,
        ];
    }

    renderSummary(report) {
        let oan = report.get('organizerActionNeeded');
        let log = report.get('organizerLog') || '';

        if (oan && log.length) {
            return [
                <Msg key="summary" tagName="p"
                    id="report.steps.organizerLog.summary.leftLog"/>,
                <p key="log" className="logMessage">{ log }</p>
            ];
        }
        else if (oan) {
            return (
                <Msg tagName="p"
                    id="report.steps.organizerLog.summary.emptyLog"/>
            );
        }
        else {
            return (
                <Msg tagName="p"
                    id="report.steps.organizerLog.summary.noActionNeeded"/>
            );
        }
    }

    onChangeMessage(ev) {
        this.props.dispatch(setOrganizerLogMessage(
            this.props.call, ev.target.value));
    }

    onClickAdd() {
        this.props.dispatch(finishCallReport(this.props.call));
    }

    onClickRemove() {
        this.props.dispatch(setCallReportField(
            this.props.call, 'organizerActionNeeded', false));
    }
}
