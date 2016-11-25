import * as types from '.';
import { currentCall } from '../store/calls';
import { assignmentById } from '../store/assignments';


export function retrieveActions() {
    return ({ dispatch, getState, z }) => {
        let call = currentCall(getState());
        let assignment = assignmentById(getState(), call.get('assignment_id'));
        let orgId = assignment.get('organization_id');
        let today = new Date().format('{yyyy}-{MM}-{dd}');

        dispatch({
            type: types.RETRIEVE_ACTIONS,
            meta: { orgId },
            payload: {
                promise: z.resource('orgs', orgId, 'actions')
                    .get(null, null, [[ 'start_time', '>', today ]])
            }
        });
    };
}

export function updateActionResponse(action, responseBool) {
    return ({ dispatch, getState, z }) => {
        let orgId = action.get('org_id');
        let actionId = action.get('id');

        // Find target personId from current call
        let call = currentCall(getState());
        let personId = call.getIn(['target', 'id']);

        let resource = z.resource('orgs', orgId, 'actions', actionId,
                'responses', personId);

        dispatch({
            type: types.UPDATE_ACTION_RESPONSE,
            meta: { actionId, responseBool },
            payload: {
                // PUT or DELETE depending on whether response is yes or no
                promise: (responseBool? resource.put() : resource.del()),
            }
        });
    };
}
