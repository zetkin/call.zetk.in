import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const activeCalls = state =>
    state.getIn(['calls', 'activeCalls']).map(callId =>
        state.getIn(['calls', 'callList', 'items', callId]));

export const currentCall = state => {
    let id = state.getIn(['calls', 'currentId']);
    return state.getIn(['calls', 'callList', 'items', id]);
};

export const currentReport = state =>
    reportForCall(state, state.getIn(['calls', 'currentId']));

export const reportForCall = (state, id) => {
    if (!id) return null;
    return state.getIn(['calls', 'reports', id.toString()]);
};


const initialState = immutable.fromJS({
    currentId: null,
    currentIsPending: false,
    callList: {
        error: null,
        isPending: false,
        items: null,
    },
    reports: {},
    activeCalls: [],
});

export const REPORT_STEPS = [
    'success_or_failure',
    'success_could_talk',
    'success_call_back',
    'failure_reason',
    'failure_message',
    'caller_log',
    'organizer_log',
    'summary',
];

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
    ['@@INIT']: (state, action) => {
        return immutable.fromJS(state);
    },

    [types.RETRIEVE_USER_CALLS + '_PENDING']: (state, action) => {
        return state
            .setIn(['callList', 'error'], null)
            .setIn(['callList', 'isPending'], true);
    },

    [types.RETRIEVE_USER_CALLS + '_REJECTED']: (state, action) => {
        return state
            .setIn(['callList', 'isPending'], false)
            .setIn(['callList', 'error'], action.payload.data);
    },

    [types.RETRIEVE_USER_CALLS + '_FULFILLED']: (state, action) => {
        let calls = {};
        action.payload.data.data.forEach(call =>
            calls[call.id.toString()] = call);

        return state
            .setIn(['callList', 'error'], null)
            .setIn(['callList', 'isPending'], false)
            .updateIn(['callList', 'items'], items => items?
                items.merge(immutable.fromJS(calls)) :
                immutable.fromJS(calls));
    },

    [types.START_NEW_CALL + '_PENDING']: (state, action) => {
        return state
            .set('currentIsPending', true);
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        let call = action.payload.data.data;
        let callId = call.id.toString();

        // Progress at prepare step is 0.1
        call.progress = 0.1;

        return state
            .set('currentId', callId)
            .set('currentIsPending', false)
            .update('activeCalls', list => list.push(callId))
            .updateIn(['callList', 'items'], items => items?
                items.set(callId, immutable.fromJS(call)) :
                immutable.fromJS({ [callId]: call }));
    },

    [types.START_CALL_WITH_TARGET + '_PENDING']: (state, action) => {
        return state
            .set('currentIsPending', true);
    },

    [types.START_CALL_WITH_TARGET + '_FULFILLED']: (state, action) => {
        let call = action.payload.data.data;
        let callId = call.id.toString();

        return state
            .set('currentId', callId)
            .set('currentIsPending', false)
            .update('activeCalls', list => list.push(callId))
            .updateIn(['callList', 'items'], items => items?
                items.set(callId, immutable.fromJS(call)) :
                immutable.fromJS({ [callId]: call }));
    },

    [types.SET_LANE_STEP]: (state, action) => {
        let step = action.payload.step;
        let callId = state.get('currentId');

        // Create an empty report for current call when navigating
        // to the "report" lane step.
        if (step === 'report') {
            state = state
                .setIn(['reports', callId], immutable.fromJS({
                    step: REPORT_STEPS[0],
                    success: false,
                    targetCouldTalk: false,
                    callBackAfter: null,
                    failureReason: null,
                    leftMessage: false,
                    callerLog: '',
                    organizerActionNeeded: false,
                    organizerLog: '',
                }));
        }

        let progress = 0;

        switch (step) {
            case 'call':    progress = 0.3; break;
            case 'report':  progress = 0.8; break;
            case 'done':    progress = 1.0; break;
        }

        return state
            .setIn(['allCalls', callId, 'progress'], progress);
    },

    [types.SET_CALL_REPORT_FIELD]: (state, action) => {
        let { field, value } = action.payload;
        let callId = state.get('currentId');
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
            .setIn(['allCalls', callId, 'progress'], progress)
            .updateIn(['reports', callId], report => report
                .set(field, value)
                .set('step', nextStep));
    },

    [types.SET_CALL_REPORT_STEP]: (state, action) => {
        let step = action.payload.step;
        let callId = state.get('currentId');

        let reportProgress = REPORT_STEP_PROGRESS[step];
        let progress = 0.8 + reportProgress * 0.15;

        return state
            .setIn(['allCalls', callId, 'progress'], progress)
            .setIn(['reports', callId, 'step'], step);
    },

    [types.SET_CALLER_LOG_MESSAGE]: (state, action) => {
        let msg = action.payload.message;
        let callId = state.get('currentId');

        return state
            .setIn(['reports', callId, 'callerLog'], msg);
    },

    [types.SET_ORGANIZER_LOG_MESSAGE]: (state, action) => {
        let msg = action.payload.message;
        let callId = state.get('currentId');

        return state
            .setIn(['reports', callId, 'organizerLog'], msg);
    },

    [types.FINISH_CALL_REPORT]: (state, action) => {
        let callId = state.get('currentId');

        return state
            .setIn(['reports', callId, 'step'], 'summary');
    },

    [types.SUBMIT_CALL_REPORT + '_PENDING']: (state, action) => {
        let callId = action.meta.callId.toString();

        return state
            .setIn(['reports', callId, 'isPending'], true);
    },

    [types.SUBMIT_CALL_REPORT + '_ERROR']: (state, action) => {
        let callId = action.meta.callId.toString();
        let error = action.payload.data;

        return state
            .setIn(['reports', callId, 'error'], immutable.fromJS(error));
    },

    [types.SUBMIT_CALL_REPORT + '_FULFILLED']: (state, action) => {
        let call = action.payload.data.data;
        let callId = action.meta.callId.toString();

        return state
            .setIn(['allCalls', callId, 'progress'], 1.0)
            .setIn(['reports', callId, 'isPending'], false)
            .mergeIn(['callList', 'items', callId], immutable.fromJS(call))
            .update('activeCalls', list => {
                let key = list.findKey(val => val === callId);
                return list.delete(key);
            });
    },

    [types.UPDATE_ACTION_RESPONSE + '_FULFILLED']: (state, action) => {
        // Update progress for positive action responses
        if (action.meta.responseBool) {
            let callId = state.get('currentId');
            let initial = state.getIn(['allCalls', callId, 'progress']);

            // Progress is increased towards 80%, but the pace decreases
            // with each iteration, so that it never reaches until the
            // user proceeds to the next step.
            let diff = 0.8 - initial;
            let progress = initial + 0.05 * diff;

            return state
                .setIn(['allCalls', callId, 'progress'], progress);
        }
        else {
            return state;
        }
    },
});
