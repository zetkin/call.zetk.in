import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import PropTypes from '../../utils/PropTypes';
import { selectedAssignment } from '../../store/assignments';
import { setLaneStep } from '../../actions/lane';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class LaneControlBar extends React.Component {
    static propTypes = {
        lane: PropTypes.map.isRequired,
        assignment: PropTypes.map.isRequired,
    };

    render() {
        let content;
        let lane = this.props.lane;
        let step = lane.get('step');

        if (step === 'assignment') {
            let assignment = this.props.assignment;
            content = <h1>{ assignment.get('title') }</h1>
        }
        else {
            content = <h1>Unknown step</h1>;
        }

        let classes = cx('LaneControlBar', 'LaneControlBar-' + step + 'Step');

        return (
            <div className={ classes }>
                { content }
                <button onClick={ this.onClickNext.bind(this) }>Next</button>
            </div>
        );
    }

    onClickNext() {
        // TODO: This is a placeholder. Don't use a generic next function.
        let lane = this.props.lane;
        let steps = [ 'assignment', 'prepare', 'call', 'report', 'done' ];
        let idx = steps.indexOf(lane.get('step')) + 1;

        if (idx >= steps.length) {
            idx = 1;
        }

        this.props.dispatch(setLaneStep(lane, steps[idx]));
    }
}
