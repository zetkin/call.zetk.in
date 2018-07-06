import React from 'react';
import cx from 'classnames';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import CallLaneTabs from './CallLaneTabs';
import LaneControlBar from './LaneControlBar';
import PropTypes from '../../utils/PropTypes';
import * as panes from '../panes';


export default class CallLane extends React.Component {
    static propTypes = {
        lane: PropTypes.map.isRequired,
        call: PropTypes.map,
        size: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            firstCall: true,
            activePane: 1
        };
    }

    componentWillReceiveProps(nextProps) {
        const nextStep = nextProps.lane.get('step');
        if (nextStep != this.props.lane.get('step')) {
            let {activePane} = this.state;
            if (nextStep === 'prepare') {
                activePane = 1;
            }
            else if (nextStep === 'call') {
                activePane = 2;
            }
            else if (nextStep === 'report') {
                activePane = 3;
            }
            else if (nextStep === 'done') {
                activePane = 1;
            }
            this.setState({activePane});
        }
        if (nextStep === 'done') {
            this.setState({
                firstCall: false,
            });
        }
    }

    setActivePane(index) {
        this.setState({activePane: index});
    }

    render() {
        const {size, call} = this.props;
        const {activePane} = this.state;
        let lane = this.props.lane;
        let step = lane.get('step');
        let infoMode = lane.get('infoMode');
        let paneComponents = [];
        let tabbed = false;
        let tabs;

        switch (step) {
            case 'assignment':
                paneComponents = [ 'assignment', 'instructions' ];
                break;
            case 'prepare':
                paneComponents = [ 'instructions', 'target', 'input' ];
                tabbed = size === "small";
                break;
            case 'call':
                paneComponents = [ 'instructions', 'target', 'input', 'report' ];
                tabbed = size === "small";
                break;
            case 'report':
                paneComponents = [ 'instructions', 'target', 'input', 'report' ];
                tabbed = size === "small";
                break;
            case 'done':
                paneComponents = [ 'report', 'stats' ];
                tabbed = size === "small";
                break;
            case 'empty':
                paneComponents = [ 'empty' ];
                break;
        }

        if (tabbed) {
            tabs = (
                <CallLaneTabs
                    activePane={activePane}
                    call={call}
                    setActivePane={this.setActivePane.bind(this)}
                    lane={ lane }/>
            );
        }

        let panes = paneComponents.map((paneType, i) => {
            let PaneComponent = paneComponentsByType[paneType];
            const className = cx({'CallLane-activePane': tabbed && i === activePane});
            return (
                <PaneComponent step={ step } key={ paneType }
                    lane={ lane }
                    call={ this.props.call }
                    className={className}
                    firstCall={ this.state.firstCall }/>
            );
        });

        let classes = cx(
            'CallLane',
            'CallLane-' + step + 'Step',
            'CallLane-' + infoMode + 'InfoMode',
        );

        return (
            <div className={ classes }>
                {tabs}
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
    empty: panes.QueueEmptyPane,
    instructions: panes.InstructionsPane,
    input: panes.InputPane,
    report: panes.ReportPane,
    stats: panes.StatsPane,
    target: panes.TargetPane,
};
