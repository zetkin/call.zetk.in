import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, FormattedRelative } from 'react-intl';
import querystring from 'querystring';

import PaneBase from './PaneBase';
import { setLaneInfoMode } from '../../actions/lane';
import { selectedAssignment } from '../../store/assignments';
import Avatar from '../misc/Avatar';
import TagList from '../misc/TagList';
import CallLog from '../misc/callLog/CallLog';

const ADDR_FIELDS = [ 'co_address', 'street_address', 'zip_code', 'city' ];

const mapStateToProps = state => ({
    assignment: selectedAssignment(state),
});

@connect(mapStateToProps)
export default class TargetPane extends PaneBase {
    renderContent() {
        let target = this.props.call.get('target');

        const addrFields = ADDR_FIELDS.filter(field => target.get(field)).map(field => 
            <span key={ field }>
                { target.get(field) }
            </span>
        );

         let info = [
            <li key="id" className="TargetPane-infoId">
                { target.get('ext_id') || '-' }</li>,
            <li key="email" className="TargetPane-infoEmail">
                { target.get('email') }</li>,
            <li key="address" className="TargetPane-infoAddress">
                { addrFields }
            </li>,
        ];


        if(target.has('person_fields')) {
            const customFields = target.get('person_fields')
                .map(field => 
                    <li className="TargetPane-personField" key={field}>
                        <span className="TargetPane-personFieldLabel">{ field.get('title')}</span>
                        <span className="TargetPane-personFieldValue">{ field.get('value') }</span>
                    </li>
                ).toArray();

            info = info.concat(customFields);
        }

        let map = null;
        if (target.get('zip_code') && target.get('city')) {
            let location = target.get('zip_code') + '+' + target.get('city')
            if(target.has('street_address')) {
                location = target.get('street_address') + '+' + location
            }
            let qs = querystring.stringify({
                center: location,
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

        let activityClasses = cx('TargetPane-activity', {
            empty: !lastAction,
        });

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
            <div key="edit" className="TargetPane-edit">
                <Msg tagName="h4" id="panes.target.editHeader"/>
                <Msg tagName="p" id="panes.target.editInfo"/>
            </div>,
            <div key="tags" className="TargetPane-tags">
                <Msg tagName="h4" id="panes.target.tagHeader"/>
                <TagList tags={ target.get('tags') }/>
            </div>,
            <div key="activity" className={ activityClasses }>
                <Msg tagName="h4" id="panes.target.activityHeader"/>
                <Msg tagName="p" id="panes.target.activityLabel"
                    values={ activityValues }/>
            </div>,
            <div key="callLog" className="TargetPane-callLog">
                <Msg tagName="h4" id="panes.target.callLogHeader"
                    values={{ target: target.get('first_name') }}/>
                <CallLog calls={ target.get('call_log') }/>
            </div>
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
            return (
                <Msg tagName="p" id="panes.target.h1"/>
            );
        }
    }

    onClickInstructions() {
        this.props.dispatch(setLaneInfoMode('instructions'));
    }
}
