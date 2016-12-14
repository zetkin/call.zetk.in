import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import TutorialNote from './TutorialNote';


const PADDING = 10;

const mapStateToProps = state => ({
    noteQueue: state.getIn(['tutorial', 'noteQueue']),
});

@connect(mapStateToProps)
export default class Tutorial extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            noteX: 0,
            noteY: 0,
        };
    }

    componentWillUpdate(nextProps, nextState) {
        this.targetElem = null;
        if (nextProps.noteQueue.size) {
            let note = nextProps.noteQueue.get(0);
            if (note.get('domElementSelector')) {
                this.targetElem = document.querySelector(note.get('domElementSelector'));
            }
        }
    }

    componentDidMount() {
        this.onWindowResizeBound = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResizeBound);
    }

    componentDidUpdate() {
        this.onWindowResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResizeBound);
    }

    render() {
        let noteQueue = this.props.noteQueue;
        if (noteQueue.size) {
            let note = noteQueue.get(0);
            let key = note.getIn(['messages', 'header']);

            let ww = window.innerWidth;
            let wh = window.innerHeight;

            let shape = 'M 0 0 h' + ww + ' v' + wh + ' h-' + ww + 'z';

            if (this.targetElem) {
                const p = PADDING;

                let rect = this.targetElem.getBoundingClientRect();
                shape += ' M' + (rect.left - p) + ' ' + (rect.top - p)
                    + ' v' + (rect.height + 2*p) + ' h' + (rect.width + 2*p)
                    + ' v-' + (rect.height + 2*p) + 'z';
            }

            return (
                <div className="Tutorial">
                    <svg className="Tutorial-background"
                        width={ ww } height={ wh }>
                        <g fillRule="evenodd" fill="white">
                            <path d={ shape }/>
                        </g>
                    </svg>
                    <TutorialNote key={ key } ref="note"
                        x={ this.state.noteX } y={ this.state.noteY }
                        messages={ note.get('messages') }
                        />
                </div>
            );
        }
        else {
            return null;
        }
    }

    onWindowResize() {
        let note = ReactDOM.findDOMNode(this.refs.note);
        if (note) {
            let noteRect = note.getBoundingClientRect();
            let x = window.innerWidth/2 - noteRect.width/2;
            let y = window.innerHeight/2 - noteRect.height/2;

            if (this.targetElem) {
                let targetRect = this.targetElem.getBoundingClientRect();

                // Try left-aligned, below
                x = targetRect.left - PADDING;
                y = targetRect.bottom + 2 * PADDING;

                // Too low? Move above instead
                if (y + noteRect.height > window.innerHeight) {
                    y = targetRect.top - noteRect.height - 2 * PADDING;
                }

                // Too far right? Align right instead
                if (x + noteRect.width > window.innerWidth) {
                    x = (targetRect.right - noteRect.width) + PADDING;
                }
            }

            if (x !== this.state.noteX || y !== this.state.noteY) {
                this.setState({
                    noteX: x,
                    noteY: y,
                });
            }
        }
    }
}
