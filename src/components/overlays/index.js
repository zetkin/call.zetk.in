import LaneOverview from './LaneOverview';
import ResumeOverlay from './ResumeOverlay';
import SkipOverlay from './SkipOverlay';

let _overlays = {
    'laneOverview': LaneOverview,
    'resume': ResumeOverlay,
    'skip': SkipOverlay,
};

export function resolveOverlay(type) {
    if (type in _overlays) {
        return _overlays[type] || null;
    }
    else {
        throw "Unknown overlay type " + type;
    }
}
