import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../common/misc/Button';


export default class NotFoundPage extends React.Component {
    render() {
        let dashboardUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/dashboard';

        return (
            <div className="NotFoundPage">
                <Msg tagName="h1"
                    id="pages.notFound.h1"/>
                <Msg tagName="p"
                    id="pages.notFound.p"/>
                <Button labelMsg="pages.notFound.dashboardButton"
                    href={ dashboardUrl }/>
                <Button labelMsg="pages.notFound.assignmentsButton"
                    href="/assignments"/>
            </div>
        );
    }
}
