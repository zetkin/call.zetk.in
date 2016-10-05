import React from 'react';
import { connect } from 'react-redux';

import PropTypes from '../../utils/PropTypes';
import { setCallViewState } from '../../actions/view';


const mapStateToProps = state => ({
    viewState: state.getIn(['view', 'callViewState']),
});


@connect(mapStateToProps)
export default class LaneSwitch extends React.Component {
    render() {
        let viewState = this.props.viewState;
        let content;

        if (viewState === 'lane') {
            // TODO: Show active calls
            content = (
                <a className="LaneSwitch-openLogButton"
                    onClick={ this.onClickOpen.bind(this) }>log</a>
            );
        }
        else {
            content = (
                <a className="LaneSwitch-closeLogButton"
                    onClick={ this.onClickClose.bind(this) }>back</a>
            );
        }

        return (
            <div className="LaneSwitch">
                { content }
            </div>
        );
    }

    onClickOpen() {
        this.props.dispatch(setCallViewState('overview'));
    }

    onClickClose() {
        this.props.dispatch(setCallViewState('lane'));
    }
}
