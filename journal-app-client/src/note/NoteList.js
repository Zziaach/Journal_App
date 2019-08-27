import React, { Component } from "react";
import { getUserCreatedNotes } from "../util/APIUtils";
import Note from "./Note";
import LoadingIndicator from "../common/LoadingIndicator";
import { Button, Icon, notification, Row, Col } from "antd";
import { NOTE_LIST_SIZE } from "../constants";
import { withRouter } from "react-router-dom";
import "./NoteList.css";

class NoteList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      isLoading: false
    };
    this.loadNoteListInit = this.loadNoteListInit.bind(this);
    this.loadNoteList = this.loadNoteList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  loadNoteList(page = 0, size = NOTE_LIST_SIZE) {
    let promise;
    if (this.props.username) {
      if (this.props.type === "USER_CREATED_NOTES") {
        promise = getUserCreatedNotes(this.props.username, page, size);
      }
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const notes = this.state.notes.slice();

        this.setState({
          notes: notes.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  loadNoteListInit(page = 0, size = NOTE_LIST_SIZE) {
    let promise;
    if (this.props.username) {
      if (this.props.type === "USER_CREATED_NOTES") {
        promise = getUserCreatedNotes(this.props.username, page, size);
      }
    }

    if (!promise) {
      return;
    }

    this.setState({
      isLoading: true
    });

    promise
      .then(response => {
        const notes = this.state.notes.slice();

        this.setState({
          notes: response.content,
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentDidMount() {
    this.loadNoteList();
  }

  componentDidUpdate(nextProps) {
    if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        notes: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoading: false
      });
      this.loadNoteList();
    }
  }

  handleLoadMore() {
    this.loadNoteList(this.state.page + 1);
  }

  render() {
    const noteViews = [];
    this.state.notes.forEach((note, noteIndex) => {
      noteViews.push(
        <Note
          key={note.id}
          note={note}
          loadNoteListInit={this.loadNoteListInit}
        />
      );
    });

    return (
      <Row gutter={16}>
        {noteViews}
        {!this.state.isLoading && this.state.notes.length === 0 ? (
          <div className="no-notes-found">
            <span></span>
          </div>
        ) : null}
        {!this.state.isLoading && !this.state.last ? (
          <div className="load-more-notes">
            <Button
              type="dashed"
              onClick={this.handleLoadMore}
              disabled={this.state.isLoading}
            >
              <Icon type="plus" /> Load more
            </Button>
          </div>
        ) : null}
        {this.state.isLoading ? <LoadingIndicator /> : null}
      </Row>
    );
  }
}

export default withRouter(NoteList);
