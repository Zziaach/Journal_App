import React, { Component } from "react";
import "./Note.css";
import { deleteNote } from "../util/APIUtils";
import { confirmAlert } from "react-confirm-alert";
import { Avatar, Button, notification, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { getAvatarColor } from "../util/Colors";
import { formatDateTime } from "../util/Helpers";
import "react-confirm-alert/src/react-confirm-alert.css";

class Note extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(noteId) {
    console.log("Delete note : " + noteId);
    confirmAlert({
      title: "Confirmation suppression",
      message: "Etes vous sure ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            deleteNote(noteId)
              .then(response => {
                this.props.loadNoteListInit();
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
                      error.message ||
                      "Sorry! Something went wrong. Please try again!"
                  });
                }
              });
          }
        },
        {
          label: "No",
          onClick: () => {}
        }
      ]
    });
  }

  render() {
    return (
      <Col className="gutter-row" span={12}>
        <div className="note-content">
          <div className="note-header">
            <div className="note-creator-info">
              <Link className="creator-link" to={`/users/profile`}>
                <Avatar
                  className="note-creator-avatar"
                  style={{
                    backgroundColor: getAvatarColor(
                      this.props.note.createdBy.name
                    )
                  }}
                >
                  {this.props.note.createdBy.name[0].toUpperCase()}
                </Avatar>
                <span className="note-creator-name">
                  {this.props.note.createdBy.name}
                </span>
                <span className="note-creator-username">
                  @{this.props.note.createdBy.username}
                </span>
                <span className="note-creation-date">
                  {formatDateTime(this.props.note.creationDateTime)}
                </span>
              </Link>
            </div>
            <div className="note-title">{this.props.note.title}</div>
          </div>
          <div className="note-content">{this.props.note.content}</div>
          <div className="poll-footer">
            <div className="float-right">
              <Link
                className="vote-button"
                to={{
                  pathname: "/note/edit",
                  state: { noteId: this.props.note.id }
                }}
              >
                <Button type="primary">Edit</Button>
              </Link>
              <span className="separator">•</span>
              <Button
                type="danger"
                // className="vote-button"
                onClick={this.handleDelete.bind(this, this.props.note.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

export default Note;
