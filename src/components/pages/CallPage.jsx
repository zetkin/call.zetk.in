import React from 'react';
import { connect } from 'react-redux';

import LaneSwitch from '../misc/laneSwitch/LaneSwitch';
import CallInstructions from '../misc/CallInstructions';
import CallLane from '../call/CallLane';
import { selectedLane } from '../../store/lanes';
import { pushTutorialNote } from '../../actions/tutorial';
import ViewSize from "../misc/ViewSize";
import getViewSize from '../../utils/getViewSize';
import { selectedAssignmentCallerProfile } from '../../store/user';


const mapStateToProps = state => ({
    calls: state.get('calls'),
    caller: selectedAssignmentCallerProfile(state),
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
                    this.props.dispatch(pushTutorialNote(
                        'tutorial.notes.laneSwitch',
                        '.LaneSwitch'));
                }
                else if (step == 'call') {
                    if (getViewSize() != 'small') {
                        // This tutorial step is redundant on mobile
                        let tutorialMessage = 'tutorial.notes.targetInfoPhone';
                        if (nextProps.caller.get('has_voip_credentials')) {
                            tutorialMessage = 'tutorial.notes.targetInfoVoip';
                        } else if (nextProps.caller.get('has_voip_embed')) {
                            tutorialMessage = 'tutorial.notes.targetInfoVoip';
                        }
                        this.props.dispatch(pushTutorialNote(
                            tutorialMessage,
                            '.TargetInfo'));
                    }

                    this.props.dispatch(pushTutorialNote(
                        'tutorial.notes.postCall',
                        '.LaneControlBar-proceedSection .Button:last-child'));
                }
            }, 800);
        }
    }

    render() {
        let lane = this.props.lane;
        let call = this.props.calls.getIn(['callList', 'items', lane.get('callId')]);
        let callInstructions;
        if (lane.get('step') === "call") {
            callInstructions = <ViewSize render={({size}) => (
                <CallInstructions size={size} call={call} lane={lane}/>
            )}/>
        }

        return (
            <div className="CallPage">
                <LaneSwitch/>
                {callInstructions}
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
