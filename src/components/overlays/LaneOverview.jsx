import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import { activeCalls } from '../../store/calls';
import CallOpList from '../misc/callOpList/CallOpList';
import LoadingIndicator from '../../common/misc/LoadingIndicator';
import { switchLaneToCall } from '../../actions/lane';
import {
    deallocateCall,
    retrieveUserCalls,
    startCallWithTarget
} from '../../actions/call';


const mapStateToProps = state => ({
    activeCalls: activeCalls(state),
    callList: state.getIn(['calls', 'callList']),
});

@connect(mapStateToProps)
export default class LaneOverview extends React.Component {
    componentDidMount() {
        this.props.dispatch(retrieveUserCalls());
    }

    render() {
        let callList = this.props.callList;
        let logContent = null;

        const LOG_OPS = ['repeat'];
        const LANE_OPS = ['switch', 'discard'];

        if (callList.get('isPending')) {
            logContent = <LoadingIndicator/>;
        }
        else if (callList.get('error')) {
            logContent = <h1>ERROR</h1>;
        }
        else if (callList.get('items')) {
            logContent = (
                <CallOpList calls={ callList.get('items').toList() }
                    opMessagePrefix="overlays.laneOverview.ops"
                    ops={ LOG_OPS }
                    onCallOperation={ this.onCallOperation.bind(this) }
                    />
            );
        }
        else {
            logContent = null;
        }

        return (
            <div className="LaneOverview">
                <div className="LaneOverview-log">
                    <Msg tagName="h1"
                        id="overlays.laneOverview.log.h"/>
                    { logContent }
                </div>
                <div className="LaneOverview-lanes">
                    <Msg tagName="h1"
                        id="overlays.laneOverview.lanes.h"/>
                    <CallOpList calls={ this.props.activeCalls }
                        opMessagePrefix="overlays.laneOverview.ops"
                        ops={ LANE_OPS }
                        onCallOperation={ this.onCallOperation.bind(this) }
                        />
                </div>
            </div>
        );
    }

    onCallOperation(call, op) {
        if (op == 'repeat') {
            let assignmentId = call.get('assignment_id');
            let targetId = call.getIn(['target', 'id']);
            this.props.dispatch(startCallWithTarget(assignmentId, targetId));
        }
        else if (op == 'switch') {
            this.props.dispatch(switchLaneToCall(call));
        }
        else if (op == 'discard') {
            this.props.dispatch(deallocateCall(call));
        }
    }
}
