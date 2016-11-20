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
                                <h3>En välfärd att lita på</h3>
                                <p>
                                    Inga kommande anmälningar.
                                </p>
                                <Button labelMsg="panes.input.summary.campaigns.respondButton"
                                    labelValues={{ campaign: 'En välfärd att lita på' }}
                                    onClick={ this.onRespondClick.bind(this, 'campaign', 1) }/>
                            </li>
                            <li>
                                <h3>Rosengård är inte till salu</h3>
                                <p>
                                    Anmäld på två kommande aktiviteter.
                                </p>
                                <Button labelMsg="panes.input.summary.campaigns.respondButton"
                                    labelValues={{ campaign: 'Rosengård är inte till salu' }}
                                    onClick={ this.onRespondClick.bind(this, 'campaign', 2) }/>
                            </li>
                        </ul>
                    </section>
                    <section className="InputPane-surveys">
                        <Msg tagName="h2" id="panes.input.summary.surveys.h2"/>

                        <ul className="InputPane-summaryList">
                            <li>
                                <h3>Medlemsenkäten</h3>
                                <p>
                                    34% ifylld.
                                </p>
                                <Button labelMsg="panes.input.summary.surveys.respondButton"
                                    labelValues={{ survey: 'Medlemsenkäten' }}
                                    onClick={ this.onRespondClick.bind(this, 'survey', 1) }/>
                            </li>
                        </ul>
                    </section>
                </div>
            );
        }
        else {
            let selectValue = this.state.viewMode + ':' + this.state.selectedId;

            content = [];

            if (this.state.viewMode == 'campaign') {
                content.push(
                    <div key="campaignInfo" className="InputPane-campaignInfo">
                        <h2 key="h2">En välfärd att lita på</h2>
                        <p key="intro">
                            Över hela Skåne går Vänsterpartiet ut i en kampanjar 
                            för en jämlik sjukvård med ökade resurser och en 
                            kollektivtrafik som alla har råd med. I regionen 
                            slåss vi för ökade resurser och en höjd skatt för 
                            att lösa de stora problem som skapats under år av 
                            misskötsel av ett borgerligt styre och nu 
                            S/Mp-styre.
                        </p>
                    </div>,
                    <img key="dummy" src="/static/img/dummies/dummy-campaign.png"/>,
                );
            }
            else if (this.state.viewMode == 'survey') {
                content.push(
                    <h2 key="h2">Medlemsenkäten</h2>,
                    <p key="intro">
                        Fyll i Medlemsenkäten 2016.
                    </p>,
                    <img key="dummy" src="/static/img/dummies/dummy-survey.png"/>,
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
                        <option value="campaign:1">En välfärd att lita på</option>
                        <option value="campaign:2">Rosengård är inte till salu</option>
                        <option value="survey:1">Medlemsenkäten</option>
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
