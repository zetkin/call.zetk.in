import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import {
    setCallReportStep,
    setOrganizerLogMessage,
} from '../../../actions/call';


@injectIntl
export default class OrganizerLogStep extends ReportStepBase {
    constructor(props) {
        super(props);

        this.state = {
            message: props.report.get('organizerLog'),
        };
    }

    componentDidMount() {
        const report = this.props.report;
        const target = this.props.target;

        // If wrong number was reported, and there isn't already
        // a user-submitted organizer log message, note it here
        if (!report.get('success') && report.get('failureReason') == 'wrongNumber') {

            const wrongNumber = report.get('wrongNumber');
            let numbers = [];
            if (wrongNumber == 'both' || wrongNumber == 'phone') {
                numbers.push(target.get('phone'));
            }
            if (wrongNumber == 'both' || wrongNumber == 'altPhone') {
                numbers.push(target.get('alt_phone'));
            }

            const msg = this.props.intl.formatMessage(
                { id: 'report.steps.organizerLog.templates.wrongNumber' },
                { numbers: numbers.join(', ') });

            // If the current log message is not a "wrong number" message
            // similar to the one we're about to change to, bail out to avoid
            // overriding a user-submitted message. Control this by comparing
            // the two messages without including the phone numbers.
            const curLog = report.get('organizerLog');
            if (!curLog || curLog.replace(/\(.*\)/, '()') == msg.replace(/\(.*\)/, '()')) {
                this.props.dispatch(setOrganizerLogMessage(
                    this.props.call, msg));
            }
        }
    }

    getRenderMode(report) {
        if (report.get('organizerActionNeeded')) {
            return (report.get('step') === 'organizer_log')?
                'form' : 'summary';
        }
        else {
            return 'none';
        }
    }

    renderForm(report) {
        let log = report.get('organizerLog');
        let saveLabelMsg = log.length?
            'report.steps.organizerLog.options.saveWithLog' :
            'report.steps.organizerLog.options.saveWithoutLog';

        return [
            <Msg key="organizerQuestion" tagName="p"
                id="report.steps.organizerLog.question"/>,
            <textarea key="message" value={ this.state.message }
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
            return (
                <Msg tagName="p"
                    id="report.steps.organizerLog.summary.leftLog"/>
            );
        }
        else if (oan) {
            return (
                <Msg tagName="p"
                    id="report.steps.organizerLog.summary.emptyLog"/>
            );
        }
    }

    renderEffect(report) {
        let log = report.get('organizerLog') || '';

        if (log.length) {
            return [
                <Msg key="effect" tagName="p"
                    id="report.steps.organizerLog.effect.leftLog"/>,
                <p key="log" className="logMessage">{ log }</p>
            ];
        }
        else {
            return null;
        }
    }

    onChangeMessage(ev) {
        this.setState({
            message: ev.target.value,
        });
    }

    onClickAdd() {
        this.props.dispatch(setOrganizerLogMessage(
            this.props.call, this.state.message));
        this.props.dispatch(setCallReportStep(this.props.call, 'caller_log'));
    }
}
