import cookies from 'browser-cookies';

import * as types from '.';


const COOKIE_NAME = 'zetkinCallTutorialNotesSeen';

export function pushTutorialNote(msgNamespace, domElementSelector) {
    let note = { msgNamespace, domElementSelector };

    return ({ dispatch }) => {
        // Only dispatch action if user has not already seen this tutorial
        // note, as indicated by the namespace stored in a cookie.
        let notesSeen = getNotesSeenFromCookie();
        if (notesSeen.indexOf(msgNamespace) < 0) {
            dispatch({
                type: types.PUSH_TUTORIAL_NOTE,
                payload: { note },
            })
        }
    };
}

export function popTutorialNote() {
    return ({ dispatch, getState }) => {
        let noteQueue = getState().getIn(['tutorial', 'noteQueue']);

        if (noteQueue.size) {
            // Update cookie, marking this note as seen
            let note = noteQueue.get(0);
            let notesSeen = getNotesSeenFromCookie();
            notesSeen.push(note.get('ns'));
            cookies.set(COOKIE_NAME, JSON.stringify(notesSeen));
        }

        dispatch({
            type: types.POP_TUTORIAL_NOTE,
        });
    };
}

const getNotesSeenFromCookie = () => {
    try {
        return JSON.parse(cookies.get(COOKIE_NAME)) || [];
    }
    catch (err) {
        return [];
    }
};
