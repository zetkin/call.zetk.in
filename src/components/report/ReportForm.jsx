import React from 'react';

import PropTypes from '../../utils/PropTypes';
import ReportStepBase from './steps/ReportStepBase';
import { REPORT_STEPS } from '../../store/calls';


export default class ReportForm extends React.Component {
    static propTypes = {
        report: PropTypes.map.isRequired,
    };

    render() {
        let report = this.props.report;
        let steps = [];

        let curStepIndex = REPORT_STEPS.indexOf(report.get('step')) || 0;
        for (let i = 0; i <= curStepIndex; i++) {
            let step = REPORT_STEPS[i];
            let StepComponent = componentFromStep(step);

            steps.push(
                <StepComponent key={ step }
                    report={ report }/>
            );
        }

        return (
            <div className="ReportForm">
                { steps }
            </div>
        );
    }
}

const componentFromStep = step => {
    return {
        success_or_failure: ReportStepBase,
        success_callback: ReportStepBase,
        failure_reason: ReportStepBase,
        failure_message: ReportStepBase,
        caller_log: ReportStepBase,
        organizer_log: ReportStepBase,
        complete: ReportStepBase,
    }[step];
};
