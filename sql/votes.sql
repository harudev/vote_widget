-- create table query
CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `movie_id` int(10) unsigned zerofill NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `movie_id_idx` (`movie_id`),
  CONSTRAINT `movie_id` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8

-- insert query
---- 투표 추가 쿼리 `users`.`user_id`를 이용하여 외래키인 `users`.`id`를 조회하여 `votes` 테이블에 추가한다.
---- API endpoint (POST /api/vote/)에서 클라이언트의 API Key와 클라이언트 유저 시스템의 User Id, 영화 id를 인자로 넘겨받는다.
---- MOVIE_ID는 상수 (특정 영화 id)
insert into votes (`user_id`, `movie_id`)
	select `id`, MOVIE_ID from users where `user_id`='APIKEY+USERID';

-- select query
---- API endpoint에 접근한 사용자의 투표여부를 조회하는 쿼리
---- users table에서 클라이언트의 API Key와 클라이언트 유저 시스템의 User Id 외래키를 조회한 후
---- 이를 이용해 votes table에서 투표 여부를 조회한다. 
select user_id, movie_id from votes
where votes.user_id
in (select id from users where users.user_id='APIKEY+USERID');
---- 투표 정보를 띄우기 위한 각종 정보를 조회하는 쿼리
---- 사용자 아이디, 사용자 이름, 영화 아이디, 영화 제목, 득표수를 조회한다.
select votes.user_id, users.user_name, votes.movie_id, movies.title, movies.vote_count
from votes, users, movies
where users.id = USER_ID and movies.id = 'MOVIE_ID';