import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import Vote from './Vote';
import constants from './constants';

let user_id=constants.USERID;
ReactDOM.render(<Vote query="year=2016" user_id={user_id}/>,document.getElementById('vote-root'));