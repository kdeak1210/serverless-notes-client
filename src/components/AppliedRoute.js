import React from 'react';
import { Route } from 'react-router-dom';

/**
 * Allows us to pass in the component we want rendered and props we want applied
 */
export default ({ component: C, props: cProps, ...rest }) => 
  <Route {...rest} render={props => <C {...props} {...cProps} />} />;
