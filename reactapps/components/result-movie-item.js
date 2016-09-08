import React from 'react';
import axios from 'axios';
import constants from '../constants';

class ResultMovieItem extends React.Component {
	render() {
		let rate = String(this.props.movie.vote_count * 100 / this.props.sum) + " %";
		if(this.props.Voted) {
			return (
				<li className={styles.itemSelected} onClick={this.props.onClick}>
					<div className={styles.itemBasic}>
					<span className={styles.voted}>voted</span> 
					{this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span>
					<span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span>
					<span className={styles.rate}>{rate}</span>
					</div>
				</li>
			);
		}
		else {
			return (
				<li className={styles.itemFinished} onClick={this.props.onClick}>
					<div className={styles.itemBasic}>
					{this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span>
					<span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span>
					<span className={styles.rate}>{rate}</span>
					</div>
				</li>
			);
		}
	}
}

export default ResultMovieItem;