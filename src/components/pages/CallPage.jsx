import React from 'react';
import { connect } from 'react-redux';

import LaneSwitch from '../call/LaneSwitch';
import CallLane from '../call/CallLane';
import { selectedLane } from '../../store/lanes';


const mapStateToProps = state => ({
    viewState: state.getIn(['view', 'callViewState']),
    lane: selectedLane(state),
});

@connect(mapStateToProps)
export default class CallPage extends React.Component {
    render() {
        let content;
        let viewState = this.props.viewState;

        if (viewState === 'lane') {
            content = (
                <CallLane lane={ this.props.lane }/>
            );
        }
        else if (viewState === 'overview') {
            content = (
                <div>LOG PLACEHOLDER</div>
            );
        }

        return (
            <div className="CallPage">
                <LaneSwitch/>
                { content }
            </div>
        );
    }
}
