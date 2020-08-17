import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = (props: any) => {
  const { children, state: {me: {name}, gameType}, ...rest } = props;
   return (
    <Route
      {...rest}
      render={() => !!name && !!gameType 
        ? children 
        : <Redirect to='/' />
      }
    />
  );
};

export default PrivateRoute;