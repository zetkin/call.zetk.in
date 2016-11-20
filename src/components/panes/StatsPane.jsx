import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import AssignmentStats from '../misc/AssignmentStats';
import PaneBase from './PaneBase';
import LoadingIndicator from '../../common/misc/LoadingIndicator';
import { selectedAssignment } from '../../store/assignments';
import { retrieveAssignmentStats } from '../../actions/assignment';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class StatsPane extends PaneBase {
    componentDidMount() {
        let assignment = this.props.assignment;
        this.props.dispatch(retrieveAssignmentStats(assignment));
    }

    renderContent() {
        let assignment = this.props.assignment;

        let statsContent = null;
        if (assignment.get('statsIsPending')) {
            statsContent = <LoadingIndicator key="loadingIndicator" />;
        }
        else if (assignment.get('stats')) {
            let statsData = assignment.get('stats');
            let stats = {
                'stats.target_size': statsData.get('num_target_matches'),
                'stats.calls_made': statsData.get('num_calls_made'),
                'stats.calls_reached': statsData.get('num_calls_reached'),
            };

            statsContent = (
                <AssignmentStats key="stats" stats={ stats }/>
            );
        }

        return [
            <Msg key="h1" tagName="h1" id="panes.stats.h1"/>,
            <Msg key="p" tagName="p" id="panes.stats.p"/>,
            statsContent
        ];
    }
}
