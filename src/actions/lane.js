import * as types from '.';


export function setLaneStep(lane, step) {
    return {
        type: types.SET_LANE_STEP,
        payload: { lane, step },
    };
}

export function setLaneInfoMode(mode) {
    return {
        type: types.SET_LANE_INFO_MODE,
        payload: { mode },
    };
}

export function switchLaneToCall(call) {
    let callId = call.get('id');

    return {
        type: types.SWITCH_LANE_TO_CALL,
        payload: { callId },
    };
}
