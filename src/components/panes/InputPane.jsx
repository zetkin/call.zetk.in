import React from 'react';
import immutable from 'immutable';
import { connect } from 'react-redux';
import { FormattedDate, FormattedMessage as Msg } from 'react-intl';

import Button from '../../common/misc/Button';
import CampaignForm from '../../common/campaignForm/CampaignForm';
import FormattedLink from '../../common/misc/FormattedLink';
import LoadingIndicator from '../../common/misc/LoadingIndicator';
import PaneBase from './PaneBase';
import SurveyForm from './../../common/surveyForm/SurveyForm';
import { campaignById } from '../../store/campaigns';
import { retrieveActions, updateActionResponse } from '../../actions/action';
import { retrieveCampaign } from '../../actions/campaign';
import {
    retrieveSurvey,
    retrieveSurveys,
    storeSurveyResponse,
} from '../../actions/survey';


const mapStateToProps = state => ({
    actions: state.get('actions'),
    campaigns: state.get('campaigns'),
    surveys: state.get('surveys'),
});

@connect(mapStateToProps)
export default class InputPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'summary',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.step === 'report' || nextProps.step === 'prepare') {
            // Go back to summary mode when reporting and when navigating
            // back to prepare step (e.g. after a skip).
            this.setState({
                viewMode: 'summary',
            });
        }
    }

    componentDidMount() {
        this.props.dispatch(retrieveActions());
        this.props.dispatch(retrieveSurveys());
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.viewMode == 'campaign') {
            if (this.state.viewMode != 'campaign' || this.state.selectedId != nextState.selectedId) {
                let orgId = nextProps.campaigns.getIn(
                    ['campaignList', 'items', nextState.selectedId, 'org_id']);

                this.props.dispatch(retrieveCampaign(orgId, nextState.selectedId));
            }
        }
        else if (nextState.viewMode == 'survey') {
            if (this.state.viewMode != 'survey' || this.state.selectedId != nextState.selectedId) {
                let orgId = nextProps.surveys.getIn(
                    ['surveyList', 'items', nextState.selectedId, 'org_id']);

                this.props.dispatch(retrieveSurvey(orgId, nextState.selectedId));
            }
        }
    }

    renderContent() {
        let target = this.props.call.get('target');
        let content = null;

        if (this.state.viewMode == 'summary') {
            let campaignStore = this.props.campaigns;
            let surveyStore = this.props.surveys;
            let campaignContent = null;
            let surveyContent = null;

            if (campaignStore.getIn(['campaignList', 'isPending'])) {
                campaignContent = <LoadingIndicator/>;
            }
            else {
                let listItems = campaignStore.getIn(['campaignList', 'items']);

                if (listItems) {
                    campaignContent = (
                        <ul className="InputPane-summaryList">
                        { listItems.toList().map(campaign => {
                            let id = campaign.get('id');
                            let userActions = target.get('future_actions')
                                .filter(a => a.getIn(['campaign', 'id']) == id);

                            let targetActions = this.props.actions
                                .getIn(['byTarget', target.get('id').toString()]);

                            let userResponses = immutable.List();

                            if (targetActions) {
                                userResponses = targetActions
                                    .getIn(['responseList', 'items'])
                                    .filter(r => {
                                        let actionId = r.get('action_id').toString();
                                        let action = this.props.actions
                                            .getIn(['actionList', 'items', actionId]);

                                        return action.getIn(['campaign', 'id']) == id;
                                    });
                            }

                            let campaignActions = this.props.actions
                                .getIn(['actionList', 'items'])
                                .filter(a => a.getIn(['campaign', 'id']) == id);

                            let active = (this.props.step === "call")
                                ? true : false;

                            return (
                                <CampaignListItem key={ campaign.get('id') }
                                    actions={ campaignActions }
                                    userActions={ userActions }
                                    userResponses={ userResponses }
                                    target={ target }
                                    campaign={ campaign }
                                    isActive={ active }
                                    onSelect={ this.onCampaignSelect.bind(this) }/>
                            );
                        }) }
                        </ul>
                    );
                }
                else {
                    campaignContent = null;
                }
            }

            if (surveyStore.getIn(['surveyList', 'isPending'])) {
                surveyContent = <LoadingIndicator/>;
            }
            else {
                let listItems = surveyStore.getIn(['surveyList', 'items']);

                if (listItems) {
                    surveyContent = (
                        <ul className="InputPane-summaryList">
                        { listItems.toList().map(survey => {
                            let id = survey.get('id');

                            let active = (this.props.step === "call")
                                ? true : false;

                            return (
                                <SurveyListItem key={ id }
                                    isActive={ active }
                                    survey={ survey }
                                    onSelect={ this.onSurveySelect.bind(this) }
                                    />
                            );
                        }) }
                        </ul>
                    );
                }
            }

            content = (
                <div key="content" className="InputPane-summary">
                    <section className="InputPane-campaigns">
                        <Msg tagName="h2" id="panes.input.summary.campaigns.h2"/>
                        { campaignContent }
                        <Msg tagName="h2" id="panes.input.summary.surveys.h2"/>
                        { surveyContent }
                    </section>
                </div>
            );
        }
        else {
            let selectValue = this.state.viewMode + ':' + this.state.selectedId;

            content = [];

            if (this.state.viewMode == 'campaign') {
                let actionStore = this.props.actions;
                let targetId = target.get('id').toString();
                let targetActions = actionStore.getIn(['byTarget', targetId]);
                let responseList = targetActions.get('responseList');
                let userActionList = targetActions.get('userActionList');

                let campaign = this.props.campaigns
                    .getIn(['campaignList', 'items', this.state.selectedId.toString()]);

                // Filter list to only contain actions from the selected campaign
                let actionList = this.props.actions.get('actionList')
                    .updateIn(['items'], items => items
                        .filter(item =>
                            item.getIn(['campaign', 'id']) == campaign.get('id')));

                let scrollContainer = document
                    .querySelector('.InputPane .PaneBase-content');

                content.push(
                    <div key="campaignInfo" className="InputPane-campaignInfo">
                        <h2 key="h2">{ campaign.get('title') }</h2>
                        <p key="intro">
                            { campaign.get('info_text') }
                        </p>
                    </div>,
                    <CampaignForm key="campaignForm"
                        actionList={ actionList }
                        responseList={ responseList }
                        userActionList={ userActionList }
                        scrollContainer={ scrollContainer}
                        scrollOffset={ -160 }
                        onResponse={ this.onCampaignResponse.bind(this) }/>
                );
            }
            else if (this.state.viewMode == 'survey') {
                let survey = this.props.surveys.getIn(
                    ['surveyList', 'items', this.state.selectedId]);

                let surveyForm = null;
                if (survey.get('elements')) {
                    surveyForm = (
                        <SurveyForm key="surveyForm"
                            survey={ survey }
                            submitEnabled={ false }
                            onResponse={ this.onSurveyResponse.bind(this, survey) }/>
                    );
                }

                content.push(
                    <div key="surveyInfo" className="InputPane-surveyInfo">
                        <h2 key="h2">{ survey.get('title') }</h2>
                        <p key="intro">
                            { survey.get('info_text') }
                        </p>
                    </div>,
                    surveyForm
                );
            }
        }

        return content;
    }

    renderHeader() {
        let target = this.props.call.get('target');
        let step = this.props.step;
        let selectValue = this.state.viewMode + ':' + this.state.selectedId;

        if (this.state.viewMode != 'summary') {
            let campaignStore = this.props.campaigns;
            let campaignItems = campaignStore.getIn(['campaignList', 'items']);
            let campaignOptions = campaignItems.toList().map(campaign => {
                let value = 'campaign:' + campaign.get('id');

                return (
                    <option key={ value } value={ value }>
                        { campaign.get('title') }
                    </option>
                );
            });

            let surveyStore = this.props.surveys;
            let surveyItems = surveyStore.getIn(['surveyList', 'items']);
            let surveyOptions = surveyItems.toList().map(survey => {
                let value = 'survey:' + survey.get('id');

                return (
                    <option key={ value } value={ value }>
                        { survey.get('title') }
                    </option>
                );
            });

            return (
                <div key="nav" className="InputPane-nav">
                    <FormattedLink className="InputPane-summaryLink"
                        msgId="panes.input.summaryLink"
                        onClick={ this.onSummaryLinkClick.bind(this) }/>
                    <Msg key="p" tagName="p"
                        id="panes.input.h1"
                        values={{ target: target.get('name') }}/>
                    <select value={ selectValue }
                        onChange={ this.onSelectChange.bind(this) }>
                        { campaignOptions }
                        { surveyOptions }
                    </select>
                </div>
            );
        }
        else {
            let step = this.props.step;

            if (step === 'call') {
                return (
                    <Msg key="p" tagName="p"
                        id="panes.input.h1"
                        values={{ target: target.get('name') }}/>
                );
            }
            else {
                return (
                    <Msg tagName="p" id="panes.input.summaryLabel"/>
                );
            }
        }
    }

    onCampaignSelect(id) {
        this.setState({
            viewMode: 'campaign',
            selectedId: id,
        });
    }

    onSurveySelect(id) {
        this.setState({
            viewMode: 'survey',
            selectedId: id.toString(),
        });
    }

    onCampaignResponse(action, checked) {
        this.props.dispatch(updateActionResponse(action, checked));
    }

    onSurveyResponse(survey, elemId, response) {
        this.props.dispatch(
            storeSurveyResponse(survey.get('id'), elemId, response))
    }

    onRespondClick(type, id) {
        this.setState({
            viewMode: type,
            selectedId: id,
        });
    }

    onSummaryLinkClick(ev) {
        this.setState({
            viewMode: 'summary',
            selectedId: null,
        });
    }

    onSelectChange(ev) {
        let val = ev.target.value;
        let fields = val.split(':');

        this.setState({
            viewMode: fields[0],
            selectedId: fields[1],
        });
    }
}

const CampaignListItem = props => {
    let id = props.campaign.get('id');
    let title = props.campaign.get('title');
    let target = props.target.get('first_name');
    let numBookings = props.userActions.size;
    let numResponses = props.userResponses.size;

    let numActions = props.actions.size;
    let startDate = props.actions
        .sortBy(a => a.get('start_time'))
        .first()
        .get('start_time');

    let endDate = props.actions
        .sortBy(a => a.get('end_time'))
        .last()
        .get('end_time');

    let clickTarget =() => (props.isActive)
        ? props.onSelect(id)
        : null;

    return (
        <li onClick={ clickTarget }>
            <h3>{ title }</h3>
            <p className="InputPane-campaignListInfo">
                <FormattedDate value={ startDate }
                    day="numeric"
                    month="numeric"
                    />
                {" – "}
                <FormattedDate value={ endDate }
                    day="numeric"
                    month="numeric"
                    />
                <Msg id="panes.input.summary.campaigns.actions"
                    values={{count: numActions}} />

            </p>
            <p className="InputPane-campaignListStatus">
                <Msg id="panes.input.summary.campaigns.status"
                    values={{ target }}/>
                <Msg id="panes.input.summary.campaigns.bookings"
                    values={{ numBookings }}/>
                <Msg id="panes.input.summary.campaigns.responses"
                    values={{ numResponses }}/>
            </p>
            <FormattedLink key="CampaignListItemLink"
                className="InputPane-campaignListLink"
                msgId="panes.input.summary.campaigns.respondButton"
                msgValues={{ campaign: title }} />
        </li>
    );
};

const SurveyListItem = props => {
    let id = props.survey.get('id');
    let title = props.survey.get('title');

    let clickTarget =() => (props.isActive)
        ? props.onSelect(id)
        : null;

    return (
        <li onClick={ clickTarget }>
            <h3>{ title }</h3>
        </li>
    );
};
