import { compose, applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux-immutable';
import immutable from 'immutable';
import { intlReducer } from 'react-intl-redux';
import promiseMiddleware from 'redux-promise-middleware';

import actions from './actions';
import assignments from './assignments';
import calls from './calls';
import campaigns from './campaigns';
import lanes from './lanes';
import user from './user';
import view from './view';


const appReducer = combineReducers({
    intl: intlReducer,
    actions,
    assignments,
    calls,
    campaigns,
    lanes,
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
    ];

    let devTools = f => f;
    if (typeof window === 'object' && window.devToolsExtension) {
        devTools = window.devToolsExtension({
            deserializeState: state => immutable.fromJS(state)
        });
    }

    let createWithMiddleware = compose(
        applyMiddleware(...middleware),
        devTools,
    )(createStore);

    return createWithMiddleware(appReducer, initialState);
};
