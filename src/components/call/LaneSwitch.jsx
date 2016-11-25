import React from 'react';
import { connect } from 'react-redux';

import Avatar from '../misc/Avatar';
import PropTypes from '../../utils/PropTypes';
import { showOverlay } from '../../actions/view';
import { switchLaneToCall } from '../../actions/lane';
import { activeCalls, currentCall } from '../../store/calls';


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
            let otherCalls = this.props.activeCalls.filter(call =>
                call !== this.props.currentCall);

            content = [
                <a key="openButton" className="LaneSwitch-openLogButton"
                    onClick={ this.onClickOpen.bind(this) }>log</a>,
                <ul key="callList" className="LaneSwitch-callList">
                { otherCalls.map(call => (
                    <SwitchItem key={ call.get('id') } call={ call }
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


const SwitchItem = props => {
    let call = props.call;
    let target = call.get('target');

    return (
        <li className="LaneSwitch-callItem"
            title={ target.get('name') }
            onClick={ props.onClick }>
            <Avatar personId={ target.get('id') }
                orgId={ call.get('organization_id') }
                mask={ true }
                />
        </li>
    );
}
