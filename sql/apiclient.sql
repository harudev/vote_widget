-- create table query
CREATE TABLE `apiclient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(100) DEFAULT NULL,
  `apikey` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8


-- select query

---- 등록된 API Client인지 확인하기 위한 쿼리
---- APIKEY는 HOSTNAME 등록 시 md5를 이용해 20자리 문자열을 생성, 발급한다
select * from apiclient where domain='HOSTNAME' and apikey='APIKEY';