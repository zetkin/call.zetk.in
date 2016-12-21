import React from 'react';
import cx from 'classnames';

import Header from '../header/Header';
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
            <Header/>
        );
    }

    renderContent() {
        return null;
    }
}
