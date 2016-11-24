import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import LaneSwitch from '../call/LaneSwitch';
import LaneOverview from '../call/LaneOverview';
import CallLane from '../call/CallLane';
import { selectedLane } from '../../store/lanes';


const mapStateToProps = state => ({
    viewState: state.getIn(['view', 'callViewState']),
    lane: selectedLane(state),
});

@connect(mapStateToProps)
export default class CallPage extends React.Component {
    render() {
        let overlay;
        let viewState = this.props.viewState;

        if (viewState === 'overview') {
            overlay = (
                <LaneOverview key="overview"/>
            );
        }

        return (
            <CSSTransitionGroup
                transitionEnterTimeout={ 500 }
                transitionLeaveTimeout={ 500 }
                transitionName="CallPage"
                component="div" className="CallPage">
                <LaneSwitch/>
                <div className="CallPage-lanes">
                    <CallLane lane={ this.props.lane }/>
                </div>
                { overlay }
            </CSSTransitionGroup>
        );
    }
}
