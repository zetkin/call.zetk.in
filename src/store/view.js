import immutable from 'immutable';
import { createReducer } from 'redux-create-reducer';

import * as types from '../actions';


const initialState = immutable.fromJS({
    callViewState: 'lane',
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.SET_CALL_VIEW_STATE]: (state, action) => {
        return state
            .set('callViewState', action.payload.state);
    },
});
