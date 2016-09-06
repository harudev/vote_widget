-- create table query
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `user_name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8


-- insert query
---- user_id는
---- API를 이용하는 클라이언트가 각각 유저시스템을 보유하고 있다고 가정,
---- APIKEY에 클라이언트 유저 시스템의 USERID를 붙여서 이용한다.
INSERT INTO users (`user_id`, `user_name`) VALUES ('APIKEY+USERID', 'USERNAME');