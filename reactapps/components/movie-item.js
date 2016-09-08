import React from 'react';
import axios from 'axios';
import constants from '../constants';

class MovieItem extends React.Component {
	render() {
		return (
			<li className="item" onClick={this.props.onClick}>
				<div className="itemBasic">
				{this.props.movie.title} <span className="director_name">by {this.props.movie.director_name}</span>
				<span className="premier">({this.props.movie.premier.substr(0,4)})</span>
				</div>
				<div className="itemMO">{this.props.movie.summary}</div>
			</li>
		);
	}
}

export default MovieItem;