import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styles from '../css/vote.css';

// import styles from '../css/votes.css';

class Vote extends Component {
	render() {
		return (
			<div className="movie-app">
				<h1>영화 투표</h1>
				<MovieList movies={this.props.movies} />
			</div>
		);
	}
}

class MovieList extends Component {
	render() {
		var movies = this.props.movies.map((movie) =>{
			return <MovieItem key={movie.id} title={movie.title} director_name={movie.director_name} />
		});
		return (
			<ul className="movie-list">
				{movies}
			</ul>
		);
	}
}

class MovieItem extends Component {
	render() {
		return (
			<li className="movie-item">
				{this.props.title} : {this.props.director_name}
			</li>
		);
	}
}

let getmovies = () => { axios.get('http://localhost:3000/api/movies/A1B2C3D4E5?year=2016',{responseType: 'json'}).then(function(response)
	{
		ReactDOM.render(<Vote movies={response.data.Data}/>,document.getElementById('vote-root'));
	});
}
getmovies();
