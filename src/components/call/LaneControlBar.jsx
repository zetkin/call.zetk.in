import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../common/misc/Button';
import CallProgressBar from './CallProgressBar';
import PropTypes from '../../utils/PropTypes';
import TargetInfo from './TargetInfo';
import { selectedAssignment } from '../../store/assignments';
import { currentCall, currentReport } from '../../store/calls';
import { setLaneStep } from '../../actions/lane';
import { startNewCall, submitCallReport } from '../../actions/call';


const mapStateToProps = state => ({
    call: currentCall(state),
    report: currentReport(state),
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class LaneControlBar extends React.Component {
    static propTypes = {
        lane: PropTypes.map.isRequired,
        assignment: PropTypes.map.isRequired,
    };

    render() {
        let returnSection, content, proceedSection;
        let call = this.props.call;
        let lane = this.props.lane;
        let step = lane.get('step');

        if (step === 'assignment') {
            let assignment = this.props.assignment;

            returnSection = (
                <Button key="endButton"
                    labelMsg="controlBar.endButton"/>
            );

            content = null;

            proceedSection = (
                <Button key="startButton"
                    labelMsg="controlBar.startButton"
                    onClick={ this.onClickStart.bind(this) }/>
            );
        }
        else if (step === 'prepare' && call) {
            let target = call.get('target');

            returnSection = (
                <Button key="endButton"
                    labelMsg="controlBar.endButton"/>
            );

            content = (
                <Msg tagName="p" className="" id="controlBar.instructions.prepare"/>
                // TODO: Fix transition when not using TargetInfo anymore.
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
            let report = this.props.report;

            content = (
                <TargetInfo target={ call.get('target') }
                    showFullInfo={ true }/>
            );

            if (report.get('step') === 'summary') {
                proceedSection = (
                    <Button key="submitReportButton"
                        labelMsg="controlBar.submitReportButton"
                        onClick={ this.onClickSubmitReport.bind(this) }/>
                );
            }
        }
        else if (step === 'done') {
            returnSection = (
                <Button key="endButton"
                    labelMsg="controlBar.endButton"/>
            );

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
                <CallProgressBar key={ call? call.get('id') : '' } lane={ lane }/>
                <div className="LaneControlBar-returnSection">
                    { returnSection }
                </div>
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
        this.props.dispatch(submitCallReport());
    }

    onClickNextCall() {
        this.props.dispatch(startNewCall(this.props.assignment));
    }
}
