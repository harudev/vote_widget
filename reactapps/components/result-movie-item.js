import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import constants from '../constants';

class ResultMovieItem extends React.Component {
	render() {
		let rate = this.props.movie.vote_count * 100 / this.props.sum;

		if(this.props.Voted) {
			return (
				<li className="itemFinished" onClick={this.props.onClick}>
					<div className="itemFinishedBasic">
						{this.props.movie.title} <span className="director_name">by {this.props.movie.director_name}</span>
						<span className="premier">({this.props.movie.premier.substr(0,4)})</span> <span className="voted">voted</span> 
					</div>
					<ChartBar max={this.props.max} rate={rate} />
				</li>
			);
		}
		else {
			return (
				<li className="itemFinished" onClick={this.props.onClick}>
					<div className="itemFinishedBasic">
						{this.props.movie.title} <span className="director_name">by {this.props.movie.director_name}</span>
						<span className="premier">({this.props.movie.premier.substr(0,4)})</span>
					</div>
					<ChartBar max={this.props.max} rate={rate}/>
				</li>
			);
		}
	}
}

class ChartBar extends React.Component {
	componentDidMount() {
		var node = ReactDOM.findDOMNode(this);
		if (node !== undefined) {
			node.children[0].style.width = String(this.props.rate * 200 / this.props.max)+"px";
		}
	}
	render() {
		let rate = String(this.props.rate) + " %";
		return (
			<div className="chartLayer">
				<div className="chart"></div>
				<div className="rate">{rate}</div>
			</div>
			);
	}
}

export default ResultMovieItem;