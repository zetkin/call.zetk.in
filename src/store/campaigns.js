import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


const initialState = immutable.fromJS({
    campaignList: {
        isPending: false,
        error: null,
        items: null,
    }
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        // Reset when new call starts
        return state
            .setIn(['campaignList', 'error'], null)
            .setIn(['campaignList', 'isPending'], false)
            .setIn(['campaignList', 'items'], immutable.Map());
    },

    [types.RETRIEVE_CAMPAIGNS + '_PENDING']: (state, action) => {
        return state
            .setIn(['campaignList', 'error'], null)
            .setIn(['campaignList', 'isPending'], true);
    },

    [types.RETRIEVE_CAMPAIGNS + '_FULFILLED']: (state, action) => {
        let campaigns = {};
        action.payload.data.data.forEach(obj => {
            campaigns[obj.id.toString()] = Object.assign(obj, {
                org_id: action.meta.orgId,
            });
        });

        return state
            .setIn(['campaignList', 'error'], null)
            .setIn(['campaignList', 'isPending'], false)
            .updateIn(['campaignList', 'items'], items => items?
                items.merge(immutable.fromJS(campaigns)) :
                immutable.fromJS(campaigns));
    },
});
