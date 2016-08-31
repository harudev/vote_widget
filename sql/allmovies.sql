-- Movies table에 있는 모든 영화의 “영화 제목”, “좋아하는 사람 수" 를 보여주는 쿼리
select title, vote_count from movies;

-- 멜로/로맨스 장르 영화들의 "영화 제목", "좋아하는 사람 수" 를 보여주는 쿼리
select title, vote_count from movies where genre = "멜로/로맨스";

-- 2016년도에 개봉된 모든 영화의 "영화 제목", "좋아하는 사람 수" 를 보여주는 쿼리
select title, vote_count from movies where year(premier) = 2016;