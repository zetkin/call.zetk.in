import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PropTypes from '../../utils/PropTypes';


export default class TagList extends React.Component {
    constructor(){
        super();
        this.state = {
            visibleTags: undefined
        }
    }
    static propTypes = {
        tags: PropTypes.list.isRequired,
    };

    componentDidMount(){
        // Counting tags that fit in the list
        const list = this.refs.TagList;
        const listBottom = list.getBoundingClientRect().bottom;
        for (let i = 0; i < list.children.length; i++) {
            const childBottom = list.children[i].getBoundingClientRect().bottom;
            if (childBottom > listBottom) {
                this.setState({visibleTags: i - 1})
                break;
            }
        }
    }

    render() {
        const {visibleTags = this.props.tags.size} = this.state;
        const hiddenTags = this.props.tags.size - visibleTags;

        let tagItems = [];
        for (let i = 0; i < visibleTags; i++) {
            const tag = this.props.tags.get(i);
            tagItems.push(
                <li key={ tag.get('id') }
                    title={ tag.get('description') }
                    className="TagList-tag">
                    { tag.get('title') }
                </li>
            )
        }


        if (tagItems.length === 0) {
            tagItems = (
                <Msg id="misc.tagList.emptyLabel"/>
            );
        }
        if (hiddenTags) {
            tagItems.push(
                <li key="moreTags"
                    title={`There are ${hiddenTags} more tags \nin the personal info pane`}
                    className="TagList-tag TagList-moreTag">
                    {`+${hiddenTags}`}
                </li>
            )
        }

        return (
            <ul className="TagList" ref="TagList">
                { tagItems }
            </ul>
        )
    }
}
