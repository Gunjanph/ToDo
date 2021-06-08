import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import axios from "axios";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import moment from "moment";

// const delimiters = [KeyCodes.comma, KeyCodes.enter];
const Status = [
    { label: "Open", value: "open" },
    { label: "Working", value: "working" },
    { label: "Done", value: "done" },
    { label: "Overdue", value: "overdue" },
  ];

class NameForm extends React.Component {
    constructor() {
        super()
        this.state = {
            title: "",
            description: "",
            due: null,
            assignee: "",
            completed: "",
            currentdate: "",
        };
    }

    async componentDidMount() {
        if (this.props.student) {
            const { id, title, description, due, assignee, completed } = this.props.student;
            this.setState({ id, title, description, due, assignee, completed } );
            
        }
        const current = new Date();
        var date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;
        if(current.getMonth()<9)
            date = `${current.getFullYear()}-0${current.getMonth()+1}-${current.getDate()}`;
        if(current.getDate()<10)
            date = `${current.getFullYear()}-${current.getMonth()+1}-0${current.getDate()}`;
        if(current.getMonth()<9 && current.getDate()<10)
            date = `${current.getFullYear()}-0${current.getMonth()+1}-0${current.getDate()}`;
        console.log(date);
        this.setState({currentdate: date});
        console.log(this.state.currentdate);
    }

    onChange = e => {
        // console.log(e)
        this.setState({ [e.target.name]: e.target.value });
    };

    createStudent = e => {
        e.preventDefault();
        axios.post(`/api/todos/`, this.state).then(() => {
            this.props.toggle();
            window.location.reload();
        }).catch((err,sta) => {
            alert("Inconsistent entries")
        });
    };

    editStudent = e => {
        e.preventDefault();
        axios
        .put(`/api/todos/${this.state.id}/`, this.state)
        .then(() => {
            this.props.toggle();
            window.location.reload();
        })
        // console.log(this.state.id);
        console.log(this.props.resetState);
    };

    defaultIfEmpty = value => {
        return value === "" ? "" : value;
    };

    render() {
        console.log(this.state.due)
        return (
            <Form onSubmit={this.props.student ? this.editStudent : this.createStudent}>
                <FormGroup>
                    <Label for="title">Title:</Label>
                    <Input
                        type="text"
                        name="title"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.title)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                        type="text"
                        name="description"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.description)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="due">Due Date</Label>
                    <Input
                        type="date"
                        name="due"
                        min = {this.state.currentdate}
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.due)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="assignee">Assignee</Label>
                    <Input
                        type="text"
                        name="assignee"
                        onChange={this.onChange}
                        value={this.defaultIfEmpty(this.state.assignee)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="completed">Status</Label>
                    <Select name="completed" options={Status} defaultValue={Status[0]} placeholder = {this.defaultIfEmpty(this.state.completed)} onChange={(newst) => {
                        console.log(newst)
                        this.setState({completed:newst.value});
                    }}/>
                </FormGroup>
                <Button>Submit</Button>
            </Form>
        );
    }
}

export default NameForm;