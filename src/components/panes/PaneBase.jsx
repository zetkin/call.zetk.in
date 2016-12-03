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

        let classes = cx(classNames);

        let header = this.renderHeader();
        if (header) {
            header = (
                <div className="PaneBase-header">
                    { header }
                </div>
            );
        }

        return (
            <section className={ classes }>
                { header }
                <div className="PaneBase-content">
                    { this.renderContent() }
                </div>
            </section>
        );
    }

    renderHeader() {
        return null;
    }

    renderContent() {
        return null;
    }
}
