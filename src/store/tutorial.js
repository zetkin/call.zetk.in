import immutable from 'immutable';
import { createReducer } from 'redux-create-reducer';

import * as types from '../actions';


const initialState = immutable.fromJS({
    noteQueue: [],
});

export default createReducer(initialState, {
    '@@INIT': (state, action) => {
        return immutable.fromJS(state);
    },

    [types.PUSH_TUTORIAL_NOTE]: (state, action) => {
        let note = immutable.fromJS({
            domElementSelector: action.payload.note.domElementSelector,
            messages: {
                header: action.payload.note.msgNamespace + '.h',
                text: action.payload.note.msgNamespace + '.p',
                manHref: action.payload.note.msgNamespace + '.href',
            }
        });

        return state
            .update('noteQueue', queue => queue
                .push(note));
    },

    [types.POP_TUTORIAL_NOTE]: (state, action) => {
        return state
            .update('noteQueue', queue => queue
                .shift());
    },
});
