import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const selectedLane = state => {
    let key = state.getIn(['lanes', 'allLanes', 'selectedKey']);
    return state.getIn(['lanes', 'allLanes', key]);
};


const initialState = immutable.fromJS({
    selectedKey: null,
    allLanes: [],
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.SELECT_ASSIGNMENT]: (state, action) => {
        let lane = {
            callId: null,
            isPending: false,
            step: 'assignment',
        };

        return state
            .set('selectedKey', 0)
            .set('allLanes', immutable.fromJS([ lane ]));
    },
});
