import LaneOverview from './LaneOverview';

let _overlays = {
    'laneOverview': LaneOverview,
};

export function resolveOverlay(type) {
    if (type in _overlays) {
        return _overlays[type] || null;
    }
    else {
        throw "Unknown overlay type " + type;
    }
}