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
    };

    constructor(props) {
        super(props);

        this.state = {
            firstCall: true,
            activePane: 1,
            showTabs: false
        };
    }

    checkTabs() {
        const {showTabs} = this.state;
        const step = this.props.lane.get('step');
        const tabSteps = [ 'prepare', 'call', 'report', 'done'];
        let nextTabs = false;

        if (typeof window != 'undefined') {
            if (window.innerWidth < 600) {
                if (tabSteps.indexOf(step) >= 0 ) {
                    nextTabs = true;
                }
            }
        }
        if (showTabs != nextTabs) {
            this.setState({showTabs: nextTabs});
        }
    }

    componentDidMount() {
        this.checkTabs();
        window.addEventListener("resize", this.checkTabs.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkTabs.bind(this));
    }

    componentWillReceiveProps(nextProps) {
        const nextStep = nextProps.lane.get('step');
        this.checkTabs();
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
        const {activePane, showTabs} = this.state;
        let lane = this.props.lane;
        let step = lane.get('step');
        let infoMode = lane.get('infoMode');
        let paneComponents = [];
        let tabs;

        switch (step) {
            case 'assignment':
                paneComponents = [ 'assignment', 'instructions' ];
                break;
            case 'prepare':
                paneComponents = [ 'instructions', 'target', 'input' ];
                break;
            case 'call':
                paneComponents = [ 'instructions', 'target', 'input', 'report' ];
                break;
            case 'report':
                paneComponents = [ 'instructions', 'target', 'input', 'report' ];
                break;
            case 'done':
                paneComponents = [ 'report', 'stats' ];
                break;
            case 'empty':
                paneComponents = [ 'empty' ];
                break;
        }

        if (showTabs) {
            tabs = (
                <CallLaneTabs
                    activePane={activePane}
                    setActivePane={this.setActivePane.bind(this)}
                    step={ step }/>
            );
        }

        let panes = paneComponents.map((paneType, i) => {
            let PaneComponent = paneComponentsByType[paneType];
            const className = cx({'CallLane-activePane': showTabs && i === activePane});
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
