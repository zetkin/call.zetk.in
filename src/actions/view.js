import * as types from '.';


export function showOverlay(type, config) {
    return {
        type: types.SHOW_OVERLAY,
        payload: { type, config },
    };
}

export function closeOverlay() {
    return {
        type: types.CLOSE_OVERLAY,
    };
}
