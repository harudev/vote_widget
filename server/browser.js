import React from 'react';
import { render } from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from '../reactapps/routes';

// 클라이언트에 들어갈 react rendering 코드

let handleCreateElement = (Component, props) => {
	if (Component.hasOwnProperty('loadData')) {
		let initialData = document.getElementById('initial-data').textContent;
		if(initialData.length>0) {
			initialData = JSON.parse(initialData);
		}
		return <Component initialData={initialData} {...props} />;
	}
	else {
		return <Component {...props}/>;
	}
}

render((
	<Router history={browserHistory} createElement={handleCreateElement}>{routes}</Router> 
	), document.getElementById('root'))