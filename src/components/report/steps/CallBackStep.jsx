import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import Button from '../../../common/misc/Button';
import ReportStepBase from './ReportStepBase';
import { setCallReportField } from '../../../actions/call';


@injectIntl
export default class CallBackStep extends ReportStepBase {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state, {
            selectedDate: Date.create('tomorrow'),
            selectedHour: 0,
        });
    }

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
        const optionElems = [];
        for (let h = 0; h < 24; h++) {
            const hStr = ('0' + h).slice(-2);
            const label = (h == 0)?
                this.props.intl.formatMessage(
                    { id: 'report.steps.callBack.timeOfDay.any' }) :
                this.props.intl.formatMessage(
                    { id: 'report.steps.callBack.timeOfDay.after' },
                    { hour: hStr });

            optionElems.push(
                <option key={ h } value={ h }>{ label }</option>
            );
        }

        const date = this.dateFromState();
        const dateStr = this.props.intl.formatDate(date, {
            month: 'short',
            year: 'numeric',
            day: 'numeric',
            hour: date.getHours()? 'numeric' : undefined,
            minute: date.getHours()? 'numeric' : undefined,
        });
        const minDate = (new Date()).toISOString().replace(/T.+$/, '');

        return [
            <Msg key="question" tagName="p"
                id="report.steps.callBack.question"/>,
            <div key="dateTime" className="CallBackStep-dateTime">
                <input type="date"
                    onChange={ this.onDateChange.bind(this) }
                    value={ this.state.selectedDate.format('{yyyy}-{MM}-{dd}') }
                    min={ minDate }/>

                <select
                    onChange={ this.onHourChange.bind(this) }
                    value={ this.state.selectedHour }>
                    { optionElems }
                </select>

                <div className="CallBackStep-examples">
                    <Msg id="report.steps.callBack.examplesLabel"/>:

                    <a
                        onClick={ this.onExampleClick.bind(this, 'today') }>
                        <Msg id="report.steps.callBack.examples.today"/>
                    </a>,
                    <a
                        onClick={ this.onExampleClick.bind(this, 'tomorrow') }>
                        <Msg id="report.steps.callBack.examples.tomorrow"/>
                    </a>,
                    <a
                        onClick={ this.onExampleClick.bind(this, 'nextWeek') }>
                        <Msg id="report.steps.callBack.examples.nextWeek"/>
                    </a>
                </div>
            </div>,
            <Button key="submitButton"
                labelMsg="report.steps.callBack.submitButton"
                labelValues={{ date: dateStr }}
                onClick={ this.onSubmitClick.bind(this) }/>,
        ];
    }

    renderSummary(report) {
        const date = report.get('callBackAfter');
        const dateStr = this.props.intl.formatDate(date, {
            month: 'short',
            year: 'numeric',
            day: 'numeric',
            hour: date.getHours()? 'numeric' : undefined,
            minute: date.getHours()? 'numeric' : undefined,
        });

        return (
            <Msg tagName="p" id="report.steps.callBack.summary"
                values={{ date: dateStr }}/>
        );
    }

    renderEffect(report) {
        let target = this.props.target.get('first_name');
        let cba = report.get('callBackAfter');
        let msgId = 'report.steps.callBack.effect.' + ((cba === 'asap')?
            'asap' : 'other');

        return (
            <Msg tagName="p" id={ msgId } values={{ target }}/>
        );
    }

    onHourChange(ev) {
        this.setState({
            selectedHour: parseInt(ev.target.value) || 0,
        });
    }

    onDateChange(ev) {
        this.setState({
            selectedDate: Date.create(ev.target.value),
        });
    }

    onExampleClick(ex) {
        if (ex == 'today') {
            const today = new Date();
            this.setState({
                selectedDate: today,
                selectedHour: Math.min(23, today.getHours() + 3),
            });
        }
        else if (ex == 'tomorrow') {
            this.setState({
                selectedDate: Date.create('tomorrow'),
                selectedHour: 0,
            });
        }
        else if (ex == 'nextWeek') {
            this.setState({
                selectedDate: Date.create('next monday'),
                selectedHour: 0,
            });
        }
    }

    onSubmitClick() {
        const date = this.dateFromState();

        this.props.dispatch(setCallReportField(
            this.props.call, 'callBackAfter', date));
    }

    dateFromState() {
        const date = Date.create(this.state.selectedDate);

        date.setHours(this.state.selectedHour);
        date.setMinutes(0);
        date.setSeconds(0);

        return date;
    }
}
