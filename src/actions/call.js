import * as types from '.';

import { currentCall, reportForCall } from '../store/calls';
import { assignmentById } from '../store/assignments';


export function retrieveUserCalls() {
    return ({ dispatch, getState, z }) => {
        dispatch({
            type: types.RETRIEVE_USER_CALLS,
            payload: {
                promise: z.resource('users', 'me', 'calls').get(),
            }
        });
    };
}

export function startNewCall(assignment) {
    return ({ dispatch, getState, z }) => {
        let orgId = assignment.get('organization_id');
        let assignmentId = assignment.get('id');

        dispatch({
            type: types.START_NEW_CALL,
            meta: { orgId, assignmentId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'call_assignments', assignmentId, 'queue', 'head').post()
            }
        });
    };
}

export function startCallWithTarget(assignmentId, targetId) {
    return ({ dispatch, getState, z }) => {
        let state = getState();
        let assignment = assignmentById(state, assignmentId);
        let orgId = assignment.get('organization_id');
        let data = { target_id: targetId };

        dispatch({
            type: types.START_CALL_WITH_TARGET,
            meta: { assignmentId, targetId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'call_assignments', assignmentId, 'calls').post(data)
            }
        });
    };
}

export function setCallReportField(field, value) {
    return {
        type: types.SET_CALL_REPORT_FIELD,
        payload: { field, value },
    };
}

export function setCallReportStep(step) {
    return {
        type: types.SET_CALL_REPORT_STEP,
        payload: { step },
    };
}

export function setCallerLogMessage(message) {
    return {
        type: types.SET_CALLER_LOG_MESSAGE,
        payload: { message }
    }
}

export function setOrganizerLogMessage(message) {
    return {
        type: types.SET_ORGANIZER_LOG_MESSAGE,
        payload: { message }
    }
}

export function finishCallReport() {
    return {
        type: types.FINISH_CALL_REPORT,
    }
}

export function submitCallReport() {
    return ({ dispatch, getState, z }) => {
        let state = getState();
        let call = currentCall(state);
        let callId = call.get('id');
        let report = reportForCall(state, callId);

        let data = {
            notes: report.get('callerLog'),
            organizer_action_needed: report.get('organizerActionNeeded'),
        };

        // TODO: Respect "leftMessage" once API supports it
        // TODO: Send along organizerLog once API supports it
        if (report.get('success')) {
            if (report.get('targetCouldTalk')) {
                // Successful call!
                data.state = 1;
            }
            else if (report.get('callBackAfter') === 'asap') {
                // Failed: call back later
                data.state = 13;
            }
            else {
                // Success, but with call_back_after set
                data.state = 1;

                let date = new Date();
                date.setUTC(true);

                switch (report.get('callBackAfter')) {
                    case 'fewDays':
                        date.advance('2 days');
                        break;
                    case 'oneWeek':
                        date.advance('7 days');
                        break;
                    case 'twoWeeks':
                        date.advance('14 days');
                        break;
                }

                data.call_back_after = date.iso();
            }
        }
        else {
            switch (report.get('failureReason')) {
                case 'noPickup':    data.state = 11;    break;
                case 'lineBusy':    data.state = 12;    break;
                case 'wrongNumber': data.state = 21;    break;
            }
        }

        let assignment = assignmentById(state, call.get('assignment_id'))
        let orgId = assignment.get('organization_id');

        dispatch({
            type: types.SUBMIT_CALL_REPORT,
            meta: { callId },
            payload: {
                promise: z.resource('orgs', orgId, 'calls', callId).patch(data)
            }
        });
    };
}
