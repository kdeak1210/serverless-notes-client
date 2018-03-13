import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import './NewNote.css';

export default class NewNote extends Component {
  constructor() {
    super();
    
    // class property (instance var) bc file object shouldnt affect / drive rendering
    this.file = null; 

    this.state = {
      isLoading: null,
      content: ''
    };
  }

  validateForm() {
    console.log('validating...')
    return this.state.content.length > 0;
  }

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value
    });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB.');
      return;
    }

    this.setState({ isLoading: true });
  }

  render() {
    return(
      <div className="NewNote">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl
              onChange={this.handleFileChange}
              type="file"
            />
          </FormGroup>
          <LoaderButton 
            block
            bsStyle="primary"
            bsSize="large"
            type="submit"
            text="Create"
            loadingText="Creating..."
            disabled={!this.validateForm()}
            isLoading={this.state.isLoading}
          />
        </form>
      </div>
    );
  }
}
