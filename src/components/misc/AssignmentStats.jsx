import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';


export default class AssignmentStats extends React.Component {
    static propTypes = {
        stats: React.PropTypes.object.isRequired,
    };

    render() {
        let stats = this.props.stats;

        let items = Object.keys(stats).map(msg => (
            <StatsItem key={ msg } labelMsg={ msg }
                number={ stats[msg] }/>
        ));

        return (
            <div className="AssignmentStats">
                <ul>
                    { items }
                </ul>
            </div>
        );
    }
}


const StatsItem = props => {
    return (
        <li className="AssignmentStats-item">
            <span className="AssignmentStats-itemNumber">
                { props.number }
            </span>
            <span className="AssignmentStats-itemLabel">
                <Msg id={ props.labelMsg }
                    values={{ number: props.number }}/>
            </span>
        </li>
    );
};
