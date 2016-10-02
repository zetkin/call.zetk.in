import auth from 'express-zetkin-auth';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import App from '../components/App';
import routes from '../components/routes';
import IntlReduxProvider from '../components/IntlReduxProvider';
import { loadLocaleHandler } from './locale';
import preloader from './preloader';


const authOpts = {
    loginUrl: process.env.ZETKIN_LOGIN_URL,
    app: {
        id: process.env.ZETKIN_APP_ID,
        key: process.env.ZETKIN_APP_KEY,
    }
};

export default function initApp(messages) {
    const app = express();

    if (process.env.NODE_ENV !== 'production') {
        // When not in production, redirect requests for the main JS file to the
        // Webpack dev server running on localhost.
        // TODO: Configure dev server using environment variables?
        app.get('/static/main.js', function(req, res) {
            res.redirect(303, 'http://localhost:8080/static/main.js');
        });
    }

    app.use('/favicon.ico', (req, res) => res.status(404).end());
    app.use('/static/', express.static(
        path.join(__dirname, '../../static'),
        { fallthrough: false }));

    app.use(cookieParser());
    app.use(auth.initialize(authOpts));
    app.get('/', auth.callback(authOpts));
    app.get('/logout', auth.logout(authOpts));

    // Require users to be authenticated for most pages
    app.get('/assignments*', auth.validate(authOpts));

    app.get('/l10n', loadLocaleHandler());

    app.use(preloader(messages));

    app.use(function(req, res, next) {
        renderReactPage(App, req, res);
    });

    return app;
}

function renderReactPage(Component, req, res) {
    try {
        match({ routes, location: req.url }, (err, redirect, props) => {
            let html = ReactDOMServer.renderToString(
                React.createElement(IntlReduxProvider, { store: req.store },
                    React.createElement(RouterContext, props)));

            res.send(html);
        });
    }
    catch (err) {
        throw err; // TODO: Better error handling
    }
}
