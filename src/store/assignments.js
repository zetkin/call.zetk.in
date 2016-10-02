import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import {
    RETRIEVE_USER_ASSIGNMENTS,
} from '../actions';


const initialState = immutable.fromJS({
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

    [RETRIEVE_USER_ASSIGNMENTS + '_PENDING']: (state, action) => {
        return state
            .setIn(['assignmentList', 'error'], null)
            .setIn(['assignmentList', 'isPending'], true);
    },

    [RETRIEVE_USER_ASSIGNMENTS + '_FULFILLED']: (state, action) => {
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
});
