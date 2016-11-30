import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import FormattedLink from '../../../common/misc/FormattedLink';
import LaneSwitchItem from './LaneSwitchItem';
import PropTypes from '../../../utils/PropTypes';
import { showOverlay } from '../../../actions/view';
import { switchLaneToCall } from '../../../actions/lane';
import { activeCalls, currentCall } from '../../../store/calls';


const mapStateToProps = state => ({
    activeCalls: activeCalls(state),
    currentCall: currentCall(state),
    overlay: state.getIn(['view', 'overlay']),
});


@injectIntl
@connect(mapStateToProps)
export default class LaneSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showInitialToolTip: true,
        };
    }

    render() {
        let overlay = this.props.overlay;
        let content;

        if (!overlay) {
            let currentCall = this.props.currentCall;
            let currentId = currentCall? currentCall.get('id') : undefined;
            let otherCalls = this.props.activeCalls
                .filter(call => call.get('id') != currentId)
                .sortBy(call => call.get('id'));

            let toolTip = null;
            if (this.state.showInitialToolTip) {
                let manualHref = this.props.intl.formatMessage(
                    { id: 'misc.laneSwitch.toolTip.manualLink.href' });

                toolTip = (
                    <div key="toolTip"
                        className="LaneSwitch-toolTip">
                        <Msg tagName="h1" id="misc.laneSwitch.toolTip.h"/>
                        <Msg tagName="p" id="misc.laneSwitch.toolTip.p"/>
                        <p className="LaneSwitch-toolTipLinks">
                            <FormattedLink
                                msgId="misc.laneSwitch.toolTip.skipLink"
                                onClick={ this.onSkipLinkClick.bind(this) }/>
                            <FormattedLink
                                target="_blank"
                                msgId="misc.laneSwitch.toolTip.manualLink.text"
                                href={ manualHref }/>
                        </p>
                    </div>
                );
            }

            content = [
                toolTip,
                <a key="openButton" className="LaneSwitch-openLogButton"
                    onClick={ this.onClickOpen.bind(this) }>log</a>,
                <ul key="callList" className="LaneSwitch-callList">
                { otherCalls.map(call => (
                    <LaneSwitchItem key={ call.get('id') } call={ call }
                        onClick={ this.onClickOtherCall.bind(this, call) }/>
                )) }
                </ul>
            ];
        }
        else {
            // TODO: This component shouldn't have to care about overlay state
            //       Find some way of hiding this when overlay is open
            content = null;
        }

        return (
            <div className="LaneSwitch">
                { content }
            </div>
        );
    }

    onSkipLinkClick() {
        this.setState({
            showInitialToolTip: false,
        });
    }

    onClickOtherCall(call) {
        this.props.dispatch(switchLaneToCall(call));
    }

    onClickOpen() {
        this.setState({
            showInitialToolTip: false,
        });

        this.props.dispatch(showOverlay('laneOverview'));
    }
}
