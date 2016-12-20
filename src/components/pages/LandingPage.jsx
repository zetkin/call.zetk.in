import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PageBase from './PageBase';
import Button from '../../common/misc/Button';


export default class LandingPage extends PageBase {
    renderContent() {
        let loginUrl = '//login.' + process.env.ZETKIN_DOMAIN
            + '/login?redirPath=/assignments&appId=' + process.env.ZETKIN_APP_ID;

        return [
            <Msg key="h1" tagName="h1" id="pages.landing.h1"/>,
            <Msg key="p" tagName="p" id="pages.landing.intro"/>,
            <Button key="loginButon"
                labelMsg="pages.landing.loginButton"
                href={ loginUrl }/>,
        ];
    }
}
