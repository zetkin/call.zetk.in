import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/misc/LoadingIndicator';
import { switchLaneToCall } from '../../actions/lane';
import { retrieveUserCalls, startCallWithTarget } from '../../actions/call';


const mapStateToProps = state => ({
    lanes: state.get('lanes'),
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

        if (callList.get('isPending')) {
            logContent = <LoadingIndicator/>;
        }
        else if (callList.get('error')) {
            logContent = <h1>ERROR</h1>;
        }
        else if (callList.get('items')) {
            logContent = (
                <ul className="LaneOverview-logList">
                { callList.get('items').toList().map(call => (
                    <CallLogItem key={ call.get('id') }
                        onSelect={ this.onStartNewCall.bind(this, call) }
                        call={ call }/>
                )) }
                </ul>
            );
        }
        else {
            logContent = null;
        }

        return (
            <div className="LaneOverview">
                <div className="LaneOverview-log">
                    { logContent }
                </div>
                <div className="LaneOverview-lanes">
                    <ul className="LaneOverview-laneList">
                    { this.props.lanes.get('allLanes').toList().map(lane => {
                        let callId = lane.get('callId');
                        let call = callList.getIn(['items', callId]);

                        if (!call) {
                            return null;
                        }

                        return (
                            <LaneItem key={ lane.get('id') }
                                onSelect={ this.onLaneSelect.bind(this, call) }
                                call={ call }
                                />
                        );
                    })}
                    </ul>
                </div>
            </div>
        );
    }

    onLaneSelect(call) {
        this.props.dispatch(switchLaneToCall(call));
    }

    onStartNewCall(oldCall) {
        let assignmentId = oldCall.get('assignment_id');
        let targetId = oldCall.getIn(['target', 'id']);
        this.props.dispatch(startCallWithTarget(assignmentId, targetId));
    }
}


const LaneItem = props => {
    let call = props.call;

    return (
        <li className="LaneOverview-laneItem">
            <a onClick={ props.onSelect }>
                { props.call.getIn(['target', 'name']) }
            </a>
        </li>
    );
};

const CallLogItem = props => {
    let call = props.call;

    return (
        <li className="LaneOverview-logItem">
            <a onClick={ props.onSelect }>
                { call.getIn(['target', 'name']) }
            </a>
        </li>
    );
};
