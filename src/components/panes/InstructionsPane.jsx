import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { selectedAssignment } from '../../store/assignments';
import { setLaneInfoMode } from '../../actions/lane';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class InstructionsPane extends PaneBase {
    renderContent() {
        let assignment = this.props.assignment;

        return [
            <Msg tagName="h1" key="h1" id="panes.instructions.h1"/>,
            <div key="instructions" className="InstructionsPane-instructions"
                dangerouslySetInnerHTML={{
                    __html: assignment.get('instructions') }}/>,
        ];
    }

    renderHeader() {
        let step = this.props.step;

        if (step === 'call' || step === 'report') {
            return (
                <button className="InstructionsPane-targetButton"
                    onClick={ this.onClickTarget.bind(this) }>
                    <Msg id="panes.instructions.targetButton"/>
                </button>
            );
        }
        else {
            return null;
        }
    }

    onClickTarget() {
        this.props.dispatch(setLaneInfoMode('target'));
    }
}
