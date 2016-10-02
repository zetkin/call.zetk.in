import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../misc/Button';
import LoadingIndicator from '../../misc/LoadingIndicator';
import PropTypes from '../../../utils/PropTypes';


export default class AssignmentList extends React.Component {
    static propTypes = {
        assignmentList: PropTypes.complexList,
        onSelect: PropTypes.func,
    };

    render() {
        let assignmentList = this.props.assignmentList;

        if (assignmentList.get('isPending')) {
            return <LoadingIndicator/>
        }
        else if (assignmentList.get('error')) {
            // TODO: Proper error message
            return <span>ERROR!</span>;
        }
        else if (assignmentList.get('items')) {
            let assignments = assignmentList.get('items');

            return (
                <div className="AssignmentList">
                    <ul>
                    { assignments.toList().map(item => (
                        <AssignmentListItem key={ item.get('id') }
                            onSelect={ this.onSelect.bind(this, item) }
                            assignment={ item }/>
                    ))}
                    </ul>
                </div>
            );
        }
        else {
            return null;
        }
    }

    onSelect(assignmentItem) {
        if (this.props.onSelect) {
            this.props.onSelect(assignmentItem);
        }
    }
}

const AssignmentListItem = props => {
    let assignment = props.assignment;
    let title = assignment.get('title');
    let description = assignment.get('description');
    let href = '/call-assignments/' + assignment.get('id');

    return (
        <li className="AssignmentListItem">
            <h3>{ title }</h3>
            <p>
                { description }
            </p>
            <Button className="AssignmentListItem-selectButton"
                labelMsg="pages.assignments.startCalling"
                onClick={ props.onSelect }/>
        </li>
    );
};
