import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import ReportForm from '../report/ReportForm';
import { currentCall } from '../../store/calls';


const mapStateToProps = state => ({
    call: currentCall(state),
});


@connect(mapStateToProps)
export default class ReportPane extends PaneBase {
    renderContent() {
        let call = this.props.call;
        let report = call.get('report');

        return [
            <Msg key="h1" tagName="h1" id="panes.report.h1"/>,
            <ReportForm key="form" report={ report }/>
        ];
    }
}
