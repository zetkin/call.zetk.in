import React from 'react';
import cx from 'classnames';

import { componentClassNames } from '../';


export default class PageBase extends React.Component {
    render() {
        let classes = cx(componentClassNames(this));

        return (
            <div className={ classes }>
                { this.renderHeader() }
                <div className="PageBase-content">
                    { this.renderContent() }
                </div>
            </div>
        );
    }

    renderHeader() {
        return (
            <header/>
        );
    }

    renderContent() {
        return null;
    }
}
