import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Table, Button } from 'antd';
import './App.css';
import '@ant-design/pro-table/dist/table.css';
import '@ant-design/pro-field/dist/field.css';
import '@ant-design/pro-form/dist/form.css';
import '@ant-design/pro-card/dist/card.css';
import 'antd/dist/antd.css';
import { ConfigProvider } from "antd";
import enUS from "antd/lib/locale/en_US";


import App from './components/app'

function AppTodo() {

  return (
    <ConfigProvider locale={enUS}>
    <Router>
      <div className="container">
        <br/>
        <Route path="/" exact component={App}/>
      </div>
    </Router>
    </ConfigProvider>
  );
}

export default AppTodo;