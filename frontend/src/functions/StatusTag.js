import React from "react";
import Tag from "antd/lib/tag";
import "antd/lib/tag/style/css";

const statusMap = {
    open: <Tag color="yellow">Open</Tag>,
    working: <Tag color="blue">Working</Tag>,
  done: <Tag color="green">Done</Tag>,
  overdue: <Tag color="red">Overdue</Tag>
};

export const StatusTag = ({ status }) => statusMap[status];