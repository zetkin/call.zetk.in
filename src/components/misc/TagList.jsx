import React from 'react';

export default class TagList extends React.Component {
    render() {
        return (
            <ul className="TagList">
                <li className="TagList-tag">Aktivist</li>
                <li className="TagList-tag">Södra Innerstaden</li>
                <li className="TagList-tag">Rosengård</li>
                <li className="TagList-tag">Valrörelsen 2014</li>
                <li className="TagList-tag">Vänsterkören</li>
                <li className="TagList-tag">Arabisktalande</li>
                <li className="TagList-tag">Ingång 2012</li>
                <li className="TagList-tag">Första maj 2012</li>
                <li className="TagList-tag">Fackansluten</li>
            </ul>
        )
    }
}

TagList.propTypes = {
        personId: React.PropTypes.any, // TODO: Use string
};