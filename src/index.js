import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import {BrowserRouter as Router} from "react-router-dom";
import Amplify from 'aws-amplify';
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);