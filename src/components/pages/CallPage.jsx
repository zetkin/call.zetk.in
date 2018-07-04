import React from 'react';
import { connect } from 'react-redux';

import LaneSwitch from '../misc/laneSwitch/LaneSwitch';
import CallInstructions from '../misc/CallInstructions';
import CallLane from '../call/CallLane';
import { selectedLane } from '../../store/lanes';
import { pushTutorialNote } from '../../actions/tutorial';
import ViewSize from "../misc/ViewSize";


const mapStateToProps = state => ({
    calls: state.get('calls'),
    lane: selectedLane(state),
});

@connect(mapStateToProps)
export default class CallPage extends React.Component {
    componentDidMount() {
        let step = this.props.lane.get('step');
        if (step == 'assignment') {
            this.props.dispatch(pushTutorialNote('tutorial.notes.intro',
                '.LaneControlBar-proceedSection .Button'));
        }
    }

    componentWillReceiveProps(nextProps) {
        let step = nextProps.lane.get('step');

        if (step !== this.props.lane.get('step')) {
            setTimeout(() => {
                if (step == 'prepare') {
                    this.props.dispatch(pushTutorialNote(
                        'tutorial.notes.prepare', null));
                }
                else if (step == 'call') {
                    this.props.dispatch(pushTutorialNote(
                        'tutorial.notes.targetInfo',
                        '.TargetInfo'));
                    this.props.dispatch(pushTutorialNote(
                        'tutorial.notes.postCall',
                        '.LaneControlBar-proceedSection .Button:last-child'));
                    this.props.dispatch(pushTutorialNote(
                        'tutorial.notes.laneSwitch',
                        '.LaneSwitch'));
                }
            }, 800);
        }
    }

    render() {
        let lane = this.props.lane;
        let call = this.props.calls.getIn(['callList', 'items', lane.get('callId')]);

        return (
            <div className="CallPage">
                <LaneSwitch/>
                <ViewSize render={({size}) => (
                    <CallInstructions size={size} call={call}/>
                )}/>
                <ViewSize render={({size}) => (
                    <div className="CallPage-lanes">
                        <CallLane key={ lane.get('id') }
                            lane={ lane } call={ call }
                            size={size}/>
                    </div>
                )}/>
            </div>
        );
    }
}
