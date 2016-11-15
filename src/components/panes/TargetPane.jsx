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

        const avatarDomain = '//api.' + process.env.ZETKIN_DOMAIN;
        const avatarSrc = avatarDomain + '/v1/users/' + target.get('id') + '/avatar';
        const avatarStyle = {backgroundImage: 'url("' + avatarSrc + '")'}

        let info = [
            <li key="phone" className="TargetPane-infoPhone">
                { target.get('phone') }</li>,
            <li key="email" className="TargetPane-infoEmail">
                { target.get('phone') }</li>,
        ]

        return [
            <img key="image" className="TargetPane-avatar"
                src={ avatarSrc } />,
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
