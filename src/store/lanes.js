import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const selectedLane = state => {
    let id = state.getIn(['lanes', 'selectedId']);
    return state.getIn(['lanes', 'allLanes', id]);
};

export const laneByCallId = (state, id) =>
    state.get('allLanes')
        .find(lane => lane.get('callId').toString() === id);


const initialState = immutable.fromJS({
    nextLaneNumber: 0,
    // TODO: More or less duplicate of calls.currentId
    selectedId: null,
    allLanes: {},
});

const REPORT_STEP_PROGRESS = {
    'success_or_failure': 0.0,
    'success_could_talk': 0.2,
    'success_call_back': 0.4,
    'failure_reason': 0.2,
    'failure_message': 0.4,
    'caller_log': 0.6,
    'organizer_log': 0.8,
    'summary': 1.0,
};


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
            progress: 0.0,
        };

        return state
            .set('nextLaneNumber', laneNumber + 1)
            .set('selectedId', lane.id)
            .setIn(['allLanes', lane.id], immutable.fromJS(lane));
    },

    [types.RETRIEVE_ALLOCATED_CALLS + '_FULFILLED']: (state, action) => {
        let lanes = {};
        let laneNumber = state.get('nextLaneNumber');

        action.payload.data.data.forEach(call => {
            let id = (laneNumber++).toString();
            lanes[id] = {
                id: id,
                callId: call.id.toString(),
                infoMode: 'instructions',
                step: 'prepare',
                isPending: false,
                progress: 0.0,
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
            .setIn(['allLanes', laneId, 'progress'], 0.1)
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
            progress: 0.0,
            step: 'prepare',
        };

        return state
            .set('nextLaneNumber', laneNumber)
            .set('selectedId', laneId)
            .setIn(['allLanes', laneId], immutable.fromJS(lane));
    },

    [types.DEALLOCATE_CALL + '_FULFILLED']: (state, action) => {
        let callId = action.meta.callId.toString();
        let laneId = state.get('allLanes')
            .findKey(lane => lane.get('callId') == callId);

        return state
            .deleteIn(['allLanes', laneId]);
    },

    [types.SUBMIT_CALL_REPORT + '_FULFILLED']: (state, action) => {
        let laneId = state.get('selectedId');

        return state
            .setIn(['allLanes', laneId, 'progress'], 1.0)
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
        let progress = 0;

        switch (step) {
            case 'call':    progress = 0.3; break;
            case 'report':  progress = 0.8; break;
            case 'done':    progress = 1.0; break;
        }

        return state
            .setIn(['allLanes', laneId, 'progress'], progress)
            .setIn(['allLanes', laneId, 'step'], step);
    },

    [types.SET_CALL_REPORT_FIELD]: (state, action) => {
        let { call, field, value } = action.payload;
        let callId = call.get('id').toString();
        let lane = laneByCallId(state, callId);
        let laneId = lane.get('id');
        let nextStep;

        if (field === 'success' && value) {
            nextStep = 'success_could_talk';
        }
        else if (field === 'targetCouldTalk' && value) {
            nextStep = 'caller_log';
        }
        else if (field === 'targetCouldTalk' && !value) {
            nextStep = 'success_call_back';
        }
        else if (field === 'callBackAfter') {
            nextStep = 'caller_log';
        }
        else if (field === 'success') {
            nextStep = 'failure_reason';
        }
        else if (field === 'failureReason' && value === "noPickup") {
            nextStep = 'failure_message';
        }
        else if (field === 'failureReason') {
            nextStep = 'caller_log';
        }
        else if (field === 'leftMessage') {
            nextStep = 'caller_log';
        }
        else if (field === 'organizerActionNeeded' && value) {
            nextStep = 'organizer_log';
        }
        else if (field === 'organizerActionNeeded') {
            nextStep = 'summary';
        }

        let reportProgress = REPORT_STEP_PROGRESS[nextStep];
        let progress = 0.8 + reportProgress * 0.15;

        return state
            .setIn(['allLanes', laneId, 'progress'], progress);
    },

    [types.SET_CALL_REPORT_STEP]: (state, action) => {
        let step = action.payload.step;
        let callId = action.payload.call.get('id').toString();
        let lane = laneByCallId(state, callId);
        let laneId = lane.get('id');

        let reportProgress = REPORT_STEP_PROGRESS[step];
        let progress = 0.8 + reportProgress * 0.15;

        return state
            .setIn(['allLanes', laneId, 'progress'], progress);
    },

    [types.SWITCH_LANE_TO_CALL]: (state, action) => {
        let callId = action.payload.callId.toString();
        let lane = laneByCallId(state, callId);

        let laneId = lane.get('id');

        return state
            .set('selectedId', laneId);
    },

    [types.UPDATE_ACTION_RESPONSE + '_FULFILLED']: (state, action) => {
        // Update progress for positive action responses
        if (action.meta.responseBool) {
            let laneId = state.get('selectedId');
            let initial = state.getIn(['allLanes', laneId, 'progress']);

            // Progress is increased towards 80%, but the pace decreases
            // with each iteration, so that it never reaches until the
            // user proceeds to the next step.
            let diff = 0.8 - initial;
            let progress = initial + 0.05 * diff;

            return state
                .setIn(['allLanes', laneId, 'progress'], progress);
        }
        else {
            return state;
        }
    },
});
