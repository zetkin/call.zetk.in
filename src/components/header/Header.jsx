import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import Logo from './Logo';
import FormattedLink from '../../common/misc/FormattedLink';
import UserMenu from '../../common/misc/userMenu/UserMenu';


@connect(state => ({ user: state.get('user') }))
export default class Header extends React.Component {

    render() {
        let userWidget;
        let userData = this.props.user.get('data');
        let isAuthenticated = !!userData;

        if (isAuthenticated) {
            userWidget = (
                <UserMenu user={ userData }/>
            );
        }
        else {
            userWidget = null;
        }

        let dashboardUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/dashboard';

        return (
            <header className="Header">
                <Logo/>
                <div className="Header-currentApp">Zetkin Call</div>
                <div className="Header-nav">
                    { userWidget }
                    <FormattedLink className="Header-navLink"
                        msgId="header.dashboardLink"
                        href={ dashboardUrl }
                        />
                </div>
            </header>
        );
    }
}