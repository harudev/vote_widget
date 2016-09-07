import React from 'react';
import axios from 'axios';
import constants from '../constants';
import MovieItem from './movie-item';

class Vote extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title:"당신이 가장 좋아하는 영화는?",
			data:this.props.initialData || [],
			query:""
		}
	}
	componentDidMount() {
		axios.get(constants.serverName +'/api/vote/'+constants.APIKEY+"?user_id="+this.props.user_id,{responseType: 'json'}).then(function(response) {
			if (response.data.Data != null) {
				this.props.history.replaceState(null,'/vote_result');
			}
			else {
					if (!this.props.initialData) {
					this.loadData();
				}
			}
		}.bind(this));
		
	}
	loadData() {
		axios.get(constants.serverName +'/api/movies/'+constants.APIKEY+"?search="+this.state.query+"&"+this.props.query,{responseType: 'json'}).then(function(response) {
			this.setState({
				data:response.data.Data
			});
		}.bind(this));
	}
	render() {
		const self=this;
		var movies = this.state.data.map((movie) =>{
				return <MovieItem key={movie.id} onClick={this.handleClick.bind(this, movie.id, this.props.user_id)} movie={movie}/>						
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
		
		var querystring = require('querystring');

		axios.post(constants.serverName+'/api/vote/'+constants.APIKEY, querystring.stringify({
			user_id:user_id,
			movie_id:key
		}),{
			headers:{'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
		}).then(function(response) {
			if(!response.data.Error) {
				this.props.history.replaceState(null,'/vote_result');
			}
		}).catch(function(err){});		
	}

	handleSearch(querystring) {
		this.setState({query:querystring});
		this.loadData();
	}
}

class SearchItem extends React.Component {
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