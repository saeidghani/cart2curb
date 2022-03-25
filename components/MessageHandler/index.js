import React, { Component } from 'react';
import {emitter} from "../../helpers/emitter";
import { message } from 'antd';

class MessageHandler extends Component {
    componentDidMount() {
        emitter.on('show-message', this.handler);
    }

    componentWillUnmount() {
        emitter.off('show-message', this.handler);
    }

    handler = ({ type, text }) => {
        if(type) {
            message[type](text);
        } else {
            message.error(text);
        }
    }

    render() {
        return null;
    }
}

export default MessageHandler