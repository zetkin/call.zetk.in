import * as types from '.';


export function setCallViewState(state) {
    return {
        type: types.SET_CALL_VIEW_STATE,
        payload: { state }
    };
}
