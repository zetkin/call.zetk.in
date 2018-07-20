import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';
import { selectedLane } from './lanes';


export const activeCalls = state =>
    state.getIn(['calls', 'activeCalls']).map(callId =>
        state.getIn(['calls', 'callList', 'items', callId]));

export const currentCall = state => {
    let lane = selectedLane(state);
    let id = lane.get('callId');
    return state.getIn(['calls', 'callList', 'items', id]);
};

export const currentReport = state => {
    let call = currentCall(state);
    if (!call) return null;
    return reportForCallById(state, call.get('id'));
}

export const reportForCallById = (state, id) => {
    if (!id) return null;
    return state.getIn(['calls', 'reports', id.toString()]);
};


const initialState = immutable.Map({
    currentIsPending: false,
    callList: immutable.Map({
        error: null,
        isPending: false,
        items: null,
    }),
    reports: immutable.Map({}),
    activeCalls: immutable.Set(),
});

export const REPORT_STEPS = [
    'success_or_failure',
    'success_could_talk',
    'failure_reason',
    'failure_message',
    'call_back',
    'organizer_action',
    'organizer_log',
    'caller_log',
    'summary',
];


export default createReducer(initialState, {
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
                items.mergeDeep(immutable.fromJS(calls)) :
                immutable.fromJS(calls));
    },

    [types.RETRIEVE_ALLOCATED_CALLS + '_FULFILLED']: (state, action) => {
        let calls = {};
        let callIds = [];
        action.payload.data.data.forEach(call => {
            let id = call.id.toString();
            callIds.push(id);
            calls[id] = call
        });

        return state
            .setIn(['callList', 'error'], null)
            .setIn(['callList', 'isPending'], false)
            .updateIn(['activeCalls'], list =>
                list.union(immutable.fromJS(callIds)))
            .updateIn(['callList', 'items'], items => items?
                items.mergeDeep(immutable.fromJS(calls)) :
                immutable.fromJS(calls));
    },

    [types.START_NEW_CALL + '_PENDING']: (state, action) => {
        return state
            .set('currentIsPending', true);
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        let call = Object.assign(action.payload.data.data, {
            organization_id: action.meta.orgId,
        });
        let callId = call.id.toString();

        return state
            .set('currentIsPending', false)
            .update('activeCalls', list => list.push(callId))
            .updateIn(['callList', 'items'], items => items?
                items.set(callId, immutable.fromJS(call)) :
                immutable.fromJS({ [callId]: call }));
    },

    [types.START_NEW_CALL + '_REJECTED']: (state, action) => {
        return state
            .set('currentIsPending', false);
    },

    [types.START_CALL_WITH_TARGET + '_PENDING']: (state, action) => {
        return state
            .set('currentIsPending', true);
    },

    [types.START_CALL_WITH_TARGET + '_FULFILLED']: (state, action) => {
        let call = Object.assign(action.payload.data.data, {
            organization_id: action.meta.orgId,
        });
        let callId = call.id.toString();

        return state
            .set('currentIsPending', false)
            .update('activeCalls', list => list.push(callId))
            .updateIn(['callList', 'items'], items => items?
                items.set(callId, immutable.fromJS(call)) :
                immutable.fromJS({ [callId]: call }));
    },

    [types.DEALLOCATE_CALL + '_FULFILLED']: (state, action) => {
        let callId = action.meta.callId.toString();
        let activeIndex = state.get('activeCalls').indexOf(callId);
        return state
            .deleteIn(['callList', 'items', callId])
            .deleteIn(['activeCalls', activeIndex]);
    },

    [types.SKIP_CALL + '_PENDING']: (state, action) => {
        return state
            .set('currentIsPending', true)
    },

    [types.SKIP_CALL + '_FULFILLED']: (state, action) => {
        let call = Object.assign(action.payload.data.data, {
            organization_id: action.meta.orgId,
        });

        let callId = call.id.toString();
        let prevCallId = action.meta.prevCallId.toString();
        let activeIndex = state.get('activeCalls').indexOf(prevCallId);

        return state
            .set('currentIsPending', false)
            .deleteIn(['callList', 'items', prevCallId])
            .deleteIn(['activeCalls', activeIndex])
            .update('activeCalls', list => list.push(callId))
            .updateIn(['callList', 'items'], items => items?
                items.set(callId, immutable.fromJS(call)) :
                immutable.fromJS({ [callId]: call }));
    },

    [types.SKIP_CALL + '_REJECTED']: (state, action) => {
        return state
            .set('currentIsPending', false)
    },

    [types.END_CALL_SESSION + '_FULFILLED']: (state, action) => {
        return state
            .set('activeCalls', immutable.List());
    },

    [types.SET_LANE_STEP]: (state, action) => {
        let step = action.payload.step;
        let callId = action.payload.lane.get('callId');
        let report = state.getIn(['reports', callId]);

        // Create an empty report for current call when navigating
        // to the "call" lane step, if there is none already.
        if (step === 'call' && !report) {
            const assignment = action.payload.assignment;

            return state
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
                    disableCallerNotes: assignment.get('disable_caller_notes'),
                }));
        }
        else {
            return state;
        }
    },

    [types.SET_CALL_REPORT_FIELD]: (state, action) => {
        let { call, field, value } = action.payload;
        let callId = call.get('id').toString();
        let nextStep;

        if (field === 'success' && value) {
            nextStep = 'success_could_talk';
        }
        else if (field === 'targetCouldTalk' && value) {
            nextStep = 'organizer_action';
        }
        else if (field === 'targetCouldTalk' && !value) {
            nextStep = 'call_back';
        }
        else if (field === 'callBackAfter') {
            nextStep = 'organizer_action';
        }
        else if (field === 'success') {
            nextStep = 'failure_reason';
        }
        else if (field === 'failureReason') {
            if (value === "noPickup") {
                nextStep = 'failure_message';
            }
            else if (value === "notAvailable") {
                nextStep = 'call_back';
            }
            else if (value === 'wrongNumber') {
                nextStep = 'organizer_log';
                state = state.updateIn(['reports', callId], report => report
                    .set('organizerActionNeeded', true));
            }
            else {
                nextStep = 'organizer_action';
            }
        }
        else if (field === 'leftMessage') {
            nextStep = 'organizer_action';
        }
        else if (field === 'organizerActionNeeded' && value) {
            nextStep = 'organizer_log';
        }
        else if (field === 'organizerActionNeeded') {
            nextStep = 'caller_log';
        }

        return state
            .updateIn(['reports', callId], report => report
                .set(field, value)
                .set('step', nextStep));
    },

    [types.SET_CALL_REPORT_STEP]: (state, action) => {
        let step = action.payload.step;
        let callId = action.payload.call.get('id').toString();

        return state
            .setIn(['reports', callId, 'step'], step);
    },

    [types.SET_CALLER_LOG_MESSAGE]: (state, action) => {
        let msg = action.payload.message;
        let callId = action.payload.call.get('id').toString();

        return state
            .setIn(['reports', callId, 'callerLog'], msg);
    },

    [types.SET_ORGANIZER_LOG_MESSAGE]: (state, action) => {
        let msg = action.payload.message;
        let callId = action.payload.call.get('id').toString();

        return state
            .setIn(['reports', callId, 'organizerLog'], msg);
    },

    [types.FINISH_CALL_REPORT]: (state, action) => {
        let callId = action.payload.call.get('id').toString();

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
            .setIn(['reports', callId, 'isPending'], false)
            .updateIn(['callList', 'items', callId], call => call
                .mergeDeep(call))
            .update('activeCalls', list => {
                let key = list.findKey(val => val === callId);
                return list.delete(key);
            });
    },
});
