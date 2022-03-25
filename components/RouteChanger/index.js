import React, { Component } from 'react';
import {emitter} from "../../helpers/emitter";
import {withRouter} from "next/router";

class RouterChanger extends Component {
    componentDidMount() {
        emitter.on('change-route', this.handler);
    }

    componentWillUnmount() {
        emitter.off('change-route', this.handler);
    }

    handler = ({ path }) => {
        this.props.router.push(path);
    }

    render() {
        return null;
    }
}

export default withRouter(RouterChanger)