import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { 
  CognitoUserPool, 
  AuthenticationDetails, 
  CognitoUser 
} from 'amazon-cognito-identity-js';
import config from '../config';
import './Login.css';
import LoaderButton from '../components/LoaderButton';

export default class Login extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
  };

  validateForm = () => {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
  }

  handleChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    try {
      const { email, password } = this.state;
      await this.login(email, password);
      this.props.userHasAuthenticated(true);
      // Redirect, unmounting component and destroying local state.
      this.props.history.push('/');
    } catch (e) {
      alert(JSON.stringify(e));
      this.setState({ isLoading: false });
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
          <LoaderButton
            block
            bsSize="large"
            type="submit"
            disabled={!this.validateForm()}
            isLoading={this.state.isLoading}
            text="Login"
            loadingText="Logging in..."
          />
        </form>
      </div>
    );
  }
}
