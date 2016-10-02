import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import { withRouter } from 'react-router';

import AssignmentList from './AssignmentList';
import {
    retrieveUserAssignments,
    selectAssignment,
} from '../../../actions/assignment';


const mapStateToProps = (state) => ({
    assignmentList: state.getIn(['assignments', 'assignmentList']),
});

@withRouter
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

    onSelect(assignment) {
        this.props.dispatch(selectAssignment(assignment));

        let path = '/assignments/' + assignment.get('id') + '/call';
        this.props.router.push(path);
    }
}
