import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';

export const organization = (state, id) => {
    let items = state.getIn(['orgs', 'orgList', 'items']);
    if (items) {
        return items.get(id.toString()) || items.find(o => o.get('slug') == id.toString());
    }
    else return null;
}

const initialState = immutable.fromJS({
    orgList: {
        isPending: false,
        error: null,
        items: null,
    }
});

export default createReducer(initialState, {
    [types.RETRIEVE_USER_MEMBERSHIPS + '_FULFILLED']: (state, action) => {
        let items = {};
        action.payload.data.data.forEach(membership => {
            items[parseInt(membership.organization.id)] = membership.organization;
        })

        return immutable.fromJS({
            orgList: {
                isPending: false,
                error: null,
                items: items,
            }
        });
    },
});
