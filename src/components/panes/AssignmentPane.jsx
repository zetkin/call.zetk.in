import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { selectedAssignment } from '../../store/assignments';
import { retrieveAssignmentStats } from '../../actions/assignment';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class AssignmentPane extends PaneBase {
    componentDidMount() {
        let assignment = this.props.assignment;
        this.props.dispatch(retrieveAssignmentStats(assignment));
    }

    renderContent() {
        let assignment = this.props.assignment;

        let statsContent = null;
        if (assignment.get('statsIsPending')) {
            statsContent = <LoadingIndicator />;
        }
        else if (assignment.get('stats')) {
            let stats = assignment.get('stats');

            statsContent = (
                <ul>
                    <StatsItem
                        labelMsg="panes.assignment.stats.target_size"
                        number={ stats.get('num_target_matches') }/>
                    <StatsItem
                        labelMsg="panes.assignment.stats.calls_made"
                        number={ stats.get('num_calls_made') }/>
                    <StatsItem
                        labelMsg="panes.assignment.stats.calls_reached"
                        number={ stats.get('num_calls_reached') }/>
                </ul>
            );
        }

        return [
            <h1 key="title">{ assignment.get('title') }</h1>,
            <p key="desc">
                { assignment.get('description') }
            </p>,
            <div key="stats" className="AssignmentPane-stats">
                { statsContent }
            </div>
        ];
    }
}


const StatsItem = props => {
    return (
        <li className="AssignmentPane-statsItem">
            <span className="AssignmentPane-statsItemNumber">
                { props.number }
            </span>
            <p className="AssignmentPane-statsItemLabel">
                <Msg id={ props.labelMsg }
                    values={{ number: props.number }}/>
            </p>
        </li>
    );
};
