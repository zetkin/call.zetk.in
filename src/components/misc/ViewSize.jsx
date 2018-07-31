import React from "react";
import PropTypes from '../../utils/PropTypes';

import getViewSize from '../../utils/getViewSize';


class ViewSize extends React.Component {
    constructor() {
        super();
        this.state = {
            size: getViewSize(),
        }
    }
  
    checkSize() {
        const size = getViewSize();
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