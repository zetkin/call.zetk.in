import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../misc/Button';
import FormattedLink from '../misc/FormattedLink';
import PaneBase from './PaneBase';
import { currentCall } from '../../store/calls';


const mapStateToProps = state => ({
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

    renderContent() {
        let target = this.props.call.get('target');
        let content = null;

        // TODO: Don't hard-code content
        if (this.state.viewMode == 'summary') {
            content = (
                <div key="content" className="InputPane-summary">
                    <section className="InputPane-campaigns">
                        <Msg tagName="h2" id="panes.input.summary.campaigns.h2"/>

                        <ul className="InputPane-summaryList">
                            <li>
                                <h3>First campaign</h3>
                                <p>
                                    No future bookings.
                                </p>
                                <Button labelMsg="panes.input.summary.campaigns.respondButton"
                                    labelValues={{ campaign: 'First campaign' }}
                                    onClick={ this.onRespondClick.bind(this, 'campaign', 1) }/>
                            </li>
                            <li>
                                <h3>Second campaign</h3>
                                <p>
                                    Booked on two future actions.
                                </p>
                                <Button labelMsg="panes.input.summary.campaigns.respondButton"
                                    labelValues={{ campaign: 'Second campaign' }}
                                    onClick={ this.onRespondClick.bind(this, 'campaign', 2) }/>
                            </li>
                        </ul>
                    </section>
                    <section className="InputPane-surveys">
                        <Msg tagName="h2" id="panes.input.summary.surveys.h2"/>

                        <ul className="InputPane-summaryList">
                            <li>
                                <h3>Member survey</h3>
                                <p>
                                    34% filled out.
                                </p>
                                <Button labelMsg="panes.input.summary.surveys.respondButton"
                                    labelValues={{ survey: 'Member survey' }}
                                    onClick={ this.onRespondClick.bind(this, 'survey', 1) }/>
                            </li>
                        </ul>
                    </section>
                </div>
            );
        }
        else {
            let selectValue = this.state.viewMode + ':' + this.state.selectedId;

            content = [
                <FormattedLink key="summaryLink" msgId="panes.input.summaryLink"
                    onClick={ this.onSummaryLinkClick.bind(this) }/>,
                <select key="inputSelect"
                    value={ selectValue }
                    onChange={ this.onSelectChange.bind(this) }>
                    <option value="campaign:1">First campaign</option>
                    <option value="campaign:2">Second campaign</option>
                    <option value="survey:1">Member survey</option>
                </select>,
            ];

            if (this.state.viewMode == 'campaign') {
                content.push(
                    <h2 key="h2">Campaign</h2>,
                    <p key="intro">
                        This is a campaign.
                    </p>,
                    <img key="dummy" src="/static/img/dummies/dummy-campaign.png"/>,
                );
            }
            else if (this.state.viewMode == 'survey') {
                content.push(
                    <h2 key="h2">Member survey</h2>,
                    <p key="intro">
                        This is the member survey.
                    </p>,
                    <img key="dummy" src="/static/img/dummies/dummy-survey.png"/>,
                );
            }
        }

        return [
            <Msg key="h1" tagName="h1"
                id="panes.input.h1"
                values={{ target: target.get('name') }}/>,

            content,
        ];
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
