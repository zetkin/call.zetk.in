import * as types from '.';


export function setLaneStep(lane, step) {
    return {
        type: types.SET_LANE_STEP,
        payload: { lane, step },
    };
}
