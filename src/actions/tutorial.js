import * as types from '.';


export function pushTutorialNote(msgNamespace, domElementSelector) {
    let note = { msgNamespace, domElementSelector };

    return {
        type: types.PUSH_TUTORIAL_NOTE,
        payload: { note },
    };
}

export function popTutorialNote() {
    return {
        type: types.POP_TUTORIAL_NOTE,
    };
}
