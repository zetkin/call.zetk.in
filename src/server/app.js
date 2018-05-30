import auth from 'express-zetkin-auth';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import Raven from 'raven';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import url from 'url';
import { match, RouterContext } from 'react-router';

import routes from '../components/routes';
import IntlReduxProvider from '../components/IntlReduxProvider';
import { loadLocaleHandler } from './locale';
import { selectedAssignment } from '../store/assignments';
import preloader from './preloader';

const packageJson = require('../../../package.json');


const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
    const ravenConfig = {
        release: packageJson.version,
        environment: process.env.NODE_ENV,
        tags: {
            domain: process.env.ZETKIN_DOMAIN,
        },
    };

    Raven.config(SENTRY_DSN, ravenConfig).install();
}


const authOpts = {
    zetkinDomain: process.env.ZETKIN_DOMAIN,
    app: {
        id: process.env.ZETKIN_APP_ID,
        secret: process.env.ZETKIN_APP_KEY,
    }
};

export default function initApp(messages) {
    const app = express();

    if (SENTRY_DSN) {
        app.use(Raven.requestHandler());
    }

    if (process.env.NODE_ENV !== 'production') {
        // When not in production, redirect requests for the main JS file to the
        // Webpack dev server running on localhost.
        app.get('/static/main.js', function(req, res) {
            let wpMainJs = url.format({
                hostname: req.hostname,
                port: process.env.WEBPACK_PORT || 81,
                pathname: '/static/main.js',
            });

            res.redirect(303, wpMainJs);
        });
    }

    app.use('/favicon.ico', (req, res) => res.status(404).end());
    app.use('/static/', express.static(
        path.join(__dirname, '../../static'),
        { fallthrough: false }));

    app.use(cookieParser());
    app.use(auth.initialize(authOpts));
    app.get('/logout', auth.logout(authOpts));

    // Redirect to assignments page if logged in
    app.get('/', auth.validate(authOpts, true), (req, res, next) => {
        if (req.isZetkinAuthenticated) {
            res.redirect('/assignments');
        }
        else {
            next();
        }
    });

    // Require users to be authenticated for most pages
    app.get('/assignments*', auth.validate(authOpts));

    app.get('/l10n', loadLocaleHandler());

    app.use(preloader(messages));

    // Check that assignment could be retrieved
    app.get('/assignments/*', (req, res, next) => {
        let assignment = selectedAssignment(req.store.getState());
        if (assignment) {
            next();
        }
        else {
            res.redirect('/assignments');
        }
    });

    if (SENTRY_DSN) {
        app.use(Raven.errorHandler());
    }

    app.use(function(req, res, next) {
        renderReactPage(req, res);
    });

    return app;
}

function renderReactPage(req, res) {
    try {
        match({ routes, location: req.url }, (err, redirect, props) => {
            let html = ReactDOMServer.renderToString(
                React.createElement(IntlReduxProvider, { store: req.store },
                    React.createElement(RouterContext, props)));

            if (props.routes.find(r => r.id === '404')) {
                res.status(404);
            }

            res.send(html);
        });
    }
    catch (err) {
        if (SENTRY_DSN) {
            Raven.captureException(err);
        }

        throw err; // TODO: Better error handling
    }
}
