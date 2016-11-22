import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../common/misc/Button';
import CampaignForm from '../../common/campaignForm/CampaignForm';
import FormattedLink from '../../common/misc/FormattedLink';
import LoadingIndicator from '../../common/misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { campaignById } from '../../store/campaigns';
import { currentCall } from '../../store/calls';
import { retrieveActions, updateActionResponse } from '../../actions/action';
import { retrieveCampaigns } from '../../actions/campaign';


const mapStateToProps = state => ({
    actions: state.get('actions'),
    campaigns: state.get('campaigns'),
    call: currentCall(state),
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
        if (nextProps.step === 'report') {
            // Go back to summary mode when reporting
            this.setState({
                viewMode: 'summary',
            });
        }
    }

    componentDidMount() {
        this.props.dispatch(retrieveActions());
        this.props.dispatch(retrieveCampaigns());
    }

    renderContent() {
        let target = this.props.call.get('target');
        let content = null;

        if (this.state.viewMode == 'summary') {
            let campaignStore = this.props.campaigns;
            let campaignContent = null;

            if (campaignStore.getIn(['campaignList', 'isPending'])) {
                campaignContent = <LoadingIndicator/>;
            }
            else {
                let listItems = campaignStore.getIn(['campaignList', 'items']);

                if (listItems) {
                    campaignContent = (
                        <ul className="InputPane-summaryList">
                        { listItems.toList().map(campaign => (
                            <CampaignListItem key={ campaign.get('id') }
                                campaign={ campaign }
                                onSelect={ this.onCampaignSelect.bind(this) }/>
                        )) }
                        </ul>
                    );
                }
                else {
                    campaignContent = null;
                }
            }

            content = (
                <div key="content" className="InputPane-summary">
                    <section className="InputPane-campaigns">
                        <Msg tagName="h2" id="panes.input.summary.campaigns.h2"/>
                        { campaignContent }
                    </section>
                </div>
            );
        }
        else {
            let selectValue = this.state.viewMode + ':' + this.state.selectedId;

            content = [];

            if (this.state.viewMode == 'campaign') {
                let responseList = this.props.actions.get('responseList');
                let userActionList = this.props.actions.get('userActionList');
                let campaign = this.props.campaigns
                    .getIn(['campaignList', 'items', this.state.selectedId.toString()]);

                // Filter list to only contain actions from the selected campaign
                let actionList = this.props.actions.get('actionList')
                    .updateIn(['items'], items => items
                        .filter(item =>
                            item.getIn(['campaign', 'id']) == campaign.get('id')));

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
                        onResponse={ this.onCampaignResponse.bind(this) }/>
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
                    <p>Sammanfattning</p>
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

    onCampaignResponse(action, checked) {
        this.props.dispatch(updateActionResponse(action, checked));
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

    return (
        <li>
            <h3>{ title }</h3>
            <p>
                TODO: Show status here
            </p>
            <Button labelMsg="panes.input.summary.campaigns.respondButton"
                labelValues={{ campaign: title }}
                onClick={ () => props.onSelect(id) }/>
        </li>
    );
};
