import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


const initialState = immutable.fromJS({
    campaignList: {
        isPending: false,
        error: null,
        items: null,
    }
});

export default createReducer(initialState, {
    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        // Reset when new call starts
        return state
            .setIn(['campaignList', 'error'], null)
            .setIn(['campaignList', 'isPending'], false)
            .setIn(['campaignList', 'items'], immutable.Map());
    },

    [types.RETRIEVE_CAMPAIGNS + '_PENDING']: (state, action) => {
        return state
            .setIn(['campaignList', 'error'], null)
            .setIn(['campaignList', 'isPending'], true);
    },

    [types.RETRIEVE_CAMPAIGNS + '_FULFILLED']: (state, action) => {
        let campaigns = {};
        action.payload.data.data.forEach(obj => {
            campaigns[obj.id.toString()] = Object.assign(obj, {
                org_id: action.meta.orgId,
            });
        });

        return state
            .setIn(['campaignList', 'error'], null)
            .setIn(['campaignList', 'isPending'], false)
            .updateIn(['campaignList', 'items'], items => items?
                items.merge(immutable.fromJS(campaigns)) :
                immutable.fromJS(campaigns));
    },

    [types.RETRIEVE_CAMPAIGN + '_PENDING']: (state, action) => {
        let campaign = {
            id: action.meta.campaignId.toString(),
            org_id: action.meta.orgId.toString(),
            isPending: true,
        };

        return state
            .updateIn(['campaignList', 'items'], items => items?
                items.set(campaign.id, immutable.fromJS(campaign)) :
                immutable.fromJS({ [campaign.id]: campaign }));
    },

    [types.RETRIEVE_CAMPAIGN + '_REJECTED']: (state, action) => {
        let campaign = {
            id: action.meta.campaignId.toString(),
            org_id: action.meta.orgId.toString(),
            error: action.payload.data,
            isPending: false,
        };

        return state
            .updateIn(['campaignList', 'items'], items => items?
                items.set(campaign.id, immutable.fromJS(campaign)) :
                immutable.fromJS({ [campaign.id]: campaign }));
    },

    [types.RETRIEVE_CAMPAIGN + '_FULFILLED']: (state, action) => {
        let campaign = action.payload.data.data;
        campaign.id = campaign.id.toString();
        campaign.org_id = action.meta.orgId;
        campaign.isPending = false;
        campaign.error = null;

        return state
            .updateIn(['campaignList', 'items'], items => items?
                items.set(campaign.id, immutable.fromJS(campaign)) :
                immutable.fromJS({ [campaign.id]: campaign }));
    },

    [types.RETRIEVE_ACTIONS + '_FULFILLED']: (state, action) => {
        let campaigns = {};
        action.payload.data.data.forEach(obj => {
            let campaign = obj.campaign;
            campaign.id = campaign.id.toString();
            campaigns[campaign.id] = campaign;
        });

        return state
            .updateIn(['campaignList', 'items'], items => items?
                items.merge(immutable.fromJS(campaigns)) :
                immutable.fromJS(campaigns));
    },
});
