import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import {Router} from 'react-router';
import {browerHistory} from 'react-router';

// test file for react apps
ReactDOM.render((
	<Router history={browerHistory}>
		{routes}
	</Router>
	), document.getElementById('root'));