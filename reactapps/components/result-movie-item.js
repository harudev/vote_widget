import React from 'react';
import axios from 'axios';
import constants from '../constants';

class ResultMovieItem extends React.Component {
	render() {
		let rate = String(this.props.movie.vote_count * 100 / this.props.sum) + " %";
		if(this.props.Voted) {
			return (
				<li className="itemSelected" onClick={this.props.onClick}>
					<div className="itemBasic">
					<span className="voted">voted</span> 
					{this.props.movie.title} <span className="director_name">by {this.props.movie.director_name}</span>
					<span className="premier">({this.props.movie.premier.substr(0,4)})</span>
					<span className="rate">{rate}</span>
					</div>
				</li>
			);
		}
		else {
			return (
				<li className="itemFinished" onClick={this.props.onClick}>
					<div className="itemBasic">
					{this.props.movie.title} <span className="director_name">by {this.props.movie.director_name}</span>
					<span className="premier">({this.props.movie.premier.substr(0,4)})</span>
					<span className="rate">{rate}</span>
					</div>
				</li>
			);
		}
	}
}

export default ResultMovieItem;