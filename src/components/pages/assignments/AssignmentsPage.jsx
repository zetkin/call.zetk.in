import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import { withRouter } from 'react-router';

import PageBase from '../PageBase';
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
export default class AssignmentsPage extends PageBase {
    componentDidMount() {
        this.props.dispatch(retrieveUserAssignments());
    }

    renderContent() {
        let intro;
        let assignmentList = this.props.assignmentList;
        let items = assignmentList.get('items');

        if (assignmentList.get('isPending')) {
            intro = (
                <Msg key="p" tagName="p"
                    id="pages.assignments.isPendingIntro"/>
            );
        }
        else if (items && items.size) {
            intro = (
                <Msg key="p" tagName="p"
                    id="pages.assignments.intro"
                    values={{ numAssignments: items.size }}/>
            );
        }
        else {
            intro = (
                <Msg key="p" tagName="p"
                    id="pages.assignments.noAssignmentsIntro"/>
            );
        }

        return [
            <Msg key="h1" tagName="h1" id="pages.assignments.h1"/>,
            intro,
            <AssignmentList key="assignmentList"
                assignmentList={ this.props.assignmentList }
                onSelect={ this.onSelect.bind(this) }/>,
        ];
    }

    onSelect(assignment) {
        this.props.dispatch(selectAssignment(assignment.get('id')));

        let path = '/assignments/' + assignment.get('id') + '/call';
        this.props.router.push(path);
    }
}
