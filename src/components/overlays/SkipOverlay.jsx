import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../common/misc/Button';
import { closeOverlay } from '../../actions/view';
import { skipCall } from '../../actions/call';


const mapStateToProps = state => ({
    currentIsPending: state.getIn(['calls', 'currentIsPending'])
});

@connect(mapStateToProps)
export default class SkipOverlay extends React.Component {
    render() {
        let call = this.props.config.get('call');
        let target = call.get('target');
        let targetName = target.get('name');

        return (
            <div className="SkipOverlay">
                <Msg tagName="h1" id="overlays.skip.h"
                    values={{ target: targetName }}/>
                <Msg tagName="p" id="overlays.skip.p"
                    values={{ target: targetName }}/>

                <Button labelMsg="overlays.skip.skipButton"
                    className="SkipOverlay-skipButton"
                    labelValues={{ target: targetName }}
                    loading={this.props.currentIsPending}
                    onClick={ this.onSkipButtonClick.bind(this) }
                    />
                <Button labelMsg="overlays.skip.resumeButton"
                    labelValues={{ target: targetName }}
                    onClick={ this.onResumeButtonClick.bind(this) }
                    />
            </div>
        );
    }

    onResumeButtonClick() {
        this.props.dispatch(closeOverlay());
    }

    onSkipButtonClick() {
        let call = this.props.config.get('call');
        this.props.dispatch(skipCall(call));
    }
}
