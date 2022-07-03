import { compose, applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import immutable from 'immutable';
import promiseMiddleware from 'redux-promise-middleware';

import loginRedirect from '../common/redux/middleware/loginRedirect';

import actions from './actions';
import assignments from './assignments';
import calls from './calls';
import campaigns from './campaigns';
import intl from './intl';
import lanes from './lanes';
import orgs from './orgs';
import surveys from './surveys';
import tutorial from './tutorial';
import user from './user';
import view from './view';


const appReducer = combineReducers({
    actions,
    assignments,
    calls,
    campaigns,
    lanes,
    orgs,
    intl,
    surveys,
    tutorial,
    user,
    view,
});

export const configureStore = (initialState, z) => {
    let thunkWithZ = store => next => action => {
        if (typeof action === 'function') {
            return action({ ...store, z });
        }

        return next(action);
    };

    let middleware = [
        promiseMiddleware(),
        thunkWithZ,
        loginRedirect(),
    ];

    let devTools = f => f;
    if (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        devTools = window.__REDUX_DEVTOOLS_EXTENSION__({
            deserializeState: state => immutable.fromJS(state)
        });
    }

    let createWithMiddleware = compose(
        applyMiddleware(...middleware),
        devTools,
    )(createStore);

    return createWithMiddleware(appReducer, initialState);
};
