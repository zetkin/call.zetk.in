import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import AssignmentList from './AssignmentList';
import { retrieveUserAssignments } from '../../../actions/assignment';


const mapStateToProps = (state) => ({
    assignmentList: state.getIn(['assignments', 'assignmentList']),
});

@connect(mapStateToProps)
export default class AssignmentsPage extends React.Component {
    componentDidMount() {
        this.props.dispatch(retrieveUserAssignments());
    }

    render() {
        let intro;
        let assignmentList = this.props.assignmentList;
        let items = assignmentList.get('items');

        if (assignmentList.isPending) {
            intro = null;
        }
        else if (items && items.size) {
            intro = (
                <Msg tagName="p" id="pages.assignments.intro"
                    values={{ numAssignments: items.size }}/>
            );
        }
        else {
            intro = (
                <Msg tagName="p" id="pages.assignments.noAssignmentsIntro"/>
            );
        }

        return (
            <div className="AssignmentPage">
                <Msg tagName="h1" id="pages.assignments.h1"/>
                { intro }
                <AssignmentList
                    assignmentList={ this.props.assignmentList }
                    onSelect={ this.onSelect.bind(this) }/>
            </div>
        );
    }

    onSelect(assignmentItem) {
        console.log('SELECT', assignmentItem);
    }
}
