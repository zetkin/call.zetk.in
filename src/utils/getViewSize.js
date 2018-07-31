const SIZES = [
  {name: "small", minWidth: 0},
  {name: "medium", minWidth: 600},
  {name: "large", minWidth: 768},
  {name: "x-large", minWidth: 1125}
];

export default function getViewSize() {
    let size = SIZES[SIZES.length - 1].name;
    if (typeof window != 'undefined') {
        const viewSize = window.innerWidth;
        SIZES.forEach(s => {
            if (s.minWidth <= viewSize) {
                size = s.name;
            }
        });
    }

    return size;
}
