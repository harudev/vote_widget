import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import Vote from './components/vote';
import VoteResult from './components/vote-result';
import constants from './constants';

// test file for react apps
let user_id=constants.USERID;
ReactDOM.render(<VoteResult query="" user_id={user_id}/>,document.getElementById('vote-root'));