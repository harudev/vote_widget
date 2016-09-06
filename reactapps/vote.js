import React, {Component} from 'react';
import axios from 'axios';
import constants from './constants';
import styles from '../css/vote.css';

class Vote extends Component {
	render() {
		return (
			<div className={styles.app}>
				<div className={styles.apptitle}>당신이 가장 좋아하는 영화는?</div>
				<MovieList query={this.props.query} user_id={this.props.user_id}/>
			</div>
		);
	}
}

class MovieList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Voted:false,
			votedIndex:0,
			data:[]
		}
		this.loadData();
	}
	loadData() {
		axios.get(constants.serverName +'/api/movies/'+constants.APIKEY+"?"+this.props.query,{responseType: 'json'}).then(function(response)
		{
			this.setState({
				data:response.data.Data
			});
		}.bind(this));
		axios.get(constants.serverName +'/api/vote/'+constants.APIKEY+"?user_id="+this.props.user_id,{responseType: 'json'}).then(function(response)
		{
			if (response.data.Data != null)
				this.setState({
					Voted:true,
					votedIndex:response.data.Data[0].movie_id
				});
		}.bind(this));
	}
	render() {
		const self=this;
		var movies = this.state.data.map((movie) =>{
			if(this.state.Voted) {
				if(movie.id == this.state.votedIndex)
					return <MovieItem key={movie.id} Voted='T' movie={movie}/>
				else
					return <MovieItem key={movie.id} Finished='T'  movie={movie}/>			
			}
			else {
				return <MovieItem key={movie.id} onClick={this.handleClick.bind(this, self, movie.id, this.props.user_id)} movie={movie}/>			
			}			
		});
		return (
			<div className={styles.movieList}>
				<ul className={styles.list}>
					{movies}
				</ul>
			</div>
		);
	}
	handleClick(self, key, user_id, ev)
	{
		if(this.state.Voted) { // 투표를 완료한 사용자의 경우
			console.log("Already Voted");
		}
		else { // 투표를 하지않은 사용자의 경우
			var querystring = require('querystring');

			axios.post(constants.serverName+'/api/vote/'+constants.APIKEY, querystring.stringify({
				user_id:user_id,
				movie_id:key
			}),{
				headers:{'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
			}).then(function(response) {
				console.log(response.data.Message);
				if(!response.data.Error) {
					self.setState({Voted:true, votedIndex:key},function() {
							self.loadData();
						});
				}
			}).catch(function(err){});
		}
		
	}
}

class MovieItem extends Component {
	constructor()
	{
		super();
		this.state = {
			opened:false
		}
	}
	render() {
		let itemVoted;
		if(this.props.Voted) {
			itemVoted = (
				<span className={styles.voted}>voted</span> 
				);
			return (
				<li className={styles.itemSelected} onClick={this.props.onClick}>
					<div className={styles.itemBasic}>{itemVoted} {this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span> <span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span></div>
					<div className={styles.itemMO}>{this.props.movie.summary}</div>
				</li>
			);
		}
		else
			if(this.props.Finished)
				return (
					<li className={styles.itemFinished} onClick={this.props.onClick}>
						<div className={styles.itemBasic}>{itemVoted} {this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span> <span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span></div>
						<div className={styles.itemMO}>{this.props.movie.summary}</div>
					</li>
				);
			else
				return (
					<li className={styles.item} onClick={this.props.onClick}>
						<div className={styles.itemBasic}>{itemVoted} {this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span> <span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span></div>
						<div className={styles.itemMO}>{this.props.movie.summary}</div>
					</li>
				);
	}
}

export default Vote;