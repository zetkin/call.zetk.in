import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import Logo from './Logo';
import UserMenu from '../../common/misc/userMenu/UserMenu';


@connect(state => ({ user: state.get('user') }))
export default class Header extends React.Component {

    render() {
        let userData = this.props.user.get('data');
        let dashboardUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/dashboard';

        return (
            <header className="Header">
                <Logo/>
                <div className="Header-currentApp">Zetkin Call</div>
                <div className="Header-nav">
                    <UserMenu user={ userData }/>
                    <a className="Header-navLink" href={ dashboardUrl }>Min sida</a>
                </div>
            </header>
        );
    }
}