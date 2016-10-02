import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const selectedLane = state => {
    let id = state.getIn(['lanes', 'selectedId']);
    return state.getIn(['lanes', 'allLanes', id]);
};


let laneId = 0;

const initialState = immutable.fromJS({
    selectedId: null,
    allLanes: {},
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.SELECT_ASSIGNMENT]: (state, action) => {
        let lane = {
            id: (laneId++).toString(),
            callId: null,
            isPending: false,
            step: 'assignment',
        };

        return state
            .set('selectedId', lane.id)
            .set('allLanes', immutable.fromJS({ [lane.id]: lane }));
    },

    [types.SET_LANE_STEP]: (state, action) => {
        let step = action.payload.step;
        let laneId = action.payload.lane.get('id');

        return state
            .setIn(['allLanes', laneId, 'step'], step);
    },
});
