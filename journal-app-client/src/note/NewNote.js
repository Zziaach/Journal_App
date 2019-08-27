import React, { Component } from "react";
import { createNote } from "../util/APIUtils";
import { NOTE_TITLE_MAX_LENGTH, NOTE_CONTENT_MAX_LENGTH } from "../constants";
import "./NewNote.css";
import { Form, Input, Button, notification } from "antd";
const FormItem = Form.Item;
const { TextArea } = Input;

class NewNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: {
        text: ""
      },
      content: {
        text: ""
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const noteData = {
      title: this.state.title.text,
      content: this.state.content.text
    };

    createNote(noteData)
      .then(response => {
        this.props.history.push("/");
      })
      .catch(error => {
        if (error.status === 401) {
          this.props.handleLogout(
            "/login",
            "error",
            "You have been logged out. Please login create note."
          );
        } else {
          notification.error({
            message: "Journal App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  }

  validateTitle = titleText => {
    if (titleText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please enter a title for your note!"
      };
    } else if (titleText.length > NOTE_TITLE_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Note title is too long (Maximum ${NOTE_TITLE_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  validateContent = contentText => {
    if (contentText.length === 0) {
      return {
        validateStatus: "error",
        errorMsg: "Please fill the body of your note!"
      };
    } else if (contentText.length > NOTE_CONTENT_MAX_LENGTH) {
      return {
        validateStatus: "error",
        errorMsg: `Note body is too long (Maximum ${NOTE_CONTENT_MAX_LENGTH} characters allowed)`
      };
    } else {
      return {
        validateStatus: "success",
        errorMsg: null
      };
    }
  };

  handleChange(event) {
    const value = event.target.value;
    if (event.target.name === "title") {
      this.setState({
        title: {
          text: value,
          ...this.validateTitle(value)
        }
      });
    } else if (event.target.name === "content") {
      this.setState({
        content: {
          text: value,
          ...this.validateContent(value)
        }
      });
    }
  }

  isFormInvalid() {
    if (this.state.title.validateStatus !== "success") {
      return true;
    }
    if (this.state.content.validateStatus !== "success") {
      return true;
    }
  }

  render() {
    return (
      <div className="new-note-container">
        <h1 className="page-title">Create Note</h1>
        <div className="new-note-content">
          <Form onSubmit={this.handleSubmit} className="create-note-form">
            <FormItem
              validateStatus={this.state.title.validateStatus}
              help={this.state.title.errorMsg}
              className="note-form-row"
            >
              <Input
                placeholder={"Note title "}
                size="large"
                name="title"
                value={this.state.title.text}
                onChange={this.handleChange}
              />
            </FormItem>
            <FormItem
              validateStatus={this.state.content.validateStatus}
              help={this.state.content.errorMsg}
              className="note-form-row"
            >
              <TextArea
                placeholder="Enter your note"
                style={{ fontSize: "16px" }}
                autosize={{ minRows: 3, maxRows: 6 }}
                name="content"
                value={this.state.content.text}
                onChange={this.handleChange}
              />
            </FormItem>
            <FormItem className="note-form-row">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={this.isFormInvalid()}
                className="create-note-form-button"
              >
                Create Note
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default NewNote;
