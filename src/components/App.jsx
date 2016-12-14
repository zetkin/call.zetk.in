import { connect } from 'react-redux';
import React from 'react';

import OverlayStack from './overlays/OverlayStack';
import { showOverlay } from '../actions/view';
import Tutorial from './tutorial/Tutorial';


@connect(state => ({ fullState: state }))
export default class App extends React.Component {
    componentDidMount() {
        let activeCalls = this.props.fullState.getIn(['calls', 'activeCalls']);
        if (activeCalls.size > 0) {
            this.props.dispatch(showOverlay('resume'));
        }
    }

    render() {
        let stateJson = JSON.stringify(this.props.fullState);

        return (
            <html>
                <head>
                    <meta name="viewport"
                        content="width=device-width, initial-scale=1"/>
                    <script src="https://use.typekit.net/tqq3ylv.js"></script>
                    <script>{"try{Typekit.load({ async: true })}catch(e){}"}</script>
                    <title>Zetkin</title>
                    <script src="/static/main.js"></script>
                    <link rel="stylesheet" href="/static/css/style.css"/>
                    <link rel="icon" type="image/png"
                        href="/static/img/favicon.png"/>
                </head>
                <body>
                    <div className="App-content">
                        { this.props.children }
                    </div>
                    <OverlayStack/>
                    <Tutorial/>
                    <script type="text/json"
                        id="App-initialState"
                        dangerouslySetInnerHTML={{ __html: stateJson }}/>
                </body>
            </html>
        );
    }

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    }
}
