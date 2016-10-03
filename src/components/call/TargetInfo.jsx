import React from 'react';

import PropTypes from '../../utils/PropTypes';


export default class TargetInfo extends React.Component {
    static propTypes = {
        target: PropTypes.map.isRequired,
    };

    render() {
        let target = this.props.target;

        return (
            <div className="TargetInfo">
                <h1>{ target.get('name') }</h1>
            </div>
        );
    }
};
