import React from 'react';
import axios from 'axios';
import constants from '../constants';
import styles from '../../css/movie-item.css';

class MovieItem extends React.Component {
	render() {
		return (
			<li className={styles.item} onClick={this.props.onClick}>
				<div className={styles.itemBasic}>
				{this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span>
				<span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span>
				</div>
				<div className={styles.itemMO}>{this.props.movie.summary}</div>
			</li>
		);
	}
}

export default MovieItem;