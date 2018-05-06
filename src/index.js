import React from 'react';
import ReactDOM from 'react-dom';
import './css/App.css';
import './css/bootstrap.min.css';
import Game from './Components/App';
import registerServiceWorker from './scripts/registerServiceWorker';

ReactDOM.render(<Game />, document.getElementById('root'));
registerServiceWorker();