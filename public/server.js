module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(2)({
		"presets": ["es2015", "react"]
	});

	var express = __webpack_require__(3);
	var mysql = __webpack_require__(4);
	var bodyParser = __webpack_require__(5);
	var dbinfo = __webpack_require__(6);
	var app = express();
	var path = __webpack_require__(7);

	function server() {
		var self = this;
		self.connectMysql();
	}

	server.prototype.connectMysql = function () {
		var self = this;
		var pool = mysql.createPool(new dbinfo());

		pool.getConnection(function (err, conn) {
			if (err) {
				self.stop(err);
			} else {
				self.configureExpress(conn);
			}
		});
	};

	server.prototype.configureExpress = function (conn) {
		var self = this;
		app.set('port', process.env.PORT || 3000);
		app.use(function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Content-Type");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			next();
		});
		app.set('views', './templates');
		app.set('view engine', 'ejs');
		app.use('/public', express.static(path.join(__dirname, '..', '/public')));
		console.log(__dirname);
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());
		var restRouter = __webpack_require__(8)(conn);
		app.use('/api', restRouter);

		var reactRouter = __webpack_require__(9)();
		app.get('*', reactRouter);

		self.startServer();
	};

	server.prototype.startServer = function () {
		app.listen(3000, function () {
			console.log("All right ! I am alive at Port 3000.");
		});
	};

	server.prototype.stop = function (err) {
		console.log("ISSUE WITH MYSQL n" + err);
		process.exit(1);
	};

	new server();

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("babel-core/register");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("mysql");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	function db_settings() {
		// Change parameters to connect MySQL server
		return {
			connectionLimit: 100,
			host: 'localhost',
			user: 'root',
			password: 'makenaituyosa5*',
			database: 'vote_widget',
			debug: false };
	}

	module.exports = db_settings;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var bodyParser = __webpack_require__(5);
	var express = __webpack_require__(3);

	module.exports = function (conn) {
	    'use strict';

	    var router = express.Router();

	    // 전체 투표수를 가져오는 api
	    router.get("/stat/sum/:apikey", function (req, res) {
	        var apikey = req.params.apikey;
	        var host = req.hostname;

	        // API key 검증
	        var query = "select * from apiclient where domain='" + host + "' and apikey='" + apikey + "';";
	        conn.query(query, function (err, rows) {
	            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
	            if (err) {
	                res.json({ "Error": true, "Message": "Error excuting apiclient query..", "Data": null });
	            } else {
	                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
	                if (rows.length == 0) {
	                    res.json({ "Error": true, "Message": "Matched API key does not exist", "Data": null });
	                }
	                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
	                else {
	                        var query = "select sum(vote_count) as sum from movies";
	                        conn.query(query, function (err, rows) {
	                            if (err) {
	                                res.json({ "Error": true, "Message": "Error excuting select movie query..", "Data": null });
	                            } else {
	                                res.json({ "Error": false, "Message": "Success", "Data": rows });
	                            }
	                        });
	                    }
	            }
	        });
	    });

	    // 조건에 따라 영화 정보를 가져오는 API endpoint
	    router.get("/movies/:apikey", function (req, res) {
	        var apikey = req.params.apikey;
	        var host = req.hostname;
	        // API key 검증
	        var query = "select * from apiclient where domain='" + host + "' and apikey='" + apikey + "';";

	        conn.query(query, function (err, rows) {
	            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
	            if (err) {
	                res.json({ "Error": true, "Message": "Error excuting apiclient query..", "Data": null });
	            } else {
	                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
	                if (rows.length == 0) {
	                    res.json({ "Error": true, "Message": "Matched API key does not exist", "Data": null });
	                }
	                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
	                else {
	                        var query = "select * from movies where ";
	                        var flag = false;
	                        if (req.query.search) {
	                            query = query + "title like '%" + req.query.search + "%' ";
	                            flag = true;
	                        }
	                        if (req.query.year) {
	                            // 숫자만 입력되는지 검사할 것
	                            try {
	                                var year = Number(req.query.year);
	                                if (flag) {
	                                    query = query + "and year(premier)=" + year;
	                                } else {
	                                    query = query + "year(premier)=" + year;
	                                    flag = true;
	                                }
	                            } catch (err) {
	                                res.json({ "Error": true, "Message": "year parameter is not a number", "Data": null });
	                            }
	                        }
	                        if (req.query.genre) {
	                            if (flag) {
	                                query = query + "and genre=" + req.query.genre;
	                            } else {
	                                query = query + "genre=" + req.query.genre;
	                                flag = true;
	                            }
	                        }
	                        if (req.query.country) {
	                            if (flag) {
	                                query = query + "and country=" + req.query.country;
	                            } else {
	                                query = query + "country=" + req.query.country;
	                                flag = true;
	                            }
	                        }

	                        if (!flag) query = "select * from movies ";

	                        // 투표수 순 정렬
	                        query = query + "order by vote_count desc ";

	                        // 한 화면에 보여줄 영화 수 (기본 5개)
	                        if (req.query.limit) query = query + "limit " + req.query.limit;else query = query + "limit " + 5;

	                        conn.query(query, function (err, rows) {
	                            if (err) {
	                                res.json({ "Error": true, "Message": "Error excuting select movie query..", "Data": null });
	                            } else {
	                                res.json({ "Error": false, "Message": "Success", "Data": rows });
	                            }
	                        });
	                    }
	            }
	        });
	    });

	    // 투표조회 API endpoint
	    router.get("/vote/:apikey", function (req, res) {
	        var apikey = req.params.apikey;
	        var host = req.hostname;
	        var apikey = req.params.apikey;
	        var user_id = apikey + req.query.user_id;

	        var query = "select * from apiclient where domain='" + host + "' and apikey='" + apikey + "';";
	        conn.query(query, function (err, rows) {
	            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
	            if (err) {
	                res.json({ "Error": true, "Message": "Error excuting apiclient query.." });
	            } else {
	                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
	                if (rows.length == 0) {
	                    res.json({ "Error": true, "Message": "Matched API key does not exist" });
	                }
	                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
	                else {
	                        if (user_id == undefined) res.json({ "Error": true, "Message": "User information undefined" });else {
	                            query = "select user_id, movie_id from votes where votes.user_id in (select id from users where users.user_id='" + user_id + "');";
	                            console.log(user_id);
	                            console.log(query);
	                            conn.query(query, function (err, rows) {
	                                if (err) {
	                                    res.json({ "Error": true, "Message": "Error excuting MySQL query..", "Data": null });
	                                } else {
	                                    var row = rows[0];
	                                    console.log(rows);
	                                    console.log(row);
	                                    if (row) {
	                                        query = "select votes.user_id, users.user_name, votes.movie_id, movies.title, movies.vote_count from votes, users, movies where users.id = " + row.user_id + " and movies.id = '" + row.movie_id + "';";
	                                        conn.query(query, function (err, rows) {
	                                            if (err) {
	                                                res.json({ "Error": true, "Message": "Error excuting MySQL query..", "Data": null });
	                                            } else {
	                                                res.json({ "Error": false, "Message": "Success", "Data": rows });
	                                            }
	                                        });
	                                    } else {
	                                        res.json({ "Error": false, "Message": "Success", "Data": null });
	                                    }
	                                }
	                            });
	                        }
	                    }
	            }
	        });
	    });

	    // 투표추가 API endpoint  
	    router.post("/vote/:apikey", function (req, res) {
	        var apikey = req.params.apikey;
	        var host = req.hostname;
	        var movie_id = req.body.movie_id;
	        var user_id = req.body.user_id;

	        if (movie_id == undefined || user_id == undefined) res.json({ "Error": true, "Message": "Error in form data" });else {
	            user_id = req.params.apikey + req.body.user_id;
	            // API key 검증
	            var query = "select * from apiclient where domain='" + host + "' and apikey='" + apikey + "';";
	            conn.query(query, function (err, rows) {
	                // API key 검증 쿼리 수행 에러시 에러 문구 리턴
	                if (err) {
	                    res.json({ "Error": true, "Message": "Error excuting apiclient query.." });
	                } else {
	                    // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
	                    if (rows.length == 0) {
	                        res.json({ "Error": true, "Message": "Matched API key does not exist" });
	                    }
	                    // 매칭되는 API key가 존재할 경우 vote 추가 후 결과
	                    else {
	                            var query = "select id,user_name from users where user_id='" + apikey + req.body.user_id + "';";

	                            conn.query(query, function (err, rows) {
	                                if (err) {
	                                    console.log(err);
	                                } else {
	                                    query = "insert into votes(user_id, movie_id) select id," + req.body.movie_id + " from users where user_id='" + req.params.apikey + req.body.user_id + "'";

	                                    conn.query(query, function (err, rows) {
	                                        if (err) {
	                                            console.log(err);
	                                            res.json({ "Error": true, "Message": "Error excuting MySQL query.." });
	                                        } else {
	                                            query = "update movies set vote_count = vote_count + 1 where id = " + req.body.movie_id;
	                                            conn.query(query, function (err, rows) {
	                                                if (err) {
	                                                    console.log(err);
	                                                    res.json({ "Error": true, "Message": "Error updating vote count.." });
	                                                } else {
	                                                    res.json({ "Error": false, "Message": "Success" });
	                                                }
	                                            });
	                                        }
	                                    });
	                                }
	                            });
	                        }
	                }
	            });
	        }
	    });

	    return router;
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(10);

	var _react2 = _interopRequireDefault(_react);

	var _server = __webpack_require__(11);

	var _reactRouter = __webpack_require__(12);

	var _routes = __webpack_require__(13);

	var _routes2 = _interopRequireDefault(_routes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var express = __webpack_require__(3);

	module.exports = function () {
		var getPropsFromRoute = function getPropsFromRoute(_ref, componentProps) {
			var routes = _ref.routes;

			var props = {};
			var lastRoute = routes[routes.length - 1];
			componentProps.forEach(function (componentProp) {
				if (!props[componentProp] && lastRoute.component[componentProp]) {
					props[componentProp] = lastRoute.component[componentProp];
				}
			});
			return props;
		};

		var renderRoute = function renderRoute(response, renderProps) {
			var routesProps = getPropsFromRoute(renderProps, ['loadData']);
			if (routesProps.loadData) {
				routesProps.loadData().then(function (data) {
					var handleCreateElement = function handleCreateElement(Component, props) {
						return _react2.default.createElement(Component, _extends({ initialData: data.Data }, props));
					};
					response.render('index', {
						reactInitialData: JSON.stringify(data.Data),
						content: (0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, _extends({ createElement: handleCreateElement }, renderProps)))
					});
				});
			} else {
				response.render('index', {
					reactInitialData: null,
					content: (0, _server.renderToString)(_react2.default.createElement(_reactRouter.RouterContext, renderProps))
				});
			}
		};

		var router = express.Router();

		router.get('*', function (req, res) {
			(0, _reactRouter.match)({ routes: _routes2.default, location: req.url }, function (err, redirectLocation, renderProps) {
				if (err) {
					res.status(500).send(err.message);
				} else if (renderProps) {
					renderRoute(res, renderProps);
				} else {
					res.status(404).send('Not found');
				}
			});
		});

		return router;
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(10);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(12);

	var _vote = __webpack_require__(14);

	var _vote2 = _interopRequireDefault(_vote);

	var _voteResult = __webpack_require__(19);

	var _voteResult2 = _interopRequireDefault(_voteResult);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _react2.default.createElement(
		_reactRouter.Route,
		null,
		_react2.default.createElement(_reactRouter.Route, { path: '/vote/:user', component: _vote2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: '/vote_result/:user', component: _voteResult2.default })
	);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(10);

	var _react2 = _interopRequireDefault(_react);

	var _axios = __webpack_require__(15);

	var _axios2 = _interopRequireDefault(_axios);

	var _constants = __webpack_require__(16);

	var _constants2 = _interopRequireDefault(_constants);

	var _movieItem = __webpack_require__(17);

	var _movieItem2 = _interopRequireDefault(_movieItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Vote = function (_React$Component) {
		_inherits(Vote, _React$Component);

		function Vote(props) {
			_classCallCheck(this, Vote);

			var _this = _possibleConstructorReturn(this, (Vote.__proto__ || Object.getPrototypeOf(Vote)).call(this, props));

			_this.state = {
				title: "당신이 가장 좋아하는 영화는?",
				data: _this.props.initialData || [],
				query: ""
			};
			return _this;
		}

		_createClass(Vote, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				_axios2.default.get(_constants2.default.serverName + '/api/vote/' + _constants2.default.APIKEY + "?user_id=" + this.props.params.user, { responseType: 'json' }).then(function (response) {
					var _this2 = this;

					if (response.data.Data != null) {
						this.context.router.replace('/vote_result/' + this.props.params.user, null);
					} else {
						if (!this.props.data) {
							Vote.loadData().then(function (data) {
								_this2.setState({ data: data.Data });
							});
						}
					}
				}.bind(this));
			}
		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;

				var self = this;
				var movies = this.state.data.map(function (movie) {
					return _react2.default.createElement(_movieItem2.default, { key: movie.id, onClick: _this3.handleClick.bind(_this3, movie.id, _this3.props.params.user), movie: movie });
				});
				return _react2.default.createElement(
					'div',
					{ className: 'app' },
					_react2.default.createElement(
						'div',
						{ className: 'apptitle' },
						this.state.title
					),
					_react2.default.createElement(
						'ul',
						{ className: 'list' },
						movies
					),
					_react2.default.createElement(
						'div',
						{ className: 'searchApp' },
						_react2.default.createElement(
							'div',
							null,
							'또는...'
						),
						_react2.default.createElement(SearchItem, { changeFunc: this.handleSearch.bind(this) })
					)
				);
			}
		}, {
			key: 'handleClick',
			value: function handleClick(key, user_id, ev) {
				var self = this;

				var querystring = __webpack_require__(18);

				_axios2.default.post(_constants2.default.serverName + '/api/vote/' + _constants2.default.APIKEY, querystring.stringify({
					user_id: user_id,
					movie_id: key
				}), {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
				}).then(function (response) {
					if (!response.data.Error) {
						this.context.router.replace('/vote_result/' + this.props.params.user, null);
					}
				}).catch(function (err) {});
			}
		}, {
			key: 'handleSearch',
			value: function handleSearch(querystring) {
				this.setState({ query: querystring });
				this.loadData();
			}
		}]);

		return Vote;
	}(_react2.default.Component);

	var SearchItem = function (_React$Component2) {
		_inherits(SearchItem, _React$Component2);

		function SearchItem() {
			_classCallCheck(this, SearchItem);

			var _this4 = _possibleConstructorReturn(this, (SearchItem.__proto__ || Object.getPrototypeOf(SearchItem)).call(this));

			_this4.state = {
				value: ""
			};
			_this4.propTypes = {
				changeFunc: _react2.default.PropTypes.func
			};
			return _this4;
		}

		_createClass(SearchItem, [{
			key: 'render',
			value: function render() {
				return _react2.default.createElement('input', { id: 'search-querystring', type: 'text', placeholder: '찾으시려는 영화명을 입력하세요 :)', onKeyUp: this.handleChange.bind(this), onFocus: this.handleFocus.bind(this) });
			}
		}, {
			key: 'handleChange',
			value: function handleChange(e) {
				this.setState({
					value: e.target.value
				});
				this.props.changeFunc(e.target.value);
			}
		}, {
			key: 'handleFocus',
			value: function handleFocus() {
				document.getElementById('search-querystring').value = '';
			}
		}]);

		return SearchItem;
	}(_react2.default.Component);

	;

	Vote.propTypes = {
		initialData: _react2.default.PropTypes.any
	};

	Vote.loadData = function () {
		return _axios2.default.get(_constants2.default.serverName + '/api/movies/' + _constants2.default.APIKEY, { responseType: 'json' }).then(function (response) {
			return response.data;
		});
	};

	Vote.contextTypes = {
		router: _react2.default.PropTypes.object.isRequired
	};

	exports.default = Vote;

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("axios");

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		serverName: 'http://localhost:3000',
		APIKEY: 'A1B2C3D4E5',
		USERID: '3'
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(10);

	var _react2 = _interopRequireDefault(_react);

	var _axios = __webpack_require__(15);

	var _axios2 = _interopRequireDefault(_axios);

	var _constants = __webpack_require__(16);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var MovieItem = function (_React$Component) {
		_inherits(MovieItem, _React$Component);

		function MovieItem() {
			_classCallCheck(this, MovieItem);

			return _possibleConstructorReturn(this, (MovieItem.__proto__ || Object.getPrototypeOf(MovieItem)).apply(this, arguments));
		}

		_createClass(MovieItem, [{
			key: 'render',
			value: function render() {
				return _react2.default.createElement(
					'li',
					{ className: 'item', onClick: this.props.onClick },
					_react2.default.createElement(
						'div',
						{ className: 'itemBasic' },
						this.props.movie.title,
						' ',
						_react2.default.createElement(
							'span',
							{ className: 'director_name' },
							'by ',
							this.props.movie.director_name
						),
						_react2.default.createElement(
							'span',
							{ className: 'premier' },
							'(',
							this.props.movie.premier.substr(0, 4),
							')'
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'itemMO' },
						this.props.movie.summary
					)
				);
			}
		}]);

		return MovieItem;
	}(_react2.default.Component);

	exports.default = MovieItem;

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = require("querystring");

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(10);

	var _react2 = _interopRequireDefault(_react);

	var _axios = __webpack_require__(15);

	var _axios2 = _interopRequireDefault(_axios);

	var _constants = __webpack_require__(16);

	var _constants2 = _interopRequireDefault(_constants);

	var _resultMovieItem = __webpack_require__(20);

	var _resultMovieItem2 = _interopRequireDefault(_resultMovieItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var VoteResult = function (_React$Component) {
		_inherits(VoteResult, _React$Component);

		function VoteResult(props) {
			_classCallCheck(this, VoteResult);

			var _this = _possibleConstructorReturn(this, (VoteResult.__proto__ || Object.getPrototypeOf(VoteResult)).call(this, props));

			_this.state = {
				title: "",
				votedMovieId: 0,
				sum: 0,
				data: _this.props.initialData || [],
				query: ""
			};
			return _this;
		}

		_createClass(VoteResult, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				var _this2 = this;

				if (!this.props.data) {
					VoteResult.loadData().then(function (data) {
						_this2.setState({ data: data.Data });
					});
				}
				this.loadInfo();
			}
		}, {
			key: 'loadInfo',
			value: function loadInfo() {
				_axios2.default.get(_constants2.default.serverName + '/api/vote/' + _constants2.default.APIKEY + "?user_id=" + this.props.params.user, { responseType: 'json' }).then(function (response) {
					console.log(response);
					if (response.data.Data != null) {
						var result = response.data.Data[0];
						this.setState({
							votedMovieId: result.movie_id,
							title: result.user_name + " 님의 투표 결과"
						});
						_axios2.default.get(_constants2.default.serverName + '/api/stat/sum/' + _constants2.default.APIKEY, { responseType: 'json' }).then(function (response) {
							console.log(response.data.Data[0].sum);
							this.setState({
								sum: response.data.Data[0].sum
							});
						}.bind(this));
					} else {
						// this.context.router.replace('/vote/'+this.props.params.user,null);
					}
				}.bind(this));
			}
		}, {
			key: 'render',
			value: function render() {
				var _this3 = this;

				var self = this;
				var movies = this.state.data.map(function (movie) {
					if (movie.id == _this3.state.votedMovieId) return _react2.default.createElement(_resultMovieItem2.default, { key: movie.id, Voted: 'T', movie: movie, sum: _this3.state.sum });else return _react2.default.createElement(_resultMovieItem2.default, { key: movie.id, movie: movie, sum: _this3.state.sum });
				});
				return _react2.default.createElement(
					'div',
					{ className: 'app' },
					_react2.default.createElement(
						'div',
						{ className: 'apptitle' },
						this.state.title
					),
					_react2.default.createElement(
						'ul',
						{ className: 'list' },
						movies
					)
				);
			}
		}]);

		return VoteResult;
	}(_react2.default.Component);

	VoteResult.propTypes = {
		initialData: _react2.default.PropTypes.any
	};

	VoteResult.loadData = function () {
		return _axios2.default.get(_constants2.default.serverName + '/api/movies/' + _constants2.default.APIKEY, { responseType: 'json' }).then(function (response) {
			return response.data;
		});
	};

	VoteResult.contextTypes = {
		router: _react2.default.PropTypes.object.isRequired
	};

	exports.default = VoteResult;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(10);

	var _react2 = _interopRequireDefault(_react);

	var _axios = __webpack_require__(15);

	var _axios2 = _interopRequireDefault(_axios);

	var _constants = __webpack_require__(16);

	var _constants2 = _interopRequireDefault(_constants);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ResultMovieItem = function (_React$Component) {
		_inherits(ResultMovieItem, _React$Component);

		function ResultMovieItem() {
			_classCallCheck(this, ResultMovieItem);

			return _possibleConstructorReturn(this, (ResultMovieItem.__proto__ || Object.getPrototypeOf(ResultMovieItem)).apply(this, arguments));
		}

		_createClass(ResultMovieItem, [{
			key: 'render',
			value: function render() {
				var rate = String(this.props.movie.vote_count * 100 / this.props.sum) + " %";
				if (this.props.Voted) {
					return _react2.default.createElement(
						'li',
						{ className: 'itemSelected', onClick: this.props.onClick },
						_react2.default.createElement(
							'div',
							{ className: 'itemBasic' },
							_react2.default.createElement(
								'span',
								{ className: 'voted' },
								'voted'
							),
							this.props.movie.title,
							' ',
							_react2.default.createElement(
								'span',
								{ className: 'director_name' },
								'by ',
								this.props.movie.director_name
							),
							_react2.default.createElement(
								'span',
								{ className: 'premier' },
								'(',
								this.props.movie.premier.substr(0, 4),
								')'
							),
							_react2.default.createElement(
								'span',
								{ className: 'rate' },
								rate
							)
						)
					);
				} else {
					return _react2.default.createElement(
						'li',
						{ className: 'itemFinished', onClick: this.props.onClick },
						_react2.default.createElement(
							'div',
							{ className: 'itemBasic' },
							this.props.movie.title,
							' ',
							_react2.default.createElement(
								'span',
								{ className: 'director_name' },
								'by ',
								this.props.movie.director_name
							),
							_react2.default.createElement(
								'span',
								{ className: 'premier' },
								'(',
								this.props.movie.premier.substr(0, 4),
								')'
							),
							_react2.default.createElement(
								'span',
								{ className: 'rate' },
								rate
							)
						)
					);
				}
			}
		}]);

		return ResultMovieItem;
	}(_react2.default.Component);

	exports.default = ResultMovieItem;

/***/ }
/******/ ]);