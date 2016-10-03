import React from 'react';
import cx from 'classnames';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import LaneControlBar from './LaneControlBar';
import PropTypes from '../../utils/PropTypes';
import * as panes from '../panes';


export default class CallLane extends React.Component {
    static propTypes = {
        lane: PropTypes.map.isRequired,
    };

    render() {
        let lane = this.props.lane;
        let step = lane.get('step');
        let paneComponents = [];

        switch (step) {
            case 'assignment':
                paneComponents = [ 'assignment', 'instructions' ];
                break;
            case 'prepare':
                paneComponents = [ 'instructions', 'target', 'input' ];
                break;
            case 'call':
                paneComponents = [ 'instructions', 'target', 'input' ];
                break;
            case 'report':
                paneComponents = [ 'instructions', 'target', 'input', 'report' ];
                break;
            case 'done':
                paneComponents = [ 'report', 'stats' ];
                break;
        }

        let panes = paneComponents.map(paneType => {
            let PaneComponent = paneComponentsByType[paneType];
            return (
                <PaneComponent step={ step } key={ paneType }/>
            );
        });

        let classes = cx('CallLane', 'CallLane-' + step + 'Step');

        return (
            <div className={ classes }>
                <CSSTransitionGroup
                    transitionEnterTimeout={ 500 }
                    transitionLeaveTimeout={ 500 }
                    transitionName="PaneBase"
                    component="div" className="CallLane-panes">
                    { panes }
                </CSSTransitionGroup>
                <LaneControlBar lane={ this.props.lane }/>
            </div>
        );
    }
}

const paneComponentsByType = {
    assignment: panes.AssignmentPane,
    instructions: panes.InstructionsPane,
    input: panes.InputPane,
    report: panes.ReportPane,
    stats: panes.StatsPane,
    target: panes.TargetPane,
};
