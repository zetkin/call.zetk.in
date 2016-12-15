import immutable from 'immutable';
import { createReducer } from 'redux-create-reducer';

import * as types from '../actions';


const initialState = immutable.fromJS({
    overlay: null,
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.SHOW_OVERLAY]: (state, action) => {
        let overlay = immutable.fromJS({
            type: action.payload.type,
            config: action.payload.config,
        });

        return state
            .set('overlay', overlay);
    },

    [types.CLOSE_OVERLAY]: (state, action) => {
        return state
            .set('overlay', null);
    },

    [types.START_CALL_WITH_TARGET + '_FULFILLED']: (state, action) => {
        return state
            .set('overlay', null);
    },

    [types.SKIP_CALL + '_FULFILLED']: (state, action) => {
        return state
            .set('overlay', null);
    },

    [types.SKIP_CALL + '_REJECTED']: (state, action) => {
        return state
            .set('overlay', null);
    },

    [types.SWITCH_LANE_TO_CALL]: (state, action) => {
        return state
            .set('overlay', null);
    },
});
