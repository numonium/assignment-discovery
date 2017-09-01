import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from './redux/store';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

var store = configureStore();

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
