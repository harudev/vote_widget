import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import Vote from './Vote';
import constants from './constants';

let user_id=constants.USERID;
ReactDOM.render(<Vote query="" user_id={user_id}/>,document.getElementById('vote-root'));