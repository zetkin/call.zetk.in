import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import ReportForm from '../report/ReportForm';
import { currentCall } from '../../store/calls';


const mapStateToProps = state => ({
    call: currentCall(state),
});


@connect(mapStateToProps)
export default class ReportPane extends PaneBase {
    shouldComponentUpdate(nextProps) {
        let step = this.props.step;
        let call = this.props.call;
        let nextCall = nextProps.call;

        if (step === 'done' && !nextCall.get('report')) {
            // If we are in the "done" step, about to start a new call, and
            // that call does not yet have a report, don't re-render. It just
            // means that the pane is animating out and will be removed in a
            // moment. The next time a report is due, the pane will be created
            // anew, the step will be "report", and it will render properly.
            return false;
        }
        else {
            return true;
        }
    }

    renderContent() {
        let call = this.props.call;
        let report = call.get('report');
        let isComplete = this.props.step === 'done';

        let h1Msg = isComplete?
            'panes.report.h1.reported' :
            'panes.report.h1.report';

        return [
            <Msg key="h1" tagName="h1" id={ h1Msg }/>,
            <ReportForm key="form" report={ report }
                disableEdit={ isComplete }/>
        ];
    }
}
