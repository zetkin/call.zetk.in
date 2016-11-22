import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import querystring from 'querystring';

import PaneBase from './PaneBase';
import { currentCall } from '../../store/calls';
import { setLaneInfoMode } from '../../actions/lane';
import { selectedAssignment } from '../../store/assignments';
import Avatar from '../misc/Avatar';
import TagList from '../misc/TagList';
import CallLog from '../call/CallLog';


const mapStateToProps = state => ({
    call: currentCall(state),
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
            <h4 key="tagHeader" className="TargetPane-tagHeader">Taggar</h4>,
            <TagList key="tagList"
                tags={ target.get('tags') }/>,
            <h4 key="callLogHeader" className="TargetPane-callLogHeader">
                Tidigare samtal</h4>,
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
