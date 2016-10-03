import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import PaneBase from './PaneBase';
import { currentCall } from '../../store/calls';
import { setLaneInfoMode } from '../../actions/lane';


const mapStateToProps = state => ({
    call: currentCall(state),
});

@connect(mapStateToProps)
export default class TargetPane extends PaneBase {
    renderContent() {
        let target = this.props.call.get('target');

        return [
            <h1 key="name">{ target.get('name') }</h1>
        ];
    }

    renderHeader() {
        let step = this.props.step;

        if (step === 'call' || step === 'report') {
            return (
                <button className="TargetPane-instructionsButton"
                    onClick={ this.onClickInstructions.bind(this) }>
                    <Msg id="panes.target.instructions"/>
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
