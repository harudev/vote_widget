import React, {Component} from 'react';
import axios from 'axios';
import constants from './constants';
import styles from '../css/vote.css';

class Vote extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title:"당신이 가장 좋아하는 영화는?",
			Voted:false,
			votedIndex:0,
			sum:0,
			data:[],
			query:""
		}
		this.loadData();
	}
	loadData() {
		axios.get(constants.serverName +'/api/movies/'+constants.APIKEY+"?search="+this.state.query+"&"+this.props.query,{responseType: 'json'}).then(function(response) {
			this.setState({
				data:response.data.Data
			});
			axios.get(constants.serverName +'/api/vote/'+constants.APIKEY+"?user_id="+this.props.user_id,{responseType: 'json'}).then(function(response) {
				if (response.data.Data != null) {
					var result = response.data.Data[0];
					this.setState({
						Voted:true,
						votedIndex:result.movie_id,
						title:result.user_name + " 님의 투표 결과",
					});
					axios.get(constants.serverName +'/api/stat/sum/'+constants.APIKEY,{responseType: 'json'}).then(function(response) {
						console.log(response.data.Data[0].sum);
						this.setState({
							sum:response.data.Data[0].sum
						});
					}.bind(this));
				}
			}.bind(this));
		}.bind(this));
	}
	render() {
		const self=this;
		var movies = this.state.data.map((movie) =>{
			if(this.state.Voted) {
				if(movie.id == this.state.votedIndex)
					return <MovieItem key={movie.id} Voted='T' movie={movie} sum={this.state.sum}/>
				else
					return <MovieItem key={movie.id} Finished='T'  movie={movie} sum={this.state.sum}/>			
			}
			else {
				return <MovieItem key={movie.id} onClick={this.handleClick.bind(this, movie.id, this.props.user_id)} movie={movie}/>			
			}			
		});
		return (
			<div className={styles.app}>
				<div className={styles.apptitle}>{this.state.title}</div>
				<ul className={styles.list}>
					{movies}
				</ul>
				<div className={styles.searchApp}>
					<div>
						또는...
					</div>
					<SearchItem changeFunc={this.handleSearch.bind(this)}/>
				</div>
			</div>
		);
	}
	handleClick(key, user_id, ev) {
		const self = this;
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

	handleSearch(querystring) {
		this.setState({query:querystring});
		this.loadData();
	}
}

class MovieItem extends Component {
	render() {
		let itemVoted;
		let rate = String(this.props.movie.vote_count * 100 / this.props.sum) + " %";
		if(this.props.Voted) {
			itemVoted = (
				<span className={styles.voted}>voted</span> 
				);
			return (
				<li className={styles.itemSelected} onClick={this.props.onClick}>
					<div className={styles.itemBasic}>
					{itemVoted} {this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span>
					<span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span>
					<span className={styles.rate}>{rate}</span>
					</div>
					<div className={styles.itemMO}>{this.props.movie.summary}</div>
				</li>
			);
		}
		else
			if(this.props.Finished)
				return (
					<li className={styles.itemFinished} onClick={this.props.onClick}>
						<div className={styles.itemBasic}>
						{itemVoted} {this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span>
						<span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span>
						<span className={styles.rate}>{rate}</span>
						</div>
						<div className={styles.itemMO}>{this.props.movie.summary}</div>
					</li>
				);
			else
				return (
					<li className={styles.item} onClick={this.props.onClick}>
						<div className={styles.itemBasic}>
						{itemVoted} {this.props.movie.title} <span className={styles.director_name}>by {this.props.movie.director_name}</span>
						<span className={styles.premier}>({this.props.movie.premier.substr(0,4)})</span>
						</div>
						<div className={styles.itemMO}>{this.props.movie.summary}</div>
					</li>
				);
	}
}

class SearchItem extends Component {
	constructor ()
	{
		super();
		this.state = {
			placeholder:"찾으시려는 영화명을 입력하세요 :)",
			value:""
		}
		this.propTypes = {
			changeFunc:React.PropTypes.func
		}
	}
	render () {
		return <input id="search-querystring" type="text" placeholder={this.state.placeholder} onKeyUp={this.handleChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>;
	}
	handleChange(e) {
		this.setState({
			value:e.target.value
		});
		this.props.changeFunc(e.target.value);
	}
	handleFocus() {
		document.getElementById('search-querystring').value='';
	}
}
export default Vote;