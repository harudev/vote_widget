function REST_ROUTER(router,conn) {
    var self = this;
    self.handleRoutes(router,conn);
}

REST_ROUTER.prototype.handleRoutes= function(router,conn) {
    router.get("/",function(req,res){
        res.json({"Message" : "Hello World !"});
    })
    router.post("/api/movies",function(req,res) {
    	var query = "select * from movies";
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
}

module.exports = REST_ROUTER;
