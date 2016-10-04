import * as types from '.';


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

export function setCallReportField(field, value) {
    return {
        type: types.SET_CALL_REPORT_FIELD,
        payload: { field, value },
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
