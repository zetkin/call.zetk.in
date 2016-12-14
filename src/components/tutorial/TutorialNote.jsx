import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import FormattedLink from '../../common/misc/FormattedLink';
import PropTypes from '../../utils/PropTypes';
import { popTutorialNote } from '../../actions/tutorial';


@injectIntl
@connect(() => ({}))
export default class TutorialNote extends React.Component {
    static propTypes = {
        messages: PropTypes.map,
    };

    render() {
        let messages = this.props.messages;
        let manualButton = null;

        let href = this.props.intl.formatMessage({
            id: messages.get('manHref'),
        });

        if (href && href !== messages.get('manHref')) {
            manualButton = (
                <FormattedLink msgId="tutorial.manualButton"
                    className="TutorialNote-manualLink"
                    target="_blank"
                    href={ messages.get('manHref') }
                    />
            );
        }

        return (
            <div className="TutorialNote">
                <Msg tagName="h2" id={ messages.get('header') }/>
                <Msg tagName="p" id={ messages.get('text') }/>
                { manualButton }
                <FormattedLink msgId="tutorial.closeButton"
                    className="TutorialNote-closeLink"
                    onClick={ this.onCloseClick.bind(this) }
                    />
            </div>
        );
    }

    onCloseClick() {
        this.props.dispatch(popTutorialNote());
    }
}
