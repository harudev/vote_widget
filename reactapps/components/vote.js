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
	componentWillMount() {
		axios.get(constants.serverName +'/api/vote/'+constants.APIKEY+"?user_id="+this.props.params.user,{responseType: 'json'}).then(function(response) {
			if (response.data.Data != null) {
				this.context.router.replace('/vote_result/'+this.props.params.user,null);
			}
			else {
				if (!this.props.data) {
					Vote.loadData().then( (data) => {
						this.setState({data:data.Data})
					});
				}
			}
		}.bind(this));
	}
	
	render() {
		const self=this;
		var movies = this.state.data.map((movie) =>{
				return <MovieItem key={movie.id} onClick={this.handleClick.bind(this, movie.id, this.props.params.user)} movie={movie}/>						
		});
		return (
			<div className="app">
				<div className="apptitle">{this.state.title}</div>
				<ul className="list">
					{movies}
				</ul>
				<div className="searchApp">
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
				this.context.router.replace('/vote_result/'+this.props.params.user,null);
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
			value:""
		}
		this.propTypes = {
			changeFunc:React.PropTypes.func
		}
	}
	render () {
		return <input id="search-querystring" type="text" placeholder="찾으시려는 영화명을 입력하세요 :)" onKeyUp={this.handleChange.bind(this)} onFocus={this.handleFocus.bind(this)}/>;
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
};

Vote.propTypes = {
	initialData:React.PropTypes.any
};

Vote.loadData = () => {
	return axios.get(constants.serverName +'/api/movies/'+constants.APIKEY,{responseType: 'json'})
		.then((response) => response.data);
};

Vote.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Vote;