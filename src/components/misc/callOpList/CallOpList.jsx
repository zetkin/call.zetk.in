import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import Button from '../../../common/misc/Button';
import CallOpListItem from './CallOpListItem';
import PropTypes from '../../../utils/PropTypes';


export default class CallOpList extends React.Component {
    static propTypes = {
        calls: PropTypes.list.isRequired,
        ops: PropTypes.any.isRequired,
        opMessagePrefix: PropTypes.string.isRequired,
        onCallOperation: PropTypes.func,
    };

    render() {
        let items = this.props.calls.map(call => {
            let ops = this.props.ops;
            let opClickHandlers;

            if (typeof ops === 'function') {
                ops = ops(call) || [];
            }

            if (typeof ops === 'object' && !Array.isArray(ops)) {
                opClickHandlers = ops;
                ops = Object.keys(ops);
            }

            return (
                <li key={ call.get('id') }>
                    <CallOpListItem call={ call }>
                    { ops.map(op => {
                        let msgId = this.props.opMessagePrefix + '.' + op;
                        let msgValues = {
                            target: call.getIn(['target', 'first_name']),
                        };

                        // Use global click handler by default, or if ops was
                        // a handler map, get handler for this operation.
                        let onClick = opClickHandlers?
                            () => opClickHandlers[op](call, op) :
                            this.onOpClick.bind(this, call, op);

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
            );
        });

        return (
            <div className="CallOpList">
                <CSSTransitionGroup
                    transitionEnterTimeout={ 300 }
                    transitionLeaveTimeout={ 300 }
                    transitionName="CallOpList-item"
                    component="ul" className="CallOpList-list">

                { items }
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
