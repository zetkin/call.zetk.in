import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const selectedAssignment = state => {
    let id = state.getIn(['assignments', 'selectedId']).toString();
    return state.getIn(['assignments', 'assignmentList', 'items', id]);
}

const initialState = immutable.fromJS({
    selectedId: null,
    assignmentList: {
        isPending: false,
        error: null,
        items: null,
    },
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.RETRIEVE_USER_ASSIGNMENTS + '_PENDING']: (state, action) => {
        return state
            .setIn(['assignmentList', 'error'], null)
            .setIn(['assignmentList', 'isPending'], true);
    },

    [types.RETRIEVE_USER_ASSIGNMENTS + '_FULFILLED']: (state, action) => {
        let assignments = {};
        action.payload.data.data.forEach(assignment =>
            assignments[assignment.id] = assignment);

        return state
            .setIn(['assignmentList', 'error'], null)
            .setIn(['assignmentList', 'isPending'], false)
            .updateIn(['assignmentList', 'items'], items => items?
                items.merge(immutable.fromJS(assignments)) :
                immutable.fromJS(assignments));
    },

    [types.SELECT_ASSIGNMENT]: (state, action) => {
        return state
            .set('selectedId', action.payload.assignmentId);
    },
});
