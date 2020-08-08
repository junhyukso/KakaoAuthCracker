
# KakaoAuthCracker

## What it is
**Android Kakaotalk** 의 내부 통신의 **인증**은
**Authorization 헤더**에 의해 이루어집니다.

이 레포는 그 헤더의 **생성 로직**을, **리버스 엔지니어링**을 통해 분석후
**Rhino Javascript**로 구현하여 작성하였습니다.
## Usage
Authcracker.js 파일을 require 후

    get_authorization_header()
  를 호출하여 사용하세요.



*tested on MessengerBot.*


