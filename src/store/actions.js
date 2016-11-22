import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


const initialState = immutable.fromJS({
    actionList: {
        isPending: false,
        error: null,
        items: null,
    },
    responseList: {
        isPending: false,
        error: null,
        items: {},
    },
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        // Get responses from target info
        let responses = {};
        action.payload.data.data.target.action_responses.forEach(response => {
            responses[response.action_id] = response;
        });

        // Reset when new call starts
        return state
            .setIn(['actionList', 'error'], null)
            .setIn(['actionList', 'isPending'], false)
            .setIn(['actionList', 'items'], immutable.Map())
            .setIn(['responseList', 'error'], null)
            .setIn(['responseList', 'isPending'], false)
            .setIn(['responseList', 'items'], immutable.fromJS(responses));
    },

    [types.RETRIEVE_ACTIONS + '_PENDING']: (state, action) => {
        return state
            .setIn(['actionList', 'error'], null)
            .setIn(['actionList', 'isPending'], true);
    },

    [types.RETRIEVE_ACTIONS + '_FULFILLED']: (state, action) => {
        let actions = {};
        action.payload.data.data.forEach(obj => {
            actions[obj.id] = Object.assign(obj, {
                org_id: action.meta.orgId,
            });
        });

        return state
            .setIn(['actionList', 'error'], null)
            .setIn(['actionList', 'isPending'], false)
            .updateIn(['actionList', 'items'], items => items?
                items.merge(immutable.fromJS(actions)) :
                immutable.fromJS(actions));
    },

    [types.UPDATE_ACTION_RESPONSE + '_FULFILLED']: (state, action) => {
        let actionId = action.meta.actionId.toString();
        if (action.meta.responseBool) {
            let response = immutable.fromJS({
                ...action.payload.data.data,
                action_id: actionId,
            });

            return state
                .updateIn(['responseList', 'items'], items => items?
                    items.set(actionId, response) :
                    immutable.toJS({ [actionId]: response }));
        }
        else {
            return state
                .deleteIn(['responseList', 'items', actionId]);
        }
    },
});
