import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { activeCalls } from '../../store/calls';
import CallOpList from '../misc/callOpList/CallOpList';
import LoadingIndicator from '../../common/misc/LoadingIndicator';
import { switchLaneToCall } from '../../actions/lane';
import getViewSize from '../../utils/getViewSize';
import {
    deallocateCall,
    retrieveUserCalls,
    startCallWithTarget
} from '../../actions/call';


const mapStateToProps = state => ({
    activeCalls: activeCalls(state),
    callList: state.getIn(['calls', 'callList']),
});

@injectIntl
@connect(mapStateToProps)
export default class LaneOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filterString: '',
        };
    }

    componentDidMount() {
        this.props.dispatch(retrieveUserCalls());

        if (getViewSize() != 'small') {
            let filterInput = ReactDOM.findDOMNode(this.refs.filterInput);
            if (filterInput) {
                filterInput.focus();
            }
        }
    }

    render() {
        let callList = this.props.callList;
        let activeCalls = this.props.activeCalls;
        let logContent = null;

        const LANE_OPS = ['switch', 'discard'];

        if (callList.get('isPending')) {
            logContent = <LoadingIndicator/>;
        }
        else if (callList.get('error')) {
            logContent = <h1>ERROR</h1>;
        }
        else if (callList.get('items')) {
            let opsForCall = call => {
                let targetId = call.getIn(['target', 'id']);
                let activeCall = activeCalls
                    .find(c => c.getIn(['target','id']) === targetId);

                if (activeCall) {
                    return {
                        'switch': this.onSwitchFromOld.bind(this),
                    };
                }
                else {
                    return ['repeat'];
                }
            };

            // Exclude calls that are merely allocated. They will be in the
            // adjacent lanes list anyway. Finally order calls by date.
            let calls = callList.get('items').toList()
                .filter(c => c.get('state') !== 0)
                .sortBy(c => c.get('allocation_time'))
                .reverse();

            let filterString = this.state.filterString.toLowerCase();
            if (filterString.length > 2) {
                calls = calls.filter(c =>
                    (c.getIn(['target', 'name']) || '')
                        .toLowerCase()
                        .indexOf(filterString) >= 0
                    || (c.getIn(['target', 'phone']) || '')
                        .replace(/\s/g, '')
                        .indexOf(filterString) >= 0
                    || (c.getIn(['target', 'alt_phone']) || '')
                        .replace(/\s/g, '')
                        .indexOf(filterString) >= 0
                );
            }

            logContent = (
                <CallOpList calls={ calls }
                    opMessagePrefix="overlays.laneOverview.log.ops"
                    ops={ opsForCall }
                    onCallOperation={ this.onCallOperation.bind(this) }
                    />
            );
        }
        else {
            logContent = null;
        }

        let filterPlaceholder = this.props.intl.formatMessage(
            { id: 'overlays.laneOverview.log.filterPlaceholder' });

        return (
            <div className="LaneOverview">
                <div className="LaneOverview-log">
                    <Msg tagName="h1"
                        id="overlays.laneOverview.log.h"/>
                    <Msg tagName="p"
                        id="overlays.laneOverview.log.p"/>
                    <i className="fa fa-search"></i>
                    <input type="text" ref="filterInput"
                        placeholder={ filterPlaceholder }
                        value={ this.state.filterString }
                        onKeyUp={ this.onFilterKeyUp.bind(this) }
                        onChange={ this.onFilterChange.bind(this) }
                        />
                    { logContent }
                </div>
                <div className="LaneOverview-lanes">
                    <Msg tagName="h1"
                        id="overlays.laneOverview.lanes.h"/>
                    <Msg tagName="p"
                        id="overlays.laneOverview.lanes.p"/>
                    <CallOpList calls={ activeCalls }
                        opMessagePrefix="overlays.laneOverview.lanes.ops"
                        ops={ LANE_OPS }
                        onCallOperation={ this.onCallOperation.bind(this) }
                        />
                </div>
            </div>
        );
    }

    onFilterChange(ev) {
        this.setState({
            filterString: ev.target.value,
        });
    }

    onFilterKeyUp(ev) {
        if (ev.keyCode == 27) {
            ev.stopPropagation();
            ev.target.blur();
            this.setState({
                filterString: ''
            });
        }
    }

    onSwitchFromOld(oldCall) {
        let targetId = oldCall.getIn(['target', 'id']);
        let activeCall = this.props.activeCalls
            .find(c => c.getIn(['target','id']) === targetId);

        this.props.dispatch(switchLaneToCall(activeCall));
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
