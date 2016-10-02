import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../misc/Button';


export default class LandingPage extends React.Component {
    render() {
        let loginUrl = '//login.' + process.env.ZETKIN_DOMAIN
            + '/login?redirPath=/assignments&appId=' + process.env.ZETKIN_APP_ID;

        return (
            <div className="LandingPage">
                <Msg tagName="h1" id="pages.landing.h1"/>
                <Msg tagName="p" id="pages.landing.intro"/>
                <Button labelMsg="pages.landing.loginButton"
                    href={ loginUrl }/>
            </div>
        );
    }
}
