import React from 'react';
import axios from 'axios';
import constants from '../constants';
import ResultMovieItem from './result-movie-item';

class VoteResult extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title:"",
			votedMovieId:0,
			sum:0,
			data:this.props.initialData || [],
			query:"",
			flag:false
		}
	}
	componentWillMount() {
		if (!this.props.data) {
			VoteResult.loadData().then( (data) => {
				this.setState({data:data.Data})
			});
		}
		this.loadInfo();
		
	}

	loadInfo() {
		axios.get(constants.serverName +'/api/vote/'+constants.APIKEY+"?user_id="+this.props.params.user,{responseType: 'json'}).then(function(response) {
			// 투표를 완료한 사용자만 결과를 볼 수 있도록
			if (response.data.Data != null) {
				var result = response.data.Data[0];
				this.setState({
					votedMovieId:result.movie_id,
					title:result.user_name + " 님의 투표 결과",
				});
				axios.get(constants.serverName +'/api/stat/sum/'+constants.APIKEY,{responseType: 'json'}).then(function(response) {
					console.log(response.data.Data[0].sum);
					this.setState({
						sum:response.data.Data[0].sum,
						flag:true
					});
				}.bind(this));
				
			}
			else {
				// 투표를 하지 않은 경우 투표페이지로 이동한다.
				this.context.router.replace('/vote/'+this.props.params.user,null);
			}
		}.bind(this));
	}
	render() {
		if(!this.state.flag)
		{
			return <div>The responsive it not here yet!</div>
		}

		let max = this.state.data[0].vote_count * 100 / this.state.sum;
		var movies = this.state.data.map((movie) =>{
			if(movie.id == this.state.votedMovieId)
				return <ResultMovieItem key={movie.id} Voted='T' movie={movie} sum={this.state.sum} max={max}/>; // 사용자가 투표한 영화 - 사용자가 투표한 영화 리스트에 없을 경우 처리 필요
			else
				return <ResultMovieItem key={movie.id} movie={movie} sum={this.state.sum} max={max}/>; // 그 외 영화
		});
		return (
			<div className="app">
				<div className="apptitle">{this.state.title}</div>
				<ul className="list">
					{movies}
				</ul>
			</div>
		);
	}
}

VoteResult.propTypes = {
	initialData:React.PropTypes.any
};

VoteResult.loadData = () => {
	return axios.get(constants.serverName +'/api/movies/'+constants.APIKEY,{responseType: 'json'})
		.then((response) => response.data);
};

VoteResult.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default VoteResult;