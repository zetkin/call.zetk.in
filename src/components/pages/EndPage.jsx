import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Button from '../../common/misc/Button';


const mapStateToProps = state => ({
});

@connect(mapStateToProps)
export default class EndPage extends React.Component {
    render() {
        let dashboardUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/dashboard';

        return (
            <div className="EndPage">
                <Msg tagName="h1"
                    id="pages.end.h"/>
                <Msg tagName="p"
                    id="pages.end.p"/>
                <Button labelMsg="pages.end.dashboardButton"
                    href={ dashboardUrl }/>
                <Button labelMsg="pages.end.assignmentsButton"
                    href="/assignments"/>
            </div>
        );
    }
}
