import React from 'react';
import {Link} from 'react-router'

class App extends React.Component {
	render() {
		return (
			<div>
				<nav>
					<Link to='/vote'>투표하기</Link> {' '}
					<Link to='/vote_result'>결과보기</Link>
				</nav>
				<div>
					{this.props.children}
				</div>
			</div>
			)
	}
}

export default App;