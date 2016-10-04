import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const currentCall = state => {
    let id = state.getIn(['calls', 'currentId']);
    return state.getIn(['calls', 'activeCalls', id]);
};

const initialState = {
    currentId: null,
    currentIsPending: false,
    activeCalls: {},
};

export const REPORT_STEPS = [
    'success_or_failure',
    'success_callback',
    'failure_reason',
    'failure_message',
    'caller_log',
    'organizer_log',
    'complete',
];


export default createReducer(initialState, {
    ['@@INIT']: (state, action) => {
        return immutable.fromJS(state);
    },

    [types.START_NEW_CALL + '_PENDING']: (state, action) => {
        return state
            .set('currentIsPending', true);
    },

    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        let call = action.payload.data.data;
        let callId = call.id.toString();

        return state
            .set('currentId', callId)
            .set('currentIsPending', false)
            .setIn(['activeCalls', callId], immutable.fromJS(call))
    },

    [types.SET_LANE_STEP]: (state, action) => {
        let step = action.payload.step;
        let callId = state.get('currentId');

        // Create an empty report for current call when navigating
        // to the "report" lane step.
        if (step === 'report') {
            return state
                .setIn(['activeCalls', callId, 'report'], immutable.fromJS({
                    step: REPORT_STEPS[0],
                    success: false,
                    failureReason: null,
                    leftMessage: false,
                    callerLog: null,
                    organizerActionNeeded: false,
                    organizerLog: null,
                }));
        }
        else {
            return state;
        }
    },

    [types.SET_CALL_REPORT_FIELD]: (state, action) => {
        let { field, value } = action.payload;
        let callId = state.get('currentId');
        let nextStep;

        if (field === 'success' && value) {
            nextStep = 'success_callback';
        }
        else if (field === 'success') {
            nextStep = 'failure_reason';
        }

        return state
            .updateIn(['activeCalls', callId, 'report'], report => report
                .set(field, value)
                .set('step', nextStep));
    },
});
