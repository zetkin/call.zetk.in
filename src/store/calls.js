import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const currentCall = state => {
    let id = state.getIn(['calls', 'currentId']);
    return state.getIn(['calls', 'activeCalls', id]);
};

const initialState = {
    currentId: null,
    currentIsPending: false,
    activeCalls: {},
};


export default createReducer(initialState, {
    ['@@INIT']: (state, action) => {
        return immutable.fromJS(state);
    },

    [types.START_NEW_CALL + '_PENDING']: (state, action) => {
        return state
            .set('currentIsPending', true);
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        let call = action.payload.data.data;
        let callId = call.id.toString();

        return state
            .set('currentId', callId)
            .set('currentIsPending', false)
            .setIn(['activeCalls', callId], immutable.fromJS(call))
    },
});
