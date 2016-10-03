import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import { selectedAssignment } from '../../store/assignments';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class AssignmentPane extends PaneBase {
    renderContent() {
        let assignment = this.props.assignment;

        return [
            <h1 key="title">{ assignment.get('title') }</h1>,
            <p key="desc">
                { assignment.get('description') }
            </p>,
            <div key="stats" className="AssignmentPane-stats">
                Stats go here.
            </div>
        ];
    }
}
