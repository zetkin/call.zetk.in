import { connect } from 'react-redux';
import React from 'react';


@connect(state => ({ fullState: state }))
export default class App extends React.Component {
    render() {
        let stateJson = JSON.stringify(this.props.fullState);

        return (
            <html>
                <head>
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
