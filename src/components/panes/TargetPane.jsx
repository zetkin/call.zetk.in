import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { currentCall } from '../../store/calls';


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
}
