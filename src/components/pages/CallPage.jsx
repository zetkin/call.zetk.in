import React from 'react';
import { connect } from 'react-redux';

import LaneSwitch from '../call/LaneSwitch';
import CallLane from '../call/CallLane';
import { selectedLane } from '../../store/lanes';


const mapStateToProps = state => ({
    calls: state.get('calls'),
    lane: selectedLane(state),
});

@connect(mapStateToProps)
export default class CallPage extends React.Component {
    render() {
        let lane = this.props.lane;
        let call = this.props.calls.getIn(['callList', 'items', lane.get('callId')]);

        return (
            <div className="CallPage">
                <LaneSwitch/>
                <div className="CallPage-lanes">
                    <CallLane key={ lane.get('id') }
                        lane={ lane } call={ call }/>
                </div>
            </div>
        );
    }
}
