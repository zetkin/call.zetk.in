import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PageBase from './PageBase';
import Button from '../../common/misc/Button';


export default class NotFoundPage extends PageBase {
    renderContent() {
        let dashboardUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/dashboard';

        return [
            <Msg key="h1" tagName="h1"
                id="pages.notFound.h1"/>,
            <Msg key="p" tagName="p"
                id="pages.notFound.p"/>,
            <Button key="dashboardButton"
                labelMsg="pages.notFound.dashboardButton"
                href={ dashboardUrl }/>,
            <Button key="assignmentsButton"
                labelMsg="pages.notFound.assignmentsButton"
                href="/assignments"/>,
        ];
    }
}
