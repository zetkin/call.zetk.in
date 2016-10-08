import React from 'react';
import { connect } from 'react-redux';

import PropTypes from '../../utils/PropTypes';
import { setCallViewState } from '../../actions/view';
import { switchLaneToCall } from '../../actions/lane';
import { activeCalls, currentCall } from '../../store/calls';


const mapStateToProps = state => ({
    activeCalls: activeCalls(state),
    currentCall: currentCall(state),
    viewState: state.getIn(['view', 'callViewState']),
});


@connect(mapStateToProps)
export default class LaneSwitch extends React.Component {
    render() {
        let viewState = this.props.viewState;
        let content;

        if (viewState === 'lane') {
            let otherCalls = this.props.activeCalls.filter(call =>
                call !== this.props.currentCall);

            content = [
                <a key="openButton" className="LaneSwitch-openLogButton"
                    onClick={ this.onClickOpen.bind(this) }>log</a>,
                <ul key="callList" className="LaneSwitch-callList">
                { otherCalls.map(call => (
                    <li key={ call.get('id') }
                        onClick={ this.onClickOtherCall.bind(this, call) }>
                        { call.get('target').get('name') }
                    </li>
                )) }
                </ul>
            ];
        }
        else {
            content = (
                <a className="LaneSwitch-closeLogButton"
                    onClick={ this.onClickClose.bind(this) }>back</a>
            );
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
        this.props.dispatch(setCallViewState('overview'));
    }

    onClickClose() {
        this.props.dispatch(setCallViewState('lane'));
    }
}
