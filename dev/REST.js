function REST_ROUTER(router,conn) {
    var self = this;
    self.handleRoutes(router,conn);
}

REST_ROUTER.prototype.handleRoutes= function(router,conn) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    })

    // 조건에 따라 영화 정보를 가져오는 API endpoint
    router.get("/movies",function(req,res) 
        var apikey = req.params.apikey;
        var host = req.hostname;

        // API key 검증
        var query = "select * from apiclient where domain='"+host+"' and apikey='"+apikey+"';";

        conn.query(query, function(err,rows)
        {
            // API key 검증 쿼리 수행 에러시 에러 문구 리턴
            if(err) {
                res.json({"Error":true, "Message":"Error excuting MySQL query..","Data":null});
            }
            else
            {
                // 매칭되는 API key가 존재하지 않을 시 에러 문구 리턴
                if(rows.length == 0)
                {
                    res.json({"Error":true, "Message":"Matched API key does not exist","Data":null});
                }
                // 매칭되는 API key가 존재할 경우 데이터 조회 후 리턴
                else
                {
                    var query = "select * from movies where ";
                    var flag = false;
                    if(req.query.year) // 숫자만 입력되는지 검사할 것
                    {
                        query = query + "year(primier)="+req.query.year;
                        flag = true;
                    }
                    if(req.query.genre)
                    {
                        if(flag) {
                            query = query + "and genre=" + req.query.genre;
                        }
                        else {
                            query = query + "genre=" + req.query.genre;
                            flag = true;
                        }
                    }
                    if(req.query.country)
                    {
                        if(flag) {
                            query = query + "and country=" + req.query.country;
                        }
                        else {
                            query = query + "country=" + req.query.country;
                            flag = true;
                        }
                    }
                    if(!flag) query = "select * from movies";

                    conn.query(query, function(err,rows)
                    {
                        if(err) {
                            res.json({"Error":true, "Message":"Error excuting MySQL query..","Data":null});
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

    // 투표결과 처리를 위한 API endpoint
    // 중복 투표를 어떻게 막을 것인가?
    // 내용 추가 필요
    router.get("/votes",function(req,res){ 
        var query = "select * from users";
        conn.query(query, function(err,rows)
        {
            if(err) {
                res.json({"Error":true, "Message":"Error excuting MySQL query..","Data":null});
            }
            else
            {
                res.json({"Error":false, "Message":"Success","Data":rows});
            }
        })
    });
    router.post("/votes",function(req,res){
        var query = "insert into ??(??,??) values (?,?)";
        var param = ["users","name","movie_id",req.body.username, req.body.movie_id];

        query = mysql.format(query, table);
       conn.query(query, function(err,rows)
        {
            if(err) {
                res.json({"Error":true, "Message":"Error excuting MySQL query.."});
            }
            else
            {
                res.json({"Error":false, "Message":"Success"});
            }
        })        
    });
}

module.exports = REST_ROUTER;
