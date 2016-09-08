-- create table query
CREATE TABLE `movies` (
  `id` int(10) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `director_name` varchar(45) DEFAULT NULL,
  `summary` tinytext,
  `premier` date DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `vote_count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8


-- update query
---- 사용자가 특정 영화에 투표할 때 해당 영화의 득표수를 1 증가시키는 쿼리
update movies set vote_count = vote_count + 1 where id = 'MOVIE_ID';


-- select query
---- 모든 영화들의 득표수 합을 조회하는 쿼리
select sum(vote_count) as sum from movies;
---- Movies table에 있는 모든 영화의 “영화 제목”, “좋아하는 사람 수" 를 조회하는 쿼리
select title, vote_count from movies;
---- 영화제목에 특정 문자열이 포함된 영화를 조회하는 쿼리
select * from movies where title like '%SEARCH_QUERY_STRING%';
---- 특정 장르 영화를 조회하는 쿼리
select title, vote_count from movies where genre = "멜로/로맨스";
---- 특정 년도에 개봉된 영화를 조회하는 쿼리
select title, vote_count from movies where year(premier) = 2016;
---- 조회수가 가장 높은 영화 5개를 조회하는 쿼리
select * from movies order by vote_count desc limit 5;