import * as types from '.';
import { currentCall } from '../store/calls';
import { assignmentById } from '../store/assignments';


export function retrieveCampaigns() {
    return ({ dispatch, getState, z }) => {
        let call = currentCall(getState());
        let assignment = assignmentById(getState(), call.get('assignment_id'));
        let orgId = assignment.get('organization_id');

        dispatch({
            type: types.RETRIEVE_CAMPAIGNS,
            meta: { orgId },
            payload: {
                promise: z.resource('orgs', orgId, 'campaigns').get()
            }
        });
    };
}
