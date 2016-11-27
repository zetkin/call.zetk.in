import React from 'react';
import { connect } from 'react-redux';

import LaneSwitchItem from './LaneSwitchItem';
import PropTypes from '../../../utils/PropTypes';
import { showOverlay } from '../../../actions/view';
import { switchLaneToCall } from '../../../actions/lane';
import { activeCalls, currentCall } from '../../../store/calls';


const mapStateToProps = state => ({
    activeCalls: activeCalls(state),
    currentCall: currentCall(state),
    overlay: state.getIn(['view', 'overlay']),
});


@connect(mapStateToProps)
export default class LaneSwitch extends React.Component {
    render() {
        let overlay = this.props.overlay;
        let content;

        if (!overlay) {
            let currentCall = this.props.currentCall;
            let currentId = currentCall? currentCall.get('id') : undefined;
            let otherCalls = this.props.activeCalls
                .filter(call => call.get('id') != currentId)
                .sortBy(call => call.get('id'));

            content = [
                <a key="openButton" className="LaneSwitch-openLogButton"
                    onClick={ this.onClickOpen.bind(this) }>log</a>,
                <ul key="callList" className="LaneSwitch-callList">
                { otherCalls.map(call => (
                    <LaneSwitchItem key={ call.get('id') } call={ call }
                        onClick={ this.onClickOtherCall.bind(this, call) }/>
                )) }
                </ul>
            ];
        }
        else {
            // TODO: This component shouldn't have to care about overlay state
            //       Find some way of hiding this when overlay is open
            content = null;
        }

        return (
            <div className="LaneSwitch">
                { content }
            </div>
        );
    }

    onClickOtherCall(call) {
        this.props.dispatch(switchLaneToCall(call));
    }

    onClickOpen() {
        this.props.dispatch(showOverlay('laneOverview'));
    }
}
