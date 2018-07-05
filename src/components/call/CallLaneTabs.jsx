import React from 'react';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../utils/PropTypes';

const instructionsTab = {
    title: 'instructions',
    icon: 'info'
}
const targetTab = {
    title: 'target',
    icon: 'user'
}
const inputTab = {
    title: 'input',
    icon: 'list'
}
const reportTab = {
    title: 'report',
    icon: 'pencil-square-o'
}
const statsTab = {
    title: 'stats',
    icon: 'line-chart'
}

const stepTabs = {
    prepare: [instructionsTab, targetTab, inputTab],
    call: [instructionsTab, targetTab, inputTab],
    report: [instructionsTab, targetTab, inputTab, reportTab],
    done: [reportTab, statsTab],
}

export default class CallLaneTabs extends React.Component {
    static propTypes = {
        activePane: PropTypes.number,
        setActivePane: PropTypes.func,
        step: PropTypes.string,
    };

    render() {
        if (stepTabs[this.props.step]) {
            return (
                <nav className="CallLaneTabs">
                {stepTabs[this.props.step].map((tab, i) => {
                    const tabClassName = cx(
                        'CallLaneTabs-tab',
                        'CallLaneTabs-' + tab.title,
                        {'CallLaneTabs-tabActive': i === this.props.activePane}
                    )
                    return (
                        <div
                            className={tabClassName}
                            onClick={this.props.setActivePane.bind(this, i)}
                            key={i}>
                            <span className={"CallLaneTabs-icon fa fa-" + tab.icon} />
                            <span className="CallLaneTabs-title"><Msg id={"pages.call.tabs." + tab.title}/></span>
                        </div>
                    )
                })}
                </nav>
            )
        }
        return null;
    }
}