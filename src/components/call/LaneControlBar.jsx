import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import Button from '../misc/Button';
import PropTypes from '../../utils/PropTypes';
import TargetInfo from './TargetInfo';
import { selectedAssignment } from '../../store/assignments';
import { currentCall } from '../../store/calls';
import { setLaneStep } from '../../actions/lane';
import { startNewCall } from '../../actions/call';


const mapStateToProps = state => ({
    call: currentCall(state),
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class LaneControlBar extends React.Component {
    static propTypes = {
        lane: PropTypes.map.isRequired,
        assignment: PropTypes.map.isRequired,
    };

    render() {
        let content, proceedSection;
        let call = this.props.call;
        let lane = this.props.lane;
        let step = lane.get('step');

        if (step === 'assignment') {
            let assignment = this.props.assignment;

            content = <h1>{ assignment.get('title') }</h1>
            proceedSection = (
                <Button key="startButton"
                    labelMsg="controlBar.startButton"
                    onClick={ this.onClickStart.bind(this) }/>
            );
        }
        else if (step === 'prepare') {
            let target = call.get('target');

            content = (
                <TargetInfo target={ target }/>
            );

            proceedSection = (
                <Button key="callButton"
                    labelMsg="controlBar.callButton"
                    labelValues={{ name: target.get('name') }}
                    onClick={ this.onClickCall.bind(this) }/>
            );
        }
        else if (step === 'call') {
            content = (
                <TargetInfo target={ call.get('target') }
                    showFullInfo={ true }/>
            );

            proceedSection = (
                <Button key="finishCallButton"
                    labelMsg="controlBar.finishCallButton"
                    onClick={ this.onClickFinishCall.bind(this) }/>
            );
        }
        else if (step === 'report') {
            content = (
                <TargetInfo target={ call.get('target') }
                    showFullInfo={ true }/>
            );

            if (call.getIn(['report', 'step']) === 'summary') {
                proceedSection = (
                    <Button key="submitReportButton"
                        labelMsg="controlBar.submitReportButton"
                        onClick={ this.onClickSubmitReport.bind(this) }/>
                );
            }
        }
        else if (step === 'done') {
            content = null;
            proceedSection = (
                <Button key="nextCallButton"
                    labelMsg="controlBar.nextCallButton"
                    onClick={ this.onClickNextCall.bind(this) }/>
            );
        }

        let classes = cx('LaneControlBar', 'LaneControlBar-' + step + 'Step');

        return (
            <div className={ classes }>
                <div className="LaneControlBar-content">
                    { content }
                </div>
                <div className="LaneControlBar-proceedSection">
                    { proceedSection }
                </div>
            </div>
        );
    }

    onClickStart() {
        this.props.dispatch(startNewCall(this.props.assignment));
    }

    onClickCall() {
        let lane = this.props.lane;
        this.props.dispatch(setLaneStep(lane, 'call'));
    }

    onClickFinishCall() {
        let lane = this.props.lane;
        this.props.dispatch(setLaneStep(lane, 'report'));
    }

    onClickSubmitReport() {
        // TODO: Add action to submit report
        let lane = this.props.lane;
        this.props.dispatch(setLaneStep(lane, 'done'));
    }

    onClickNextCall() {
        // TODO: Allocate another call
        let lane = this.props.lane;
        this.props.dispatch(setLaneStep(lane, 'prepare'));
    }
}
