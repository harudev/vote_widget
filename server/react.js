import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext } from 'react-router';
import routes from '../reactapps/routes';
var express = require('express');

module.exports = function() {
	let getPropsFromRoute = ({routes}, componentProps) => {
		let props = {};
		let lastRoute = routes[routes.length -1];
		componentProps.forEach(componentProp => {
			if (!props[componentProp] && lastRoute.component[componentProp]) {
				props[componentProp] = lastRoute.component[componentProp];
			}
		});
		return props;
	};

	// 렌더링 할 경우 컴포넌트에서 loadData 함수를 찾아 초기 데이터를 가져온 후 index.ejs 파일에 렌더링한다.
	let renderRoute = (response, renderProps) => {
		let routesProps = getPropsFromRoute (renderProps, ['loadData']);
		if (routesProps.loadData) {
			routesProps.loadData().then((data) => {
				let handleCreateElement = (Component, props) => (
					<Component initialData={data.Data} {...props}/>
					);
				response.render('index', {
					reactInitialData:JSON.stringify(data.Data),
					content:renderToString(
						<RouterContext createElement={handleCreateElement} {...renderProps} />
						)
				});
			});
		} else {
			response.render('index', {
				reactInitialData:null,
				content:renderToString(
					<RouterContext {...renderProps} />
					)
				});
		}
	};

	var router = express.Router();
	
    router.get('*',(req,res) => {
		match({ routes, location:req.url }, (err, redirectLocation, renderProps) => {
			if (err) {
				res.status(500).send(err.message);
			} else if (renderProps) {
				renderRoute(res, renderProps);
			}
			else {
				res.status(404).send('Not found');
			}
		});
	});

	return router;
}