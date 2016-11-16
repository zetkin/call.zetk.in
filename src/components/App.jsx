import { connect } from 'react-redux';
import React from 'react';


@connect(state => ({ fullState: state }))
export default class App extends React.Component {
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
