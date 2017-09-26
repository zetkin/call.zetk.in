/**
 * This is the main entry point of the client-side instance of the application.
 * The server will have already rendered the HTML and prepared initial dataset
 * in the App-initialState script element.
*/
import cookie from 'cookie-cutter';
import immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import Z from 'zetkin';
import { addLocaleData } from 'react-intl';
import svLocaleData from 'react-intl/locale-data/sv';
import daLocaleData from 'react-intl/locale-data/da';
import { Router, browserHistory } from 'react-router';

import polyfills from '../utils/polyfills';
import { configureStore } from '../store';
import IntlReduxProvider from '../components/IntlReduxProvider';
import routes from '../components/routes';


const USE_TLS = (process.env.ZETKIN_USE_TLS == '1');


window.onload = function() {
    Z.configure({
        host: 'api.' + process.env.ZETKIN_DOMAIN,
        port: USE_TLS? 443 : 80,
        ssl: USE_TLS,
    });

    addLocaleData([
        ...svLocaleData,
        ...daLocaleData,
    ]);

    let ticket = cookie.get('apiTicket');
    if (ticket) {
        Z.setTicket(JSON.parse(ticket));
    }

    let stateElem = document.getElementById('App-initialState');
    let stateJson = stateElem.innerText || stateElem.textContent;
    let initialState = immutable.fromJS(JSON.parse(stateJson));

    let store = configureStore(initialState, Z);
    let props = {
        routes,
        history: browserHistory
    };

    ReactDOM.render(React.createElement(IntlReduxProvider, { store },
        React.createElement(Router, props)), document);
};
