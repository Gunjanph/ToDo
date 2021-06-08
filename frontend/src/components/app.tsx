import React, { useEffect, useState, useRef } from "react";
import { Input, InputNumber, Form, Popconfirm , Button, Tag, Space, Menu, Dropdown } from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import type { ProColumns } from "@ant-design/pro-table";
import ProTable,{ EditableProTable, enUSIntl } from "@ant-design/pro-table";
import ProField from "@ant-design/pro-field";
import { ProFormRadio } from "@ant-design/pro-form";
import ProCard from "@ant-design/pro-card";
import { ConfigProvider } from 'antd';
import { StatusTag } from "../functions/StatusTag";
import request from 'umi-request';
import enUS from 'antd/lib/locale/en_US';
import axios from "axios";
import NewTaskModal from "./NewModal";
import type { ActionType } from "@ant-design/pro-table";
import { useTableSearch } from "./TableSearch";
import reqwest from 'reqwest';

const { Search } = Input;

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};


type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  description?: string;
  dueDate?: string;
  due?:string;
  labels?: {
    key: string;
    label: string;
  }[];
  assignee?: string;
  state?: string;
  completed?: string;
  created_at?: string;
  date?: string;
  children?: DataSourceType[];
};

function App() {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [searchVal, setSearchVal] = useState<any | null>(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: dataSource
  });


  const columns: ProColumns<DataSourceType>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: '5%',
    },
    {
      title: "TimeStamp Created",
      dataIndex: "date",
      key: 'showTime',
      valueType: "date",
      sorter: true,
      editable: false,
      // render: ( text,record, _) => [
      //   console.log(text)
      // ],
    },
    {
      title: "Title",
      dataIndex: "title",
      sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
          {
            max: 100,
            whitespace: true,
            message: "The longest is 100 characters",
          },
        ],
      },
      width: "15%",
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
          {
            max: 1000,
            whitespace: true,
            message: "The longest is 1000 characters",
          },
        ],
      },
      fieldProps: (from, { rowKey, rowIndex }) => {
        if (from.getFieldValue([rowKey || "", "title"]) === "不好玩") {
          return {
            disabled: true,
          };
        }
        if (rowIndex > 9) {
          return {
            disabled: true,
          };
        }
        return {};
      },
    },
    {
      title: "Due Date",
      dataIndex: "due",
      key: 'showTime',
      sorter: true,
      valueType: "date",
    },
    {
    title: 'Assignee',
    dataIndex: 'assignee',
    formItemProps: {
      rules: [
        {
          max:100,
          whitespace: true,
          message: "The longest is 100 characters",
        },
      ],
    },
  },
    {
      title: "Status",
      key: "state",
      dataIndex: "completed",
      valueType: "select",
      initialValue: "open",
      filters: true,
      onFilter: true,
      valueEnum: {
        open: {
          text: "OPEN",
          status: "default",
        },
        working: {
          text: "WORKING",
          status: "Processing",
        },
        overdue: {
          text: "OVERDUE",
          status: "Error",
        },
        done: {
          text: "DONE",
          status: "Success",
        },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "This item is required",
          },
        ],
      },
    },

    {
      title: "Operation",
      valueType: "option",
      render: (text, record, _, action) => [
        <a><NewTaskModal
                                    create={false}
                                    student={record}
                                />
        </a>,
        <Popconfirm
          title = "Are you Sure?"
          key="delete"
          onConfirm={() => {
            axios
            .delete(`/api/todos/${record.id}/`)
            .then((res) => refreshList());
          }}
        >
        DELETE        </Popconfirm>,
      ],
    },
  ];

  const handleTableChange = (sorter) => {
        console.log("In handleTableChange")
        // var ss = "" + sorter;
        // console.log(ss, sorter);
        // var splitted = ss.split(":", 3);
        // console.log(sorter.Object.__proto__,sorter.Object, sorter);
    };

  const resetState = () => {
       if (window.performance) {
  if (performance.navigation.type == 1) {
     axios
      .get("/api/todos/")
      .then((res) => setDataSource(res.data))
      .catch((err) => console.log(err));
  }
}
    };

    const sortData = (sortvalue, sorttype) => {
      reqwest({
            url: "http://localhost:8000/api/todos/",
            method: 'get',
            type: 'json',
            data: { 'sortfield': sortvalue,
            'sortorder': sorttype,},
    })
    console.log(
    sortvalue)
    }

  const refreshList = () => {
    axios
      .get("/api/todos/", {})
      .then((res) => setDataSource(res.data))
      .catch((err) => console.log(err));
  };

  const setfilterdata = () => {
    setDataSource(filteredData);
  }

  useEffect(() => {
    refreshList();
    setfilterdata();
    resetState();
  },[]);

  return (
    <>
    <ConfigProvider locale={enUS}>
      <EditableProTable<DataSourceType>
        search={false}
        actionRef={actionRef}
        rowKey="id"
        headerTitle="TASK"
        maxLength={10}
        recordCreatorProps={
          false
        }
        toolBarRender={() => [
          <Space>
          <Search
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{
          position: "sticky",
          top: "0",
          left: "0",
          width: "200px",
          marginTop: "1vh"
        }}
      />
            <a>
              <NewTaskModal create={true} />
            </a>
          </Space>,
        ]}
        columns={columns}
        request={async (params = {}, sorter, filter) => {
          // The form search item will be passed in from params and passed to the back-end interface.
          handleTableChange(sorter)
          return Promise.resolve({
            data: dataSource,
            success: true,
          });
        }}
        pagination={{
          pageSize: 5,
          total: 100,
        }}
        value={filteredData}
        onChange={setDataSource}
        editable={{
          type: "multiple",
          editableKeys,
          onSave: async () => {
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
        }}
        dateFormatter="string"
      />

      <ProCard title="Table data" headerBordered collapsible defaultCollapsed>
        <ProField
          fieldProps={{
            style: {
              width: "100%",
            },
          }}
          mode="read"
          valueType="jsonCode"
          text={JSON.stringify(dataSource)}
        />
      </ProCard>
      </ConfigProvider>
    </>
  );
}

export default App;