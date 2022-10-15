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
        messages: PropTypes.map.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
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
                    href={ href }
                    />
            );
        }

        let style = {
            left: this.props.x + 'px',
            top: this.props.y + 'px',
        };

        return (
            <div className="TutorialNote" style={ style }>
                <Msg tagName="h2" id={ messages.get('header') }/>
                <Msg tagName="p" id={ messages.get('text') }/>
                { manualButton }
                <button className="TutorialNote-closeButton"
                    onClick={ this.onCloseClick.bind(this) }>
                    {this.props.intl.formatMessage({
                        id: 'tutorial.closeButton'
                    })}
                </button>
            </div>
        );
    }

    onCloseClick() {
        this.props.dispatch(popTutorialNote());
    }
}
