# vote_widget

## Introduction

영화 선호 투표를 위한 REST API와 투표 위젯

## MySQL table information

- apiclient

> id : PK<br/>
> name : 앱 이름<br/>
> description : 앱 설명<br/>
> domain : 앱 최상위 도메인<br/>
> key : 발급한 키

- movies

> id : PK, zerofill<br/>
> title : 영화제목<br/>
> director_name : 감독 이름<br/>
> summary : 줄거리<br/>
> premier : 개봉일<br/>
> genre : 장르<br/>
> country : 국가<br/>
> vote_count : 투표수 (REST API를 통해 증감)

- user

> id : PK, zerofill<br/>
> name : 사용자명<br/>
> movie_id : 영화의 PK

## API Key
API 사용을 위한 앱 등록 화면에서 앱 이름과 앱 설명, 앱의 최상위 도메인 (예 : example.com)를 입력하면 내부적으로 발급되는 KEY를 받을 수 있으며 API 접근시 도메인 최상단에 KEY를 입력하면 정상적으로 API 사용이 가능하다.

- 형식
> /APIKEY/접근을원하는API
        

## REST APIs
- 영화정보 API
> /APIKEY/movies?year=XXXX&genre=XXXX&country=XXXX<br/>
> ※ 이 때 원하지 않는 조건인자 생략 가능
- 영화정보 API
> /APIKEY/movies?year=XXXX&genre=XXXX&country=XXXX<br/>
> ※ 이 때 원하지 않는 조건인자 생략 가능
