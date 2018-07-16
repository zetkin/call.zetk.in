import { connect } from 'react-redux';
import React from 'react';

import GoogleAnalytics from './misc/GoogleAnalytics';
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

        // TODO: This is not a great solution to the issue where panes open
        // just because of tabbing (#104) but it works. Might be a pain once
        // surveys are in Call and user wants to tab between inputs.
        window.addEventListener('keydown', ev => {
            if (ev.keyCode == 9) {
                ev.preventDefault();
            }
        });
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
                    <script type="text/javascript"
                        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCih1zeZELzFJxP2SFkNJVDLs2ZCT_y3gY&libraries=visualization,geometry"/>
                    <link rel="icon" type="image/png"
                        href="/static/images/favicon.png"/>
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
                    <GoogleAnalytics/>
                </body>
            </html>
        );
    }

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    }
}
