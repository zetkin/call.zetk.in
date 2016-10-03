import * as types from '.';


export function retrieveUserAssignments() {
    return ({ dispatch, z }) => {
        dispatch({
            type: types.RETRIEVE_USER_ASSIGNMENTS,
            payload: {
                promise: z.resource('users', 'me', 'call_assignments').get()
            }
        });
    };
}

export function retrieveAssignmentStats(assignment) {
    let orgId = assignment.get('organization_id');
    let assignmentId = assignment.get('id');

    return ({ dispatch, z }) => {
        dispatch({
            type: types.RETRIEVE_ASSIGNMENT_STATS,
            meta: { orgId, assignmentId },
            payload: {
                promise: z.resource('orgs', orgId,
                    'call_assignments', assignmentId, 'stats').get(),
            }
        });
    };
}

export function selectAssignment(assignmentId) {
    return {
        type: types.SELECT_ASSIGNMENT,
        payload: { assignmentId },
    };
}
