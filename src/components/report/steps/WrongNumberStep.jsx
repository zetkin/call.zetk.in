import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';
import { setLaneStep } from '../../../actions/lane';


export default class WrongNumberStep extends ReportStepBase {
    componentDidMount() {
        // Skip this step if there is just one number
        const target = this.props.target;
        if (!target.get('phone') || !target.get('alt_phone')) {
            this.props.dispatch(setCallReportField(
                this.props.call, 'wrongNumber',
                target.get('phone')? 'phone' : 'alt_phone'));
        }
    }

    getRenderMode(report) {
        if (report.get('success')) {
            // Don't render this step at all if the call was successful.
            return 'none';
        }
        else if (report.get('failureReason') !== 'wrongNumber') {
            // Don't render this if failure was anything but wrong number.
            return 'none';
        }
        else {
            const target = this.props.target;
            if (target.get('phone') && target.get('alt_phone')) {
                return (report.get('step') === 'wrong_number')?
                    'form' : 'summary';
            }
            else {
                // Don't render this when there is only one number
                return 'none';
            }
        }
    }

    renderForm(report) {
        const target = this.props.target;

        return [
            <Msg key="question" tagName="p"
                id="report.steps.wrongNumber.question"/>,
            <Button key="phoneButton"
                labelMsg="report.steps.wrongNumber.options.single"
                labelValues={{ phone: target.get('phone') }}
                onClick={ this.onClickOption.bind(this, 'phone') }/>,
            <Button key="altPhoneButton"
                labelMsg="report.steps.wrongNumber.options.single"
                labelValues={{ phone: target.get('alt_phone') }}
                labelMsg="report.steps.wrongNumber.options.single"
                onClick={ this.onClickOption.bind(this, 'altPhone') }/>,
            <Button key="bothButton"
                labelMsg="report.steps.wrongNumber.options.both"
                onClick={ this.onClickOption.bind(this, 'both') }/>,
        ];
    }

    renderSummary(report) {
        const option = report.get('wrongNumber');
        const target = this.props.target;

        let msgValues;
        let msgId = 'report.steps.wrongNumber.summary.both';
        if (option != 'both') {
            msgId = 'report.steps.wrongNumber.summary.single';
            msgValues = {
                phone: (option == 'phone') ?
                    target.get('phone') : target.get('alt_phone'),
            };
        }

        return (
            <Msg tagName="p" id={ msgId } values={ msgValues }/>
        );
    }

    onClickOption(option) {
        this.props.dispatch(setCallReportField(
            this.props.call, 'wrongNumber', option));
    }
}
