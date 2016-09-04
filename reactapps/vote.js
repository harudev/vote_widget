import React from 'react';
import ReactDOM from 'react-dom';

// import styles from '../css/votes.css';

class Vote extends React.Component {
	render() {
		return (
			<h1>Hello World!</h1>
		);
	}
}

ReactDOM.render(<Vote/>,document.getElementById('vote-root'));