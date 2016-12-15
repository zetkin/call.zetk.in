import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import PaneBase from './PaneBase';
import FormattedLink from '../../common/misc/FormattedLink';


export default class QueueEmptyPane extends PaneBase {
    renderContent() {
        return [
            <Msg key="h1" tagName="h1" id="panes.queueEmpty.h1"/>,
            <Msg key="p" tagName="p" id="panes.queueEmpty.p"/>,
            <FormattedLink key="assignmentsLink"
                href="/assignments"
                msgId="panes.queueEmpty.assignmentsLink"/>,
        ];
    }
}
