import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import cx from 'classnames';

import PropTypes from '../../../utils/PropTypes';
import { componentClassNames } from '../..';
import { setCallReportStep } from '../../../actions/call';


export default class ReportStepBase extends React.Component {
    static propTypes = {
        step: PropTypes.string.isRequired,
        report: PropTypes.map.isRequired,
        dispatch: PropTypes.func.isRequired,
        disableEdit: PropTypes.bool,
    };

    render() {
        let report = this.props.report;
        let renderMode = this.getRenderMode(report);

        if (renderMode === 'none') {
            return null;
        }
        else {
            let content = null;
            let editLink = null;

            if (renderMode === 'form') {
                content = this.renderForm(report);
            }
            else if (renderMode === 'summary') {
                content = this.renderSummary(report);

                if (!this.props.disableEdit) {
                    editLink = (
                        <a className="ReportStepBase-editLink"
                            onClick={ this.onClickEdit.bind(this) }>
                            <Msg id="report.edit"/></a>
                    );
                }
            }

            let classNames = [];
            componentClassNames(this).forEach(className => {
                classNames.push(className);
                classNames.push(className + '-' + renderMode + 'Mode');
            });

            return (
                <div className={ cx(classNames) }>
                    { editLink }
                    <div className="ReportStepBase-content">
                        { content }
                    </div>
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

    onClickEdit() {
        this.props.dispatch(setCallReportStep(this.props.step));
    }
}
