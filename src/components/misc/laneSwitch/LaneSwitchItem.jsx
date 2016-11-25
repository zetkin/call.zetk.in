import React from 'react';

import Avatar from '../Avatar';


export default class LaneSwitchItem extends React.Component {
    render() {
        let call = this.props.call;
        let target = call.get('target');

        return (
            <li className="LaneSwitchItem"
                title={ target.get('name') }
                onClick={ this.props.onClick }>
                <Avatar personId={ target.get('id') }
                    orgId={ call.get('organization_id') }
                    mask={ true }
                    />
            </li>
        );
    }
}
