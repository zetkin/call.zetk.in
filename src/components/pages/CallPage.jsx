import React from 'react';
import { connect } from 'react-redux';

import CallLane from '../call/CallLane';
import { selectedLane } from '../../store/lanes';


const mapStateToProps = state => ({
    lane: selectedLane(state),
});

@connect(mapStateToProps)
export default class CallPage extends React.Component {
    render() {
        return (
            <div className="CallPage">
                <CallLane lane={ this.props.lane }/>
            </div>
        );
    }
}
