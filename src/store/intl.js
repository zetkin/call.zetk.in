import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


const initialState = immutable.fromJS({
    locale: 'en',
    messages: {},
});


export default createReducer(initialState, {
    [types.SET_INTL_DATA]: (state, action) => {
        return state
            .merge(immutable.fromJS(action.payload.data));
    },
});
