import LaneOverview from './LaneOverview';
import ResumeOverlay from './ResumeOverlay';

let _overlays = {
    'laneOverview': LaneOverview,
    'resume': ResumeOverlay,
};

export function resolveOverlay(type) {
    if (type in _overlays) {
        return _overlays[type] || null;
    }
    else {
        throw "Unknown overlay type " + type;
    }
}
