import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


const initialState = immutable.fromJS({
    actionList: {
        isPending: false,
        error: null,
        items: null,
    },
    byTarget: {},
});

const stateForNewTarget = (state, target) => {
    let targetId = target.id.toString();

    // Get responses from target info
    let responses = {};
    target.action_responses.forEach(response => {
        responses[response.action_id] = response;
    });

    // Get actions from target info
    let actions = {};
    target.future_actions.forEach(obj => {
        actions[obj.id] = obj;
    });

    // Reset when new call starts
    return state
        .setIn(['byTarget', targetId, 'responseList', 'error'], null)
        .setIn(['byTarget', targetId, 'responseList', 'isPending'], false)
        .setIn(['byTarget', targetId, 'responseList', 'items'],
            immutable.fromJS(responses))
        .setIn(['byTarget', targetId, 'userActionList', 'error'], null)
        .setIn(['byTarget', targetId, 'userActionList', 'isPending'], false)
        .setIn(['byTarget', targetId, 'userActionList', 'items'],
            immutable.fromJS(actions));
};

export default createReducer(initialState, {
    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        return stateForNewTarget(state, action.payload.data.data.target);
    },

    [types.START_CALL_WITH_TARGET + '_FULFILLED']: (state, action) => {
        return stateForNewTarget(state, action.payload.data.data.target);
    },

    [types.SKIP_CALL + '_FULFILLED']: (state, action) => {
        return stateForNewTarget(state, action.payload.data.data.target);
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
                org_id: action.meta.orgId.toString(),
            });
        });

        return state
            .setIn(['actionList', 'error'], null)
            .setIn(['actionList', 'isPending'], false)
            .updateIn(['actionList', 'items'], items => items?
                items.merge(immutable.fromJS(actions)) :
                immutable.fromJS(actions));
    },

    [types.RETRIEVE_ALLOCATED_CALLS + '_FULFILLED']: (state, action) => {
        action.payload.data.data.forEach(call => {
            let targetId = call.target.id.toString();

            let responses = call.target.action_responses.reduce((m, r) =>
                Object.assign(m, { [r.action_id.toString()]: r }), {});
            let actions = call.target.future_actions.reduce((m, a) =>
                Object.assign(m, { [a.id.toString()]: a }), {});

            state = state
                .setIn(['byTarget', targetId, 'responseList', 'error'], null)
                .setIn(['byTarget', targetId, 'responseList', 'isPending'], false)
                .setIn(['byTarget', targetId, 'responseList', 'items'],
                    immutable.fromJS(responses))
                .setIn(['byTarget', targetId, 'userActionList', 'error'], null)
                .setIn(['byTarget', targetId, 'userActionList', 'isPending'], false)
                .setIn(['byTarget', targetId, 'userActionList', 'items'],
                    immutable.fromJS(actions));
        });

        return state;
    },

    [types.UPDATE_ACTION_RESPONSE + '_FULFILLED']: (state, action) => {
        let targetId = action.meta.personId.toString();
        let actionId = action.meta.actionId.toString();
        if (action.meta.responseBool) {
            let response = immutable.fromJS({
                ...action.payload.data.data,
                action_id: actionId,
            });

            return state
                .updateIn(['byTarget', targetId, 'responseList', 'items'],
                    items => items?
                        items.set(actionId, response) :
                        immutable.fromJS({ [actionId]: response }));
        }
        else {
            return state
                .deleteIn(['byTarget', targetId, 'responseList', 'items', actionId]);
        }
    },
});
