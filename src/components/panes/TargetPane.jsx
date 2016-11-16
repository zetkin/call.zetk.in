import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import PaneBase from './PaneBase';
import { currentCall } from '../../store/calls';
import { setLaneInfoMode } from '../../actions/lane';
import { selectedAssignment } from '../../store/assignments';
import Avatar from '../misc/Avatar';


const mapStateToProps = state => ({
    call: currentCall(state),
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class TargetPane extends PaneBase {
    renderContent() {
        let target = this.props.call.get('target');

        let info = [
            <li key="phone" className="TargetPane-infoPhone">
                { target.get('phone') }</li>,
            <li key="email" className="TargetPane-infoEmail">
                { target.get('phone') }</li>,
        ]

        return [
            <Avatar key="avatar"
                personId={ target.get('id') }
                orgId={ this.props.assignment.get('organization_id') }/>,
            <h1 key="name" className="TargetPane-name">
                { target.get('name') }</h1>,
            <ul key="info" className="TargetPane-info">
                { info }</ul>
        ];
    }

    renderHeader() {
        let step = this.props.step;

        if (step === 'call' || step === 'report') {
            return (
                <button className="TargetPane-instructionsButton"
                    onClick={ this.onClickInstructions.bind(this) }>
                    <Msg id="panes.target.instructionsButton"/>
                </button>
            );
        }
        else {
            return null;
        }
    }

    onClickInstructions() {
        this.props.dispatch(setLaneInfoMode('instructions'));
    }
}
