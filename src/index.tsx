// Main Routes
import React from "react";
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import configureStore from './state/store';
import Routes from "./app/Routes";
import './styles/index.scss';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={configureStore()}>
      <Routes />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)
