import React from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';
import { FormattedMessage as Msg, FormattedRelative } from 'react-intl';

import PropTypes from '../../utils/PropTypes';
import * as targetUtils from "../../utils/target";
import { selectedAssignment } from '../../store/assignments';
import Avatar from '../misc/Avatar';
import TagList from '../misc/TagList';
import { selectedAssignmentCallerProfile } from '../../store/user';

const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
    caller: selectedAssignmentCallerProfile(state),
});

@connect(mapStateToProps)
export default class TargetInfo extends React.Component {
    static propTypes = {
        caller: PropTypes.map.isRequired,
        target: PropTypes.map.isRequired,
        showFullInfo: PropTypes.bool,
    };

    render() {
        const { caller, target } = this.props;
        let callInfo, tagList;

        if (this.props.showFullInfo) {
            let lastCall = target.get('call_log').first();
            let lastCallLabel = null;

            if (lastCall) {
                let lastCallDate = (
                    <FormattedRelative
                        updateInterval={ 0 }
                        value={ new Date(lastCall.get('allocation_time')) }
                        />
                );

                if (lastCall.get('state') === 1) {
                    lastCallLabel = (
                        <Msg id="controlBar.targetInfo.lastSuccessful"
                            values={{ date: lastCallDate }}/>
                    );
                }
                else {
                    lastCallLabel = (
                        <Msg id="controlBar.targetInfo.lastFailure"
                            values={{ date: lastCallDate }}/>
                    );
                }
            }
            else {
                lastCallLabel = (
                    <Msg id="controlBar.targetInfo.lastNever"/>
                );
            }

            callInfo = targetUtils.getNumbers(target).map(num => {
                let onClick = null;
                let callWidget = '';
                if (caller && caller.get('has_voip_credentials')) {
                    onClick = ev => {
                        ev.preventDefault();
                        fetch('/api/dial', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                number: num,
                                caller: caller.get('id'),
                                org: this.props.assignment.get('organization_id'),
                            }),
                        });
                        return false;
                    };
                } else if (process.env.VOIP_EMBED_URL) {
                    const voipURL = process.env.VOIP_EMBED_URL + '#' + new URLSearchParams({
                        assignment: this.props.assignment.get('id'),
                        caller: caller.get('id'),
                        org: this.props.assignment.get('organization_id'),
                        tel: num
                    }).toString();
                    onClick = ev => {
                        ev.preventDefault();
                        let voip = document.querySelector('iframe#voip')
                        if(voip) {
                            voip.src = voipURL + '&call=1';
                        }
                        return false;
                    }
                    callWidget = (
                        <iframe id="voip" style={{
                                border: "0",
                                width: "240px",
                                height: "27px"
                            }} src={voipURL} allow="microphone"></iframe>
                    );
                }

                return (
                    <span key={num} className="TargetInfo-number">
                        <a href={ 'tel:' + num } onClick={onClick}>{ num }</a>
                        {callWidget}
                    </span>
                );
            }).concat([
                <div key="lastCall" className="TargetInfo-lastCall">
                    { lastCallLabel }
                </div>
            ]);

            tagList = (
                <TagList tags={ target.get('tags') }/>
            );
        }

        let classes = cx('TargetInfo', {
            'TargetInfo-showFull': this.props.showFullInfo,
        });

        return (
            <CSSTransitionGroup
                transitionAppear={ true }
                transitionAppearTimeout={ 1500 }
                transitionEnterTimeout={ 1500 }
                transitionLeaveTimeout={ 1500 }
                transitionName="TargetInfo"
                component="div" className={ classes }>
                <Avatar key="avatar"
                    personId={ target.get('id') }
                    orgId={ this.props.assignment.get('organization_id') }
                    mask={ true }/>
                <h1 className="TargetInfo-name">{ target.get('name') }</h1>
                { callInfo }
                { tagList }
            </CSSTransitionGroup>
        );
    }
};
