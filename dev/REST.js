var bodyParser = require('body-parser')

function REST_ROUTER(router,conn) {
    var self = this;
    self.handleRoutes(router,conn);
}

REST_ROUTER.prototype.handleRoutes= function(router,conn) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    })

    // 조건에 따라 영화 정보를 가져오는 API endpoint
    router.get("/api/movies/:apikey",function(req,res) { 
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
                else
                {
                    var query = "select * from movies where ";
                    var flag = false;
                    if(req.query.year) {// 숫자만 입력되는지 검사할 것
                        query = query + "year(premier)="+req.query.year;
                        flag = true;
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
                    if(!flag) query = "select * from movies";
			
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
    router.get("/api/vote/:apikey",function(req,res){ 
        var apikey = req.params.apikey;
        var host = req.hostname;
        var apikey = req.params.apikey;
        var user_id = apikey + req.query.user_id;

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
                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
                else {
                    if(user_id==undefined)
                        res.json({"Error":true, "Message":"User information undefined"});
                    else {
                        var query = "select * from votes where votes.user_id in (select id from users where users.user_id='" + user_id + "');";
                        console.log(query);
                        conn.query(query, function(err,rows) {
                            if(err) {
                                res.json({"Error":true, "Message":"Error excuting MySQL query..","Data":null});
                            }
                            else {
                                res.json({"Error":false, "Message":"Success","Data":rows});
                            }
                        })
                    }
                }
            }
        });        
    });


    // 투표추가 API endpoint  
    router.post("/api/vote/:apikey", function(req,res){
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
                            }
                            else {
                                query = "insert into votes(user_id, movie_id) select id," + req.body.movie_id
                                    + " from users where user_id='"+req.params.apikey + req.body.user_id + "'";

                                console.log(query);
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
}

module.exports = REST_ROUTER;
