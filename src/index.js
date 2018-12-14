// require('./style.css');

// const favicon = require('./assets/favicon.png');
// let link = document.createElement('link');
// link.type = 'image/png';
// link.rel = 'shortcut icon';
// link.href = favicon;
// document.head.appendChild(link);

// let title = document.createElement('h1');
// title.innerText = 'Hello Wepack';
// document.body.appendChild(title);


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();