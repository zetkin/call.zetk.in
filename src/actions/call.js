import * as types from '.';

import { currentCall, reportForCallById } from '../store/calls';
import { assignmentById } from '../store/assignments';


export function retrieveUserCalls() {
    return ({ dispatch, getState, z }) => {
        dispatch({
            type: types.RETRIEVE_USER_CALLS,
            payload: {
                promise: z.resource('users', 'me', 'outgoing_calls')
                    .get(0, 40),
            }
        });
    };
}

export function retrieveAllocatedCalls() {
    return ({ dispatch, getState, z }) => {
        dispatch({
            type: types.RETRIEVE_ALLOCATED_CALLS,
            payload: {
                promise: z.resource('users', 'me', 'outgoing_calls')
                    .get(null, null, [[ 'state', '==', 0 ]]),
            }
        });
    }
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
            meta: { orgId, assignmentId, targetId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'call_assignments', assignmentId, 'calls').post(data)
            }
        });
    };
}

export function deallocateCall(call) {
    return ({ dispatch, z }) => {
        let callId = call.get('id');
        let orgId = call.get('organization_id');

        dispatch({
            type: types.DEALLOCATE_CALL,
            meta: { callId },
            payload: {
                promise: z.resource('orgs', orgId, 'calls', callId).del()
            },
        });
    };
}

export function skipCall(call) {
    return ({ dispatch, z }) => {
        let prevCallId = call.get('id');
        let assignmentId = call.get('assignment_id');
        let orgId = call.get('organization_id');

        dispatch({
            type: types.SKIP_CALL,
            meta: { orgId, prevCallId },
            payload: {
                promise: z.resource('orgs', orgId, 'calls', prevCallId).del()
                    .then(res => {
                        // Request new call from queue
                        return z.resource('orgs', orgId,
                            'call_assignments', assignmentId,
                            'queue', 'head').post()
                    }),
            }
        });
    };
}

export function setCallReportField(call, field, value) {
    return {
        type: types.SET_CALL_REPORT_FIELD,
        payload: { call, field, value },
    };
}

export function setCallReportStep(call, step) {
    return {
        type: types.SET_CALL_REPORT_STEP,
        payload: { call, step },
    };
}

export function setCallerLogMessage(call, message) {
    return {
        type: types.SET_CALLER_LOG_MESSAGE,
        payload: { call, message }
    }
}

export function setOrganizerLogMessage(call, message) {
    return {
        type: types.SET_ORGANIZER_LOG_MESSAGE,
        payload: { call, message }
    }
}

export function finishCallReport(call) {
    return {
        type: types.FINISH_CALL_REPORT,
        payload: { call },
    }
}

export function submitCallReport() {
    return ({ dispatch, getState, z }) => {
        let state = getState();
        let call = currentCall(state);
        let callId = call.get('id');
        let report = reportForCallById(state, callId);

        let data = {
            notes: report.get('callerLog'),
            message_to_organizer: report.get('organizerLog'),
            organizer_action_needed: report.get('organizerActionNeeded'),
        };

        if (report.get('success')) {
            if (report.get('targetCouldTalk')) {
                // Successful call!
                data.state = 1;
            }
            else {
                // Failed, call_back_after set
                data.state = 13;

                let date = new Date();
                date.setUTC(true);

                // Fast forward CBA date if not "ASAP"
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
        else if (report.get('failureReason') == 'notAvailable') {
            data.state = 14;

            let date = new Date();
            date.setUTC(true);

            switch (report.get('callBackAfter')) {
                case 'fewDays':
                    date.advance('2 days');
                    data.call_back_after = date.iso();
                    break;
                case 'oneWeek':
                    date.advance('7 days');
                    data.call_back_after = date.iso();
                    break;
                case 'twoWeeks':
                    date.advance('14 days');
                    data.call_back_after = date.iso();
                    break;
            }
        }
        else if (report.get('leftMessage')) {
            data.state = 15;
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

        let promises = [
            z.resource('orgs', orgId, 'calls', callId).patch(data)
        ];

        // Figure out whether there are surveys that need to be submitted
        let pendingSubmissions = state
            .getIn(['surveys', 'pendingResponsesByCall', callId]);

        if (pendingSubmissions) {
            let includedSubmissions = pendingSubmissions
                .filter(survey => survey.get('included'))
                .toList();

            if (includedSubmissions.size) {
                includedSubmissions.forEach(sub => {
                    let surveyId = sub.get('surveyId');
                    let responses = sub.get('responses').map((res, elemId) => {
                        let response = {
                            // TODO: Don't parseInt() when once migrated to string IDs
                            question_id: parseInt(elemId),
                        };

                        if (res.get('options')) {
                            response.options = res.get('options')
                                .toJS().map(id => parseInt(id)); // TODO: Don't parseInt
                        }

                        if (res.get('response')) {
                            response.response = res.get('response');
                        }

                        return response;
                    });

                    let data = {
                        // TODO: Include target as signature
                        signature: null,
                        responses: responses.toList().toJS(),
                    };

                    promises.push(z.resource('orgs', orgId,
                        'surveys', surveyId, 'submissions').post(data));
                });
            }
        }

        dispatch({
            type: types.SUBMIT_CALL_REPORT,
            meta: { callId },
            payload: {
                promise: Promise.all(promises)
            }
        });
    };
}

export function endCallSession() {
    return ({ dispatch, getState, z }) => {
        let call = currentCall(getState());

        if (call) {
            let callId = call.get('id');
            let orgId = call.get('organization_id');

            // Delete call before continuing
            dispatch({
                type: types.END_CALL_SESSION,
                meta: { callId },
                payload: {
                    promise: z.resource('orgs', orgId, 'calls', callId).del(),
                }
            });
        }
        else {
            // No call to delete.
            dispatch({
                type: types.END_CALL_SESSION,
            });
        }
    };
}
