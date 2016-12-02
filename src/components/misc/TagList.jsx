import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../utils/PropTypes';


export default class TagList extends React.Component {
    static propTypes = {
        tags: PropTypes.list.isRequired,
    };

    render() {
        let tagItems = this.props.tags.map(tag => (
            <li key={ tag.get('id') }
                className="TagList-tag">{ tag.get('title') }</li>
        ));

        if (tagItems.size === 0) {
            tagItems = (
                <Msg id="misc.tagList.emptyLabel"/>
            );
        }

        return (
            <ul className="TagList">
                { tagItems }
            </ul>
        )
    }
}
