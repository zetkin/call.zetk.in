import { createReducer } from 'redux-create-reducer';
import immutable from 'immutable';

import * as types from '../actions';


const initialState = immutable.fromJS({
    pendingResponsesByCall: {},
    surveyList: {
        isPending: false,
        error: null,
        items: null,
    }
});

export default createReducer(initialState, {
    [types.START_NEW_CALL + '_FULFILLED']: (state, action) => {
        // Reset when new call starts
        return state
            .setIn(['surveyList', 'error'], null)
            .setIn(['surveyList', 'isPending'], false)
            .setIn(['surveyList', 'items'], immutable.Map());
    },

    [types.RETRIEVE_SURVEYS + '_PENDING']: (state, action) => {
        return state
            .setIn(['surveyList', 'error'], null)
            .setIn(['surveyList', 'isPending'], true);
    },

    [types.RETRIEVE_SURVEYS + '_FULFILLED']: (state, action) => {
        let surveys = {};
        action.payload.data.data.forEach(obj => {
            surveys[obj.id.toString()] = Object.assign(obj, {
                org_id: action.meta.orgId,
            });
        });

        return state
            .setIn(['surveyList', 'error'], null)
            .setIn(['surveyList', 'isPending'], false)
            .updateIn(['surveyList', 'items'], items => items?
                items.merge(immutable.fromJS(surveys)) :
                immutable.fromJS(surveys));
    },

    [types.RETRIEVE_SURVEY + '_PENDING']: (state, action) => {
        let survey = {
            id: action.meta.surveyId.toString(),
            org_id: action.meta.orgId.toString(),
            isPending: true,
        };

        return state
            .updateIn(['surveyList', 'items'], items => items?
                items.set(survey.id, immutable.fromJS(survey)) :
                immutable.fromJS({ [survey.id]: survey }));
    },

    [types.RETRIEVE_SURVEY + '_REJECTED']: (state, action) => {
        let survey = {
            id: action.meta.surveyId.toString(),
            org_id: action.meta.orgId.toString(),
            error: action.payload.data,
            isPending: false,
        };

        return state
            .updateIn(['surveyList', 'items'], items => items?
                items.set(survey.id, immutable.fromJS(survey)) :
                immutable.fromJS({ [survey.id]: survey }));
    },

    [types.RETRIEVE_SURVEY + '_FULFILLED']: (state, action) => {
        let survey = action.payload.data.data;
        survey.id = survey.id.toString();
        survey.org_id = action.meta.orgId;
        survey.isPending = false;
        survey.error = null;

        let updatedState = state
            .updateIn(['surveyList', 'items'], items => items?
                items.set(survey.id, immutable.fromJS(survey)) :
                immutable.fromJS({ [survey.id]: survey }));

        // Prepopulate survey fields (unless already filled out)
        const call = action.meta.call;
        if (!state.getIn(['pendingResponsesByCall', call.id])) {
            const targetData = call.target;
            if (targetData.person_fields) {
                targetData.person_fields.forEach(field => {
                    targetData[field.slug] = field.value;
                });
            }

            const surveyData = {
                surveyId: survey.id,
                included: false,
                responses: {},
            };

            survey.elements
                .filter(elem => elem.type == 'question')
                .filter(elem => elem.question.response_type == 'person_field')
                .forEach(elem => {
                    const fieldName = elem.question.response_config.person_field;
                    surveyData.responses[elem.id] = { response: targetData[fieldName] };
                });

            updatedState = updatedState.setIn(
                ['pendingResponsesByCall', call.id, survey.id], immutable.fromJS(surveyData));
        }

        return updatedState;
    },

    [types.STORE_SURVEY_RESPONSE]: (state, action) => {
        let callId = action.meta.callId;
        let surveyId = action.meta.surveyId;
        let elemId = action.meta.elemId;
        let response = action.payload;
        let surveyData = immutable.fromJS({
            surveyId: surveyId,
            included: true,
            responses: {
                [elemId]: response,
            }
        });

        return state
            .updateIn(['pendingResponsesByCall', callId, surveyId], survey => survey?
                survey.mergeDeep(surveyData) : surveyData);
    },

    [types.TOGGLE_SURVEY_INCLUDED]: (state, action) => {
        let callId = action.meta.callId;
        let surveyId = action.meta.surveyId;

        return state
            .setIn(['pendingResponsesByCall', callId, surveyId, 'included'],
                action.payload);
    },
});
