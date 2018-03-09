import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { 
  CognitoUserPool, 
  AuthenticationDetails, 
  CognitoUser 
} from 'amazon-cognito-identity-js';
import './Login.css';
import config from '../config';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  validateForm = () => {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { email, password } = this.state;
      await this.login(email, password);
      alert("Logged in!");
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }

  login = (email, password) => {
    //console.log(email, password)
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) => 
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
    );
  }

  render() {
    return(
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl 
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl 
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}