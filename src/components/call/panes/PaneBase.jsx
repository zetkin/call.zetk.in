import React from 'react';
import cx from 'classnames';

import { componentClassNames } from '../..';


export default class PaneBase extends React.Component {
    static propTypes = {
        step: React.PropTypes.string.isRequired,
    };

    render() {
        let step = this.props.step;
        let classNames = [];

        componentClassNames(this).forEach(className =>
            classNames.push(className, className + '-' + step + 'Step'));

        let classes = cx(classNames);

        return (
            <section className={ classes }>
                { this.renderContent() }
            </section>
        );
    }

    renderContent() {
        return null;
    }
}
