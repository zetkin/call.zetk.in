import React from 'react';
import { FormattedRelative } from 'react-intl';

import Avatar from '../Avatar';
import PropTypes from '../../../utils/PropTypes';


export default class CallOpListItem extends React.Component {
    static propTypes = {
        call: PropTypes.map.isRequired,
    };

    render() {
        let call = this.props.call;
        let target = call.get('target');
        let date = new Date(call.get('allocation_time'));

        return (
            <div className="CallOpListItem">
                <Avatar mask={ true }
                    personId={ target.get('id') }
                    orgId={ call.get('organization_id') }
                    />

                <span className="CallOpListItem-name">
                    { target.get('name') }
                </span>
                <span className="CallOpListItem-time">
                    <FormattedRelative value={ date }/>
                </span>

                <div className="CallOpListItem-ops">
                    { this.props.children }
                </div>
            </div>
        );
    }
}
