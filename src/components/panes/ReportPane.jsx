import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import FormattedLink from '../../common/misc/FormattedLink';
import PaneBase from './PaneBase';
import ReportForm from '../report/ReportForm';
import { setLaneStep } from '../../actions/lane';
import { reportForCallById } from '../../store/calls';


const mapStateToProps = (state, props) => ({
    report: reportForCallById(state, props.call.get('id')),
});


@connect(mapStateToProps)
export default class ReportPane extends PaneBase {
    shouldComponentUpdate(nextProps) {
        let step = this.props.step;
        let nextReport = nextProps.report;

        if (step === 'done' && !nextReport) {
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
        let report = this.props.report;
        let isComplete = this.props.step === 'done';

        return (
            <ReportForm key="form"
                report={ report } call={ call }
                disableEdit={ isComplete }/>
        );
    }

    renderHeader() {
        let isComplete = this.props.step === 'done';

        let hMsg = isComplete?
            'panes.report.h.reported' :
            'panes.report.h.report';

        return (
            <div key="nav" className="ReportPane-nav">
                <FormattedLink className="ReportPane-backLink"
                    msgId="panes.report.backLink"
                    onClick={ this.onBackLinkClick.bind(this) }
                    />
                <Msg key="h" tagName="p" id={ hMsg }/>
            </div>
        );
    }

    onBackLinkClick() {
        let lane = this.props.lane;
        this.props.dispatch(setLaneStep(lane, 'call'));
    }
}
