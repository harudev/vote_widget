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
    });

    // 투표결과 처리를 위한 API endpoint
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
