import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const selectedLane = state => {
    let id = state.getIn(['lanes', 'selectedId']);
    return state.getIn(['lanes', 'allLanes', id]);
};



const initialState = immutable.fromJS({
    nextLaneNumber: 0,
    // TODO: More or less duplicate of calls.currentId
    selectedId: null,
    allLanes: {},
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.SELECT_ASSIGNMENT]: (state, action) => {
        let laneNumber = state.get('nextLaneNumber');
        let lane = {
            id: laneNumber.toString(),
            callId: null,
            infoMode: 'instructions',
            isPending: false,
            step: 'assignment',
        };

        return state
            .set('nextLaneNumber', laneNumber + 1)
            .set('selectedId', lane.id)
            .setIn(['allLanes', lane.id], immutable.fromJS(lane));
    },

    [types.RETRIEVE_ALLOCATED_CALLS + '_FULFILLED']: (state, action) => {
        let lanes = {};
        let laneNumber = state.get('nextLaneNumber');

        console.trace(laneNumber);

        action.payload.data.data.forEach(call => {
            let id = (laneNumber++).toString();
            lanes[id] = {
                id: id,
                callId: call.id.toString(),
                infoMode: 'instructions',
                step: 'prepare',
                isPending: false,
            };
        });

        return state
            .set('nextLaneNumber', laneNumber)
            .mergeIn(['allLanes'], immutable.fromJS(lanes));
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        // When a new call is created, proceed to the "prepare" step
        let callId = action.payload.data.data.id.toString();
        let laneId = state.get('selectedId');

        return state
            .setIn(['allLanes', laneId, 'callId'], callId)
            .setIn(['allLanes', laneId, 'step'], 'prepare');
    },

    [types.START_CALL_WITH_TARGET + '_FULFILLED']: (state, action) => {
        let call = action.payload.data.data;
        let callId = call.id.toString();
        let laneNumber = state.get('nextLaneNumber');

        // Overwrite existing lane if one exists without a call
        let laneId = state.get('allLanes')
            .findKey(lane => lane.get('callId') === null);

        if (!laneId) {
            // If there was no free lane, create a new lane
            laneId = (laneNumber++).toString();
        }

        let lane = {
            id: laneId,
            callId: callId,
            infoMode: 'instructions',
            isPending: false,
            step: 'prepare',
        };

        return state
            .set('nextLaneNumber', laneNumber)
            .set('selectedId', laneId)
            .setIn(['allLanes', laneId], immutable.fromJS(lane));
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

    [types.SWITCH_LANE_TO_CALL]: (state, action) => {
        let callId = action.payload.callId.toString();
        let lane = state.get('allLanes')
            .find(lane => lane.get('callId').toString() === callId);

        let laneId = lane.get('id');

        return state
            .set('selectedId', laneId);
    },
});
