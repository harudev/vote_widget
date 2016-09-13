import React from 'react';
import { Route, IndexRoute } from 'react-router'
import Vote from './components/vote'
import VoteResult from './components/vote-result';

export default (
	<Route>
		<Route path="/vote/:user" component={Vote} />
		<Route path="/vote_result/:user" component={VoteResult} />
	</Route>);