import React from 'react';
import cx from 'classnames';

import PropTypes from '../../../utils/PropTypes';
import { componentClassNames } from '../..';


export default class ReportStepBase extends React.Component {
    static propTypes = {
        report: PropTypes.map.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    render() {
        let report = this.props.report;
        let renderMode = this.getRenderMode(report);

        if (renderMode === 'none') {
            return null;
        }
        else {
            let content = null;

            if (renderMode === 'form') {
                content = this.renderForm(report);
            }
            else if (renderMode === 'summary') {
                content = this.renderSummary(report);
            }

            let classNames = [];
            componentClassNames(this).forEach(className => {
                classNames.push(className);
                classNames.push(className + '-' + renderMode + 'Mode');
            });

            return (
                <div className={ cx(classNames) }>
                    { content }
                </div>
            );
        }
    }

    getRenderMode(report) {
        // To be overridden by subclasses. Should return one of the modes:
        // * form - to render as a form
        // * summary - to render brief summary
        // * none - to not render at all
        return 'none';
    }
}
