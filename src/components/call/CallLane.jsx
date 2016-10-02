import React from 'react';
import cx from 'classnames';

import LaneControlBar from './LaneControlBar';
import PropTypes from '../../utils/PropTypes';
import * as panes from './panes';


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
                paneComponents = [ 'assignment', 'info' ];
                break;
            case 'prepare':
                paneComponents = [ 'info', 'input' ];
                break;
            case 'call':
                paneComponents = [ 'info', 'input' ];
                break;
            case 'report':
                paneComponents = [ 'info', 'input', 'report' ];
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
                <div className="CallLane-panes">
                    { panes }
                </div>
                <LaneControlBar lane={ this.props.lane }/>
            </div>
        );
    }
}

const paneComponentsByType = {
    assignment: panes.AssignmentPane,
    info: panes.InfoPane,
    input: panes.InputPane,
    report: panes.ReportPane,
    stats: panes.StatsPane,
};
