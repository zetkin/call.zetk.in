import React from 'react';
import cx from 'classnames';

import Avatar from '../Avatar';


export default class LaneSwitchItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jumping: false,
        };
    }

    componentDidMount() {
        let delay = 1000 + Math.random() * 4000;
        this.timer = setTimeout(this.onTimeout.bind(this), delay);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        let call = this.props.call;
        let target = call.get('target');

        let classes = cx('LaneSwitchItem', {
            jumping: this.state.jumping,
        });

        return (
            <li className={ classes }
                title={ target.get('name') }
                onClick={ this.props.onClick }>
                <Avatar personId={ target.get('id') }
                    orgId={ call.get('organization_id') }
                    mask={ true }
                    />
            </li>
        );
    }

    onTimeout() {
        if (this.state.jumping) {
            // Was jumping. Wait 2-10 seconds before jumping again.
            let delay = 2000 + Math.random() * 8000;
            this.timer = setTimeout(this.onTimeout.bind(this), delay);

            this.setState({
                jumping: false,
            });
        }
        else {
            // Should jump, then wait 500 ms (at which it will be reset).
            this.timer = setTimeout(this.onTimeout.bind(this), 1000);
            this.setState({
                jumping: true,
            });
        }
    }
}
