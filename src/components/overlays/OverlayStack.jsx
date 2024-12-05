import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { resolveOverlay } from '.';
import { closeOverlay } from '../../actions/view';


const mapStateToProps = state => ({
    overlay: state.getIn(['view', 'overlay']),
});

@connect(mapStateToProps)
export default class OverlayStack extends React.Component {
    render() {
        let content = null;
        let overlayData = this.props.overlay;
        if (overlayData) {
            let OverlayComponent = resolveOverlay(overlayData.get('type'));
            content = [];

            if (overlayData.getIn(['config', 'closeButton'], true)) {
                content.push(
                    <button key="closeButton"
                        className="OverlayStack-closeButton"
                        onClick={ this.onCloseButtonClick.bind(this) }>
                        </button>
                );
            }

            content.push(
                <div key="overlay" className="OverlayStack-overlay">
                    <OverlayComponent config={ overlayData.get('config') }/>
                </div>,
            );
        }

        return (
            <CSSTransitionGroup
                transitionEnterTimeout={ 500 }
                transitionLeaveTimeout={ 500 }
                transitionName="OverlayStack"
                component="div" className="OverlayStack">
                { content }
            </CSSTransitionGroup>
        );
    }

    onCloseButtonClick() {
        this.props.dispatch(closeOverlay());
    }
}
