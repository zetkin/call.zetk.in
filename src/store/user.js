import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


const initialState = immutable.fromJS({
    isPending: false,
    data: null,
});


export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.SET_USER_DATA]: (state, action) => {
        return state
            .set('data', immutable.fromJS(action.payload));
    },
});
