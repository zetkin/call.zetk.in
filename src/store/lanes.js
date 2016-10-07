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
            infoMode: 'instructions',
            isPending: false,
            step: 'assignment',
        };

        return state
            .set('selectedId', lane.id)
            .set('allLanes', immutable.fromJS({ [lane.id]: lane }));
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        // When a new call is created, proceed to the "prepare" step
        let laneId = state.get('selectedId');

        return state
            .setIn(['allLanes', laneId, 'step'], 'prepare');
    },

    [types.START_CALL_WITH_TARGET + '_FULFILLED']: (state, action) => {
        let call = action.payload.data.data;
        let callId = call.id.toString();
        let lane = {
            id: (laneId++).toString(),
            callId: callId,
            infoMode: 'instructions',
            isPending: false,
            step: 'prepare',
        };

        return state
            .set('selectedId', lane.id)
            .setIn(['allLanes', lane.id], immutable.fromJS(lane));
    },

    [types.SUBMIT_CALL_REPORT + '_FULFILLED']: (state, action) => {
        let laneId = state.get('selectedId');

        return state
            .setIn(['allLanes', laneId, 'step'], 'done');
    },

    [types.SET_LANE_INFO_MODE]: (state, action) => {
        let laneId = state.get('selectedId');
        let mode = action.payload.mode;

        return state
            .setIn(['allLanes', laneId, 'infoMode'], mode);
    },

    [types.SET_LANE_STEP]: (state, action) => {
        let step = action.payload.step;
        let laneId = action.payload.lane.get('id');

        return state
            .setIn(['allLanes', laneId, 'step'], step);
    },
});
