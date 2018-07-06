import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { FormattedMessage as Msg } from 'react-intl';

import { setLaneStep } from '../../actions/lane';

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

class CallLaneTabs extends React.Component {
    static propTypes = {
        activePane: PropTypes.number,
        call: PropTypes.map,
        lane: PropTypes.map,
        setActivePane: PropTypes.func,
    };

    handleClick(i) {
        const {activePane, dispatch, setActivePane, lane} = this.props;
        if (i != activePane) {
            if (lane.get("step") === "report") {
                dispatch(setLaneStep(lane, 'call'));
            }
            setActivePane(i);
        }
    }

    render() {
        const {lane, call} = this.props;
        const step = lane.get("step");
        const target = call.get("target");
        const targetValues = {
            target: `${target.get("first_name")} ${target.get("last_name")}`
        }

        if (stepTabs[step]) {
            return (
                <nav className="CallLaneTabs">
                {stepTabs[step].map((tab, i) => {
                    const tabClassName = cx(
                        'CallLaneTabs-tab',
                        'CallLaneTabs-' + tab.title,
                        {'CallLaneTabs-tabActive': i === this.props.activePane}
                    )
                    return (
                        <div
                            className={tabClassName}
                            onClick={this.handleClick.bind(this, i)}
                            key={i}>
                            <span className={"CallLaneTabs-icon fa fa-" + tab.icon} />
                            <span className="CallLaneTabs-title"><Msg id={"pages.call.tabs." + tab.title} values={targetValues}/></span>
                        </div>
                    )
                })}
                </nav>
            )
        }
        return null;
    }
}

export default connect()(CallLaneTabs);