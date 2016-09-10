var bodyParser = require('body-parser');
var express = require('express');


module.exports = function(conn) {
    'use strict';
    var router = express.Router();

    router.get("/user/:apikey/:userid", function(req, res) {
        var apikey = req.params.apikey;
        var host = req.hostname;

        // API key 검증
        var query = "select * from apiclient where domain='"+host+"' and apikey='"+apikey+"';";
        conn.query(query, function(err,rows)
        {
            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
            if(err) {
                res.json({"Error":true, "Message":"Error excuting apiclient query..","Data":null});
            }
            else {
                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
                if(rows.length == 0) {
                    res.json({"Error":true, "Message":"Matched API key does not exist","Data":null});
                }
                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
                else {
                    var query = "select * from users where user_id='"+req.params.userid+"'";
                    conn.query(query, function(err,rows) {
                        if(err) {
                            res.json({"Error":true, "Message":"Error excuting select movie query..","Data":null});
                        }
                        else {
                            res.json({"Error":false, "Message":"Success","Data":rows});
                        }
                    });
                }
            }
        });
    });

    router.post("/user/:apikey", function(req, res) {
        var apikey = req.params.apikey;
        var host = req.hostname;

        // API key 검증
        var query = "select * from apiclient where domain='"+host+"' and apikey='"+apikey+"';";
        conn.query(query, function(err,rows)
        {
            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
            if(err) {
                res.json({"Error":true, "Message":"Error excuting apiclient query.."});
            }
            else {
                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
                if(rows.length == 0) {
                    res.json({"Error":true, "Message":"Matched API key does not exist"});
                }
                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
                else {
                    query = "insert into users(user_id, user_name) values ('"+req.params.apikey + req.body.user_id +"','사용자" + req.body.user_id  +"');";
                    conn.query(query, function(err,rows) {
                        if(err) {
                            res.json({"Error":true, "Message":"Error excuting select movie query.."});
                        }
                        else {
                            res.json({"Error":false, "Message":"Success"});
                        }
                    });
                }
            }
        });        
    });
    // 전체 투표수를 가져오는 api
    router.get("/stat/sum/:apikey",function(req,res) { 
        var apikey = req.params.apikey;
        var host = req.hostname;

        // API key 검증
        var query = "select * from apiclient where domain='"+host+"' and apikey='"+apikey+"';";
        conn.query(query, function(err,rows)
        {
            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
            if(err) {
                res.json({"Error":true, "Message":"Error excuting apiclient query..","Data":null});
            }
            else {
                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
                if(rows.length == 0) {
                    res.json({"Error":true, "Message":"Matched API key does not exist","Data":null});
                }
                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
                else {
                    var query = "select sum(vote_count) as sum from movies";
                    conn.query(query, function(err,rows) {
                        if(err) {
                            res.json({"Error":true, "Message":"Error excuting select movie query..","Data":null});
                        }
                        else {
                            res.json({"Error":false, "Message":"Success","Data":rows});
                        }
                    });
                }
            }
        });
    });

    // 조건에 따라 영화 정보를 가져오는 API endpoint
    router.get("/movies/:apikey",function(req,res) { 
        var apikey = req.params.apikey;
        var host = req.hostname;
        // API key 검증
        var query = "select * from apiclient where domain='"+host+"' and apikey='"+apikey+"';";

        conn.query(query, function(err,rows)
        {
            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
            if(err) {
                res.json({"Error":true, "Message":"Error excuting apiclient query..","Data":null});
            }
            else {
                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
                if(rows.length == 0) {
                    res.json({"Error":true, "Message":"Matched API key does not exist","Data":null});
                }
                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
                else {
                    var query = "select * from movies where ";
                    var flag = false;
                    if(req.query.search) {
                        query = query + "title like '%"+req.query.search+"%' ";
                        flag = true;
                    }
                    if(req.query.year) {// 숫자만 입력되는지 검사할 것
                        if (isNaN(Number(req.query.year)))
                            res.json({"Error":true, "Message":"year parameter is not a number","Data":null});
                        else {
                            if(flag) {
                                query = query + "and year(premier)="+req.query.year;
                            }
                            else {
                                query = query + "year(premier)="+req.query.year;
                                flag = true;
                            }
                        }
                        
                    }
                    if(req.query.genre) {
                        if(flag) {
                            query = query + "and genre=" + req.query.genre;
                        }
                        else {
                            query = query + "genre=" + req.query.genre;
                            flag = true;
                        }
                    }
                    if(req.query.country) {
                        if(flag) {
                            query = query + "and country=" + req.query.country;
                        }
                        else {
                            query = query + "country=" + req.query.country;
                            flag = true;
                        }
                    }

                    if(!flag) query = "select * from movies ";

                    // 투표수 순 정렬
                    query = query + "order by vote_count desc ";

                    // 한 화면에 보여줄 영화 수 (기본 5개)
                    if (req.query.limit)
                        query = query + "limit " + req.query.limit;
                    else
                        query = query + "limit " + 5;
			
                    conn.query(query, function(err,rows) {
                        if(err) {
                            res.json({"Error":true, "Message":"Error excuting select movie query..","Data":null});
                        }
                        else
                        {
                            res.json({"Error":false, "Message":"Success","Data":rows});
                        }
                    })
                }
            }
        })
    });

    // 투표조회 API endpoint
    router.get("/vote/:apikey",function(req,res){ 
        var apikey = req.params.apikey;
        var host = req.hostname;
        var apikey = req.params.apikey;
        var user_id = apikey + req.query.user_id;

        var query = "select * from apiclient where domain='"+host+"' and apikey='"+apikey+"';";
        conn.query(query, function(err,rows) {
            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
            if(err) {
                res.json({"Error":true, "Message":"Error excuting apiclient query..","Data":null});
            }
            else {
                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
                if(rows.length == 0){
                    res.json({"Error":true, "Message":"Matched API key does not exist","Data":null});
                }
                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
                else {
                    if(user_id==undefined)
                        res.json({"Error":true, "Message":"User information undefined","Data":null});
                    else {
                        query = "select user_id, movie_id from votes where votes.user_id in (select id from users where users.user_id='" + user_id + "');";
                        conn.query(query, function(err,rows) {
                            if(err) {
                                res.json({"Error":true, "Message":"Error excuting MySQL query..","Data":null});
                            }
                            else {
                                var row = rows[0];
                                if (row) {
                                    query = "select votes.user_id, users.user_name, votes.movie_id, movies.title, movies.vote_count from votes, users, movies where users.id = " + row.user_id+ " and movies.id = '"+row.movie_id+"';";
                                    conn.query(query, function(err,rows) {
                                        if(err) {
                                            res.json({"Error":true, "Message":"Error excuting MySQL query..","Data":null});
                                        }
                                        else {
                                            res.json({"Error":false, "Message":"Success","Data":rows});
                                        }
                                    })
                                }
                                else {
                                    res.json({"Error":false, "Message":"Success","Data":null});
                                }
                            }
                        })
                    }
                }
            }
        });        
    });


    // 투표추가 API endpoint  
    router.post("/vote/:apikey", function(req,res){
        var apikey = req.params.apikey;
        var host = req.hostname;
        var movie_id = req.body.movie_id;
        var user_id = req.body.user_id;

        if(movie_id == undefined || user_id == undefined)
            res.json({"Error":true, "Message":"Error in form data"});
        else
        {
            user_id = req.params.apikey + req.body.user_id;
            // API key 검증
            var query = "select * from apiclient where domain='"+host+"' and apikey='"+apikey+"';";
            conn.query(query, function(err,rows) {
                // API key 검증 쿼리 수행 에러시 에러 문구 리턴
                if(err) {
                    res.json({"Error":true, "Message":"Error excuting apiclient query.."});
                }
                else {
                    // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
                    if(rows.length == 0){
                        res.json({"Error":true, "Message":"Matched API key does not exist"});
                    }
                    // 매칭되는 API key가 존재할 경우 vote 추가 후 결과
                    else {
                        var query = "select id,user_name from users where user_id='" + apikey + req.body.user_id + "';";

                        conn.query(query,function(err,rows) {
                            if (err) {
                                console.log(err);
                                res.json({"Error":true, "Message":err.Message});
                            } else if(rows.length==0) { // 등록된 유저가 존재하지 않을 경우
                                query = "insert into votes(user_id, movie_id) select id," + req.body.movie_id
                                        + " from users where user_id='"+req.params.apikey + req.body.user_id + "';";
                                conn.query(query, function(err,rows) {
                                    if(err) {
                                        console.log(err);
                                        res.json({"Error":true, "Message":"Error excuting MySQL query.."});
                                    }
                                    else {
                                        query = query + "update movies set vote_count = vote_count + 1 where id = "+req.body.movie_id;
                                        conn.query(query, function(err,rows) {
                                            if(err) {
                                                console.log(err);
                                                res.json({"Error":true, "Message":"Error updating vote count.."});
                                            }
                                            else{
                                                res.json({"Error":false, "Message":"Success"});
                                            }
                                        });
                                    }
                                });
                            } else { // 등록된 유저일 경우
                                query = "insert into votes(user_id, movie_id) select id," + req.body.movie_id
                                    + " from users where user_id='"+req.params.apikey + req.body.user_id + "'";
                                conn.query(query, function(err,rows) {
                                    if(err) {
                                        console.log(err);
                                        res.json({"Error":true, "Message":"Error excuting MySQL query.."});
                                    }
                                    else {
                                        query = "update movies set vote_count = vote_count + 1 where id = "+req.body.movie_id;
                                        conn.query(query, function(err,rows) {
                                            if(err) {
                                                console.log(err);
                                                res.json({"Error":true, "Message":"Error updating vote count.."});
                                            }
                                            else{
                                                res.json({"Error":false, "Message":"Success"});
                                            }
                                        });
                                    }
                                });
                            }
                        })
                        
                    }
                }
            });
        }
    });

    return router;
}