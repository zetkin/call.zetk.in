import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import Button from '../../../common/misc/Button';
import CallOpListItem from './CallOpListItem';
import PropTypes from '../../../utils/PropTypes';


export default class CallOpList extends React.Component {
    static propTypes = {
        calls: PropTypes.list.isRequired,
        ops: PropTypes.array.isRequired,
        opMessagePrefix: PropTypes.string.isRequired,
        onCallOperation: PropTypes.func,
    };

    render() {
        return (
            <div className="CallOpList">
                <CSSTransitionGroup
                    transitionEnterTimeout={ 300 }
                    transitionLeaveTimeout={ 300 }
                    transitionName="CallOpList-item"
                    component="ul" className="CallOpList-list">

                { this.props.calls.map(call => (
                    <li key={ call.get('id') }>
                        <CallOpListItem call={ call }>
                        { this.props.ops.map(op => {
                            let onClick = this.onOpClick.bind(this, call, op);
                            let msgId = this.props.opMessagePrefix + '.' + op;
                            let msgValues = {
                                target: call.getIn(['target', 'first_name']),
                            };

                            return (
                                <Button key={ op }
                                    labelMsg={ msgId }
                                    labelValues={ msgValues }
                                    onClick={ onClick }
                                    />
                            );
                        }) }
                        </CallOpListItem>
                    </li>
                )) }
                </CSSTransitionGroup>
            </div>
        );
    }

    onOpClick(call, op) {
        if (this.props.onCallOperation) {
            this.props.onCallOperation(call, op);
        }
    }
}
