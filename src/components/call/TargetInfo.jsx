import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';

import PropTypes from '../../utils/PropTypes';
import { selectedAssignment } from '../../store/assignments';
import Avatar from '../misc/Avatar';
import TagList from '../misc/TagList';

const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class TargetInfo extends React.Component {
    static propTypes = {
        target: PropTypes.map.isRequired,
        showFullInfo: PropTypes.bool,
    };

    render() {
        let target = this.props.target;
        let callInfo, tagList;

        if (this.props.showFullInfo) {
            callInfo = [
                <span key="number" className="TargetInfo-number">
                    { target.get('phone') }
                </span>,
                <span key="lastCall" className="TargetInfo-lastCall">
                    Called successfully 2 months ago
                </span>
            ];

            tagList = (
                <TagList tags={ target.get('tags') }/>
            );
        }

        let classes = cx('TargetInfo', {
            'TargetInfo-showFull': this.props.showFullInfo,
        });

        return (
            <CSSTransitionGroup
                transitionAppear={ true }
                transitionAppearTimeout={ 1500 }
                transitionEnterTimeout={ 1500 }
                transitionLeaveTimeout={ 1500 }
                transitionName="TargetInfo"
                component="div" className={ classes }>
                <Avatar key="avatar"
                    personId={ target.get('id') }
                    orgId={ this.props.assignment.get('organization_id') }
                    mask={ true }/>
                <h1 className="TargetInfo-name">{ target.get('name') }</h1>
                { callInfo }
                { tagList }
            </CSSTransitionGroup>
        );
    }
};
