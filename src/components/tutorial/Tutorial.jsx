import React from 'react';
import { connect } from 'react-redux';

import TutorialNote from './TutorialNote';


const mapStateToProps = state => ({
    noteQueue: state.getIn(['tutorial', 'noteQueue']),
});

@connect(mapStateToProps)
export default class Tutorial extends React.Component {
    render() {
        let noteQueue = this.props.noteQueue;
        if (noteQueue.size) {
            let note = noteQueue.get(0);
            let key = note.getIn(['messages', 'header']);

            return (
                <div className="Tutorial">
                    <TutorialNote key={ key }
                        messages={ note.get('messages') }
                        />
                </div>
            );
        }
        else {
            return null;
        }
    }
}
