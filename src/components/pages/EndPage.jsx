import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import PageBase from './PageBase';
import Button from '../../common/misc/Button';


const mapStateToProps = state => ({
});

@connect(mapStateToProps)
export default class EndPage extends PageBase {
    renderContent() {
        let dashboardUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/dashboard';

        return [
            <Msg key="h1" tagName="h1"
                id="pages.end.h"/>,
            <Msg key="p" tagName="p"
                id="pages.end.p"/>,
            <Button key="dashboardButton"
                labelMsg="pages.end.dashboardButton"
                href={ dashboardUrl }/>,
            <Button key="assignmentsButton"
                labelMsg="pages.end.assignmentsButton"
                href="/assignments"/>,
        ];
    }
}
