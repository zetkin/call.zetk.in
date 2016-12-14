import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


export const selectedAssignment = state => {
    let id = state.getIn(['assignments', 'selectedId']);
    if (!id) return null;

    return state.getIn(
        ['assignments', 'assignmentList', 'items', id.toString()]);
}

export const assignmentById = (state, id) =>
    state.getIn(['assignments', 'assignmentList', 'items', id.toString()]);


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

    [types.RETRIEVE_ASSIGNMENT_STATS + '_PENDING']: (state, action) => {
        let caId = action.meta.assignmentId.toString();

        return state
            .updateIn(['assignmentList', 'items', caId], ca => ca
                .set('statsIsPending', true));
    },

    [types.RETRIEVE_ASSIGNMENT_STATS + '_FULFILLED']: (state, action) => {
        let caId = action.meta.assignmentId.toString();
        let stats = action.payload.data.data;

        return state
            .updateIn(['assignmentList', 'items', caId], ca => ca
                .set('statsIsPending', false)
                .set('stats', immutable.fromJS(stats)));
    },

    [types.SELECT_ASSIGNMENT]: (state, action) => {
        return state
            .set('selectedId', action.payload.assignmentId);
    },
});
