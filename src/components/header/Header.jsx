import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import Logo from './Logo';
import UserMenu from '../../common/misc/userMenu/UserMenu';


@connect(state => ({ user: state.get('user') }))
export default class Header extends React.Component {

    render() {
        let userData = this.props.user.get('data');

        return (
            <header className="Header">
                <Logo/>
                <UserMenu user={ userData }/>
            </header>
        );
    }
}