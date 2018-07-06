import React from "react";
import PropTypes from '../../utils/PropTypes';

const sizes = [
  {name: "small", minWidth: 0},
  {name: "medium", minWidth: 600},
  {name: "large", minWidth: 768},
  {name: "x-large", minWidth: 1125}
]

class ViewSize extends React.Component {
    constructor() {
        super();
        this.state = {
            size: sizes[sizes.length - 1].name
        }
    }
  
    checkSize() {
        let size = sizes[sizes.length - 1].name;
        if (typeof window != 'undefined') {
            const viewSize = window.innerWidth;
            sizes.forEach(s => {
                if (s.minWidth <= viewSize) {
                    size = s.name;
                }
            });
        }
        if (this.state.size !== size) {
            this.setState({size})
        }
    }

    componentDidMount() {
        this.checkSize();
        window.addEventListener("resize", this.checkSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.checkSize.bind(this));
    }

    render() {
        return this.props.render(this.state);
    }
}

ViewSize.propTypes = {
    render: PropTypes.func.isRequired
}

export default ViewSize;