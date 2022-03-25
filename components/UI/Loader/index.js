import {LoadingOutlined} from "@ant-design/icons";
import React from "react";
import {Spin} from "antd";

const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

const Loader = () => {
    return <Spin indicator={antIcon}/>
}

export default Loader;