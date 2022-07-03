import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';
import { selectedAssignment } from './assignments';


export const selectedAssignmentCallerProfile = state => {
    const assignment = selectedAssignment(state);
    if (assignment) {
        const orgId = assignment.getIn(['organization', 'id']);
        const profile = state.getIn(['user', 'membershipList', 'items', orgId.toString(), 'profile']);
        return profile;
    }
    else {
        return null;
    }
};

const initialState = immutable.fromJS({
    isPending: false,
    data: null,
    membershipList: {
        isPending: false,
        error: null,
        items: null,
    },
});


export default createReducer(initialState, {
    [types.RETRIEVE_USER_MEMBERSHIPS + '_PENDING']: (state, action) => {
        return state
            .setIn(['membershipList', 'error'], null)
            .setIn(['membershipList', 'isPending'], true);
    },

    [types.RETRIEVE_USER_MEMBERSHIPS + '_FULFILLED']: (state, action) => {
        let memberships = {};

        action.payload.data.data.forEach(membership =>
            memberships[membership.organization.id] = membership);

        return state
            .setIn(['membershipList', 'error'], null)
            .setIn(['membershipList', 'isPending'], false)
            .updateIn(['membershipList', 'items'], items => items?
                items.merge(immutable.fromJS(memberships)) :
                immutable.fromJS(memberships));
    },

    [types.SET_USER_DATA]: (state, action) => {
        return state
            .set('data', immutable.fromJS(action.payload));
    },
});
