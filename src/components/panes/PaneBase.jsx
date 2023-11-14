import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import PropTypes from '../../utils/PropTypes';
import { componentClassNames } from '..';


export default class PaneBase extends React.Component {
    static propTypes = {
        firstCall: PropTypes.bool.isRequired,
        step: PropTypes.string.isRequired,
        call: PropTypes.map,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.call && this.props.call
            && prevProps.call.get('id') != this.props.call.get('id')) {
            // The call was switched, so scroll should be reset
            let node = ReactDOM.findDOMNode(this);
            node.scrollTop = 0;
        }
    }

    render() {
        let step = this.props.step;
        let classNames = [];

        componentClassNames(this).forEach(className => {
            classNames.push(className);
            classNames.push(className + '-' + step + 'Step');
            if (this.props.firstCall) {
                classNames.push(className + '-firstCall');
            }
        });

        let classes = cx(classNames, this.props.className);

        let header = this.renderHeader();
        if (header) {
            header = (
                <div ref="header" className="PaneBase-header">
                    { header }
                </div>
            );
        }

        return (
            <section className={ classes } ref="pane">
                { header }
                <div ref="content" className="PaneBase-content">
                    { this.renderContent() }
                </div>
            </section>
        );
    }

    // Updates the pane's inert status
    //
    // Ideally this would be handled in render() but this old version of React
    // doesn't recognize it as a valid HTML attribute and thus prevents us from
    // updating it declaratively. This setter provides an imperative workaround
    // so that we can make use of the attribute anyway.
    setInert(inert) {
        let pane = ReactDOM.findDOMNode(this.refs.pane);
        if (inert) {
            pane.setAttribute('inert', '');
        } else {
            pane.removeAttribute('inert');
        }
    }

    renderHeader() {
        return null;
    }

    renderContent() {
        return null;
    }
}
