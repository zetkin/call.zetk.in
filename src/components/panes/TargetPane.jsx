import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, FormattedRelative } from 'react-intl';
import querystring from 'querystring';

import PaneBase from './PaneBase';
import { setLaneInfoMode } from '../../actions/lane';
import { selectedAssignment } from '../../store/assignments';
import Avatar from '../misc/Avatar';
import TagList from '../misc/TagList';
import CallLog from '../call/CallLog';


const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class TargetPane extends PaneBase {
    renderContent() {
        let target = this.props.call.get('target');

        let info = [
            <li key="email" className="TargetPane-infoEmail">
                { target.get('email') }</li>
        ];

        let map = null;
        if (target.get('zip_code') && target.get('city')) {
            let qs = querystring.stringify({
                center: target.get('zip_code') + '+' + target.get('city'),
                maptype: 'roadmap',
                size: '650x200',
                zoom: 15,
                key: 'AIzaSyAHVagqI3RTd0psf57oA6gzKqVyjp8FS8w',
            });

            let src = 'https://maps.googleapis.com/maps/api/staticmap?' + qs;

            map = (
                <img key="map" className="TargetPane-map" src={ src }/>
            );
        }

        let activityValues = {
            target: target.get('first_name'),
            count: target.getIn(['past_actions', 'num_actions']),
        };

        let lastAction = target.getIn(['past_actions', 'last_action']);
        if (lastAction) {
            let lastActionValues = {
                activity: lastAction.getIn(['activity', 'title']),
                location: lastAction.getIn(['location', 'title']),
                date: (
                    <FormattedRelative
                        value={ new Date(lastAction.get('start_time')) }
                        updateInterval={ 0 }
                        />
                )
            };

            activityValues.lastAction = (
                <Msg tagName="em" id="panes.target.activityLastAction"
                    values={ lastActionValues }/>
            );
        }

        return [
            <div key="basics" className="TargetPane-basics">
                <Avatar personId={ target.get('id') }
                    orgId={ this.props.assignment.get('organization_id') }
                    mask={ true } />
                <h1 className="TargetPane-name">
                    { target.get('name') }</h1>
                <ul className="TargetPane-info">
                    { info }</ul>
            </div>,
            map,
            <h4 key="tagHeader" className="TargetPane-tagHeader">
                <Msg id="panes.target.tagHeader"/></h4>,
            <TagList key="tagList"
                tags={ target.get('tags') }/>,
            <h4 key="activityHeader" className="TargetPane-activityHeader">
                <Msg id="panes.target.activityHeader"/>
            </h4>,
            <Msg key="activityLabel" id="panes.target.activityLabel"
                values={ activityValues }/>,
            <h4 key="callLogHeader" className="TargetPane-callLogHeader">
                <Msg id="panes.target.callLogHeader"
                    values={{ target: target.get('first_name') }}/>
            </h4>,
            <CallLog key="callLog"
                calls={ target.get('call_log') }/>
        ];
    }

    renderHeader() {
        let step = this.props.step;

        if (step === 'call' || step === 'report') {
            return (
                <button className="TargetPane-instructionsButton"
                    onClick={ this.onClickInstructions.bind(this) }>
                    <Msg id="panes.target.instructionsButton"/>
                </button>
            );
        }
        else {
            return null;
        }
    }

    onClickInstructions() {
        this.props.dispatch(setLaneInfoMode('instructions'));
    }
}
