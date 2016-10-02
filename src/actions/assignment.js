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

export function selectAssignment(assignment) {
    return {
        type: types.SELECT_ASSIGNMENT,
        payload: { assignment },
    };
}
