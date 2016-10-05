import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';

import PropTypes from '../../utils/PropTypes';


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
                <ul className="TargetInfo-tagList">
                    <li className="TargetInfo-tag">These</li>
                    <li className="TargetInfo-tag">are</li>
                    <li className="TargetInfo-tag">some</li>
                    <li className="TargetInfo-tag">mighty</li>
                    <li className="TargetInfo-tag">fake</li>
                    <li className="TargetInfo-tag">tags</li>
                    <li className="TargetInfo-moreTags">+2 tags</li>
                </ul>
            );
        }

        let classes = cx('TargetInfo', {
            'TargetInfo-showFull': this.props.showFullInfo,
        });

        return (
            <CSSTransitionGroup
                transitionEnterTimeout={ 1500 }
                transitionLeaveTimeout={ 1500 }
                transitionName="TargetInfo"
                component="div" className={ classes }>

                <h1 className="TargetInfo-name">{ target.get('name') }</h1>
                { callInfo }
                { tagList }
            </CSSTransitionGroup>
        );
    }
};
