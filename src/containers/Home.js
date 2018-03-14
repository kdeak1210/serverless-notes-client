import React, { Component } from 'react';
import { PageHeader, ListGroup } from 'react-bootstrap';
import { invokeApig } from '../libs/awsLib';
import './Home.css';

export default class Home extends Component {
  state = {
    isLoading: true,
    notes: []
  };

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const results = await this.notes();
      this.setState({ notes: results });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return invokeApig({ path: '/notes' });
  }

  renderNotesList(notes) {
    return null;
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    )
  }

  renderNotes() {
    const { isLoading, notes } = this.state;
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!isLoading && this.renderNotesList(notes)}
        </ListGroup>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        { this.props.isAuthenticated
          ? this.renderNotes()
          : this.renderLander() }
      </div>
    );
  }
}