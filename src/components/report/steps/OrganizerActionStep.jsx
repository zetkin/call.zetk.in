import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


export default class OrganizerActionStep extends ReportStepBase {
    getRenderMode(report) {
        return (report.get('step') === 'organizer_action')?
            'form' : 'summary';
    }

    renderForm(report) {
        return [
            <Msg key="callerQuestion" tagName="p"
                id="report.steps.organizerAction.question"/>,
            <Button key="actionButton"
                labelMsg="report.steps.organizerAction.options.actionNeeded"
                onClick={ this.onClickOption.bind(this, true) }/>,
            <Button key="noActionButton"
                labelMsg="report.steps.organizerAction.options.noActionNeeded"
                onClick={ this.onClickOption.bind(this, false) }/>,
        ];
    }

    renderSummary(report) {
        if (report.get('organizerActionNeeded')) {
            return (
                <Msg tagName="p"
                    id="report.steps.organizerAction.summary.actionNeeded"/>
            );
        }
        else {
            return (
                <Msg tagName="p"
                    id="report.steps.organizerAction.summary.noActionNeeded"/>
            );
        }
    }

    renderEffect(report) {
        if (report.get('organizerActionNeeded')) {
            return (
                <Msg tagName="p"
                    id="report.steps.organizerAction.effect.actionNeeded"/>
            );
        }
        else {
            return null;
        }
    }

    onClickOption(organizerActionNeeded) {
        this.props.dispatch(setCallReportField(
            this.props.call, 'organizerActionNeeded', organizerActionNeeded));
    }
}
