import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IData } from '../utils/contracts';

interface IRouteProps extends IData {
  component: any,
  restricted: boolean
}

const PrivateRoute = ({ component, restricted, ...rest }: IRouteProps) => (
  <Route {...rest} render={props => {
    console.log('private props: ', props);
    return restricted ?
      <Redirect to="/" />
      : <Component {...props} />
  }} />
);

export default PrivateRoute;