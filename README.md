# vote_widget

## Introduction

영화 선호 투표를 위한 REST API와 투표 위젯

## MySQL table information


## API Key

API 사용을 위한 앱 등록 화면에서 앱 이름과 앱 설명, 앱의 최상위 도메인 (예 : example.com)를 입력하면 내부적으로 발급되는 KEY를 받을 수 있으며 API 접근시 도메인 최상단에 KEY를 입력하면 정상적으로 API 사용이 가능하다.

- 형식
- 
> /API/API_PATH/APIKEY?API_PARAMETERS
        

## REST APIs

- 영화정보 API

> /APIKEY/movies?year=XXXX&genre=XXXX&country=XXXX<br/>
> ※ 이 때 원하지 않는 조건인자 생략 가능

- 영화정보 API

> /APIKEY/movies?year=XXXX&genre=XXXX&country=XXXX<br/>
> ※ 이 때 원하지 않는 조건인자 생략 가능