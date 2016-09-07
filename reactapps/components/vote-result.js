import React from 'react';
import axios from 'axios';
import constants from '../constants';
import styles from '../../css/vote.css';
import ResultMovieItem from './result-movie-item';

class VoteResult extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title:"",
			votedMovieId:0,
			sum:0,
			data:this.props.initialData || [],
			query:""
		}
	}
	componentDidMount() {
		if (!this.props.initialData) {
			this.loadData();
		}
	}
	loadData() {
		axios.get(constants.serverName +'/api/vote/'+constants.APIKEY+"?user_id="+this.props.user_id,{responseType: 'json'}).then(function(response) {
			if (response.data.Data != null) {
				var result = response.data.Data[0];
				this.setState({
					votedMovieId:result.movie_id,
					title:result.user_name + " 님의 투표 결과",
				});
				axios.get(constants.serverName +'/api/movies/'+constants.APIKEY+"?search="+this.state.query+"&"+this.props.query,{responseType: 'json'}).then(function(response) {
					this.setState({
						data:response.data.Data
					});
					axios.get(constants.serverName +'/api/stat/sum/'+constants.APIKEY,{responseType: 'json'}).then(function(response) {
						console.log(response.data.Data[0].sum);
						this.setState({
							sum:response.data.Data[0].sum
						});
					}.bind(this));
				}.bind(this));
				
			}
			else {
				alert("투표를 완료한 사용자만 결과를 볼 수 있습니다. 투표 페이지로 이동합니다.");
				this.props.history.replaceState(null,'/vote');
			}
		}.bind(this));
	}
	render() {
		const self=this;
		var movies = this.state.data.map((movie) =>{
			if(movie.id == this.state.votedMovieId)
				return <ResultMovieItem key={movie.id} Voted='T' movie={movie} sum={this.state.sum}/>;
			else
				return <ResultMovieItem key={movie.id} movie={movie} sum={this.state.sum}/>;
		});
		return (
			<div className={styles.app}>
				<div className={styles.apptitle}>{this.state.title}</div>
				<ul className={styles.list}>
					{movies}
				</ul>
			</div>
		);
	}
}
export default VoteResult;