import React from 'react';
import cx from 'classnames';

import { componentClassNames } from '..';


export default class PaneBase extends React.Component {
    static propTypes = {
        firstCall: React.PropTypes.bool.isRequired,
        step: React.PropTypes.string.isRequired,
    };

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
