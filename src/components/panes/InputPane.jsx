import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../misc/Button';
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
                                    labelValues={{ campaign: 'First campaign' }}/>
                            </li>
                            <li>
                                <h3>Second campaign</h3>
                                <p>
                                    Booked on two future actions.
                                </p>
                                <Button labelMsg="panes.input.summary.campaigns.respondButton"
                                    labelValues={{ campaign: 'Second campaign' }}/>
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
                                    labelValues={{ survey: 'Member survey' }}/>
                            </li>
                        </ul>
                    </section>
                </div>
            );
        }

        return [
            <Msg key="h1" tagName="h1"
                id="panes.input.h1"
                values={{ target: target.get('name') }}/>,

            content,
        ];
    }
}
