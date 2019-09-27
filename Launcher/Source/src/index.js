import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TabNavigation from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<TabNavigation />, document.getElementById('tab'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
