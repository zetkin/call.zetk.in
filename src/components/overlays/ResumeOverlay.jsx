import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import { activeCalls } from '../../store/calls';
import CallOpList from '../misc/callOpList/CallOpList';
import { closeOverlay } from '../../actions/view';
import { deallocateCall } from '../../actions/call';
import { switchLaneToCall } from '../../actions/lane';


const mapStateToProps = state => ({
    activeCalls: activeCalls(state),
});

@connect(mapStateToProps)
export default class ResumeOverlay extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.activeCalls.size == 0) {
            // User has deleted all active calls. Allow animations
            // to play out and then close overlay.
            setTimeout(() => this.props.dispatch(closeOverlay()), 300);
        }
    }

    render() {
        let callOpMsgPrefix = 'overlays.resume.ops';
        let callOps = [ 'resume', 'discard' ];

        return (
            <div className="ResumeOverlay">
                <Msg tagName="h1" id="overlays.resume.h"/>
                <Msg tagName="p" id="overlays.resume.p"/>
                <CallOpList calls={ this.props.activeCalls }
                    opMessagePrefix={ callOpMsgPrefix }
                    ops={ callOps }
                    onCallOperation={ this.onCallOperation.bind(this) }
                    />
            </div>
        );
    }

    onCallOperation(call, op) {
        if (op == 'resume') {
            this.props.dispatch(switchLaneToCall(call));
        }
        else if (op == 'discard') {
            this.props.dispatch(deallocateCall(call));
        }
    }
}
