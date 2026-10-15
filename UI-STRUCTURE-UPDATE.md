# UI·콘텐츠 구조 통합 수정

## 수정 파일
- src/components/GuideApp.tsx: 기본 순서의 중복 BASIC RULES 제거, 필수 용어 연결, 순위 기록 중복 제거, 규칙 진입 주소를 필수 용어로 변경, 슬로건 삭제.
- src/components/Learning.tsx: 학습 메뉴 번호, 5인 세금 안내를 정적 계급 목록으로 변경, 순위 기록은 게임 진행 단계로 이동.
- src/components/IndividualGuide.tsx: 공통 카드 준비 안내, 정적 계급 목록, 개인전 게임 진행 단계의 순위 기록.
- src/components/HomeIntroduction.tsx: 모든 모드의 홈 카드 준비 안내 통일.
- src/components/CardOverview.tsx: 카드 설명의 일반 카드 위계 및 05 특수 카드, 중복 제목 ID 방지.
- src/components/Rules.tsx: 간결한 필수 용어, 참새 실전 주의사항, 항목 바로 아래에 열리는 단일 조합 아코디언, 실제 카드 비교 예시.
- src/app/globals.css: 모바일 2×2 학습 메뉴, 계급 목록, 카드 준비 안내, 카드 위계와 비교 예시 스타일.
- scripts/check-home-content.cjs: 10개 모드의 홈 준비 안내, 용어 구성, 카드 위계, 조합 순서, 정적 계급 목록 검사.

## 삭제·정리
중복 BASIC RULES 제목과 아코디언, 필수 용어의 플레이 예시·상세 조합, 하단 순위 입력 중복, 계급 안내의 세금표·화살표 다이어그램, 지정된 슬로건을 화면에서 제거했습니다. 검색용 원본 규칙 데이터와 실제 게임 진행에서 필요한 세금 절차는 유지합니다.

## 유지
로고, Pretendard, 카드 이미지·도감·필터, NPC 4종, 검색·질문, 4~12인 선택, 6인 팀전/개인전 구분, 순위 저장 데이터, 홈→카드→규칙 흐름과 하단 메뉴 순서를 유지합니다. 4인·6인 팀전은 1000점, 개인전은 계급 기준입니다.

## 검증
- npm run typecheck: 통과.
- 별도 빌드 폴더를 사용하는 npm run build: 통과.
- check-home-content.cjs: 10개 모드와 콘텐츠 구조 검사 통과.
- check-five-rules.cjs: 통과.
- check-rule-lessons.cjs: 27개 질의 및 규칙 분리 검사 통과.

## 추가 확인
실제 브라우저에서 320~1280px 화면, 아코디언 애니메이션·스크롤·키보드 조작, NPC와 콘텐츠 겹침을 확인하지 못했습니다. 이번 첨부에는 마지막 RANK SYSTEM 이미지가 없으므로 요청서의 구체적인 디자인 명세를 따랐으며 이미지와의 일치 여부는 확인이 필요합니다.
