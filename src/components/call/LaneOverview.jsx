import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../misc/LoadingIndicator';
import { retrieveUserCalls } from '../../actions/call';


const mapStateToProps = state => ({
    callList: state.getIn(['calls', 'callList']),
});

@connect(mapStateToProps)
export default class LaneOverview extends React.Component {
    componentDidMount() {
        this.props.dispatch(retrieveUserCalls());
    }

    render() {
        let callList = this.props.callList;
        let content = null;

        if (callList.get('isPending')) {
            content = <LoadingIndicator/>;
        }
        else if (callList.get('error')) {
            content = <h1>ERROR</h1>;
        }
        else if (callList.get('items')) {
            content = (
                <ul className="LaneOverview-log">
                { callList.get('items').toList().map(call => (
                    <CallLogItem key={ call.get('id') }
                        onSelect={ this.onStartNewCall.bind(this, call) }
                        call={ call }/>
                )) }
                </ul>
            );
        }
        else {
            content = null;
        }

        return (
            <div className="LaneOverview">
                { content }
            </div>
        );
    }

    onStartNewCall(oldCall) {
        console.log('Re-call', oldCall.get('target').get('name'));
    }
}


const CallLogItem = props => {
    let call = props.call;

    return (
        <li className="LaneOverview-logItem">
            <a onClick={ props.onSelect }>
                { call.getIn(['target', 'name']) }
            </a>
        </li>
    );
};
