import React from 'react';

import ReportStepBase from './ReportStepBase';


export default class SummaryStep extends ReportStepBase {
    getRenderMode(report) {
        return 'summary';
    }

    renderSummary(report) {
        // TODO: Replace with summary of actions during call
        return null;
    }
}
