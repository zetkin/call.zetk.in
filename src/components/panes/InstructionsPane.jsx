import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { selectedAssignment } from '../../store/assignments';
import { currentCall } from '../../store/calls';
import { setLaneInfoMode } from '../../actions/lane';
import CleanHtml from '../../common/misc/CleanHtml';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
    call: currentCall(state),
    caller: state ? state.get('user') : null,
});

// Replace identifiers in the text, e.g. "{target.email}" --> "anna@example.com"
// and "{caller.first_name}" --> "Joe"
function replaceIdentifiers(text, target, caller) {
    let replaced_text = text;

    let target_identifiers = [
        'first_name',
        'last_name',
        'name',
        'phone',
        'alt_phone',
        'ext_id',
        'id',
        'email',
        'zip_code',
        'city',
    ];

    for (let identifier of target_identifiers) {
        const targetIdRegex = RegExp(`{\s*target.${identifier}\s*}`, 'g');
        replaced_text = replaced_text.replace(targetIdRegex, target.get(identifier));
    }

    let caller_identifier = [
        'first_name',
        'last_name',
    ];

    for (let identifier of caller_identifier) {
        const callerIdRegex = RegExp(`{\s*caller.${identifier}\s*}`, 'g');
        replaced_text = replaced_text.replace(callerIdRegex, caller.getIn(['data', identifier]));
    }

    return replaced_text;
}

@connect(mapStateToProps)
export default class InstructionsPane extends PaneBase {
    renderContent() {
        let assignment = this.props.assignment;
        let instructions = assignment.get('instructions');

        if (this.props.call && this.props.caller) {
            instructions = replaceIdentifiers(instructions, this.props.call.get('target'), this.props.caller);
        }

        return [
            <CleanHtml
                component="div"
                key="instructions"
                className="InstructionsPane-instructions"
                containerRef={ div => this.domContent = div }
                dirtyHtml={instructions}/>,
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
            return (
                <Msg tagName="p" id="panes.instructions.h1"/>
            );
        }
    }

    componentDidMount() {
        if (this.domContent && this.domContent.querySelectorAll) {
            this.domContent.querySelectorAll('a').forEach(a => {
                a.setAttribute('target', '_blank');
            });
        }
    }

    onClickTarget() {
        this.props.dispatch(setLaneInfoMode('target'));
    }
}
