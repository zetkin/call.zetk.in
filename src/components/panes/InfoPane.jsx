import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { selectedAssignment } from '../../store/assignments';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class InfoPane extends PaneBase {
    renderContent() {
        let assignment = this.props.assignment;

        return [
            <Msg tagName="h1" key="h1" id="panes.info.h1"/>,
            <div key="instructions" className="InfoPane-instructions"
                dangerouslySetInnerHTML={{
                    __html: assignment.get('instructions') }}/>,
        ];
    }
}
