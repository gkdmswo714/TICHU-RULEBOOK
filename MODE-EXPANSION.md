# 인원·게임 모드 확장 완료 기록

2026-10-15, 현재 로컬 소스를 기준으로 구현했습니다.

## 추가·변경 기능

- 4·5·6·7~12인 선택 카드, 6인 팀전/개인전 선택, 7~12인 정확한 인원 선택.
- 현재 모드 표시와 변경. 기존 4/5/6인 저장값을 복원하며 기존 6인은 팀전으로 처리.
- 6~12인 개인전의 별도 규칙·검색·질문 API·카드 상세 안내.
- 7인 이상 카드 두 세트 준비 권장. 112장은 준비 총량이며 실제 사용량은 미확정.
- 인원별 계급도. 5인은 황제·재상·장군·평민·천민 유지. 새 개인전도 황제~천민 수업용 명칭.
- 이름 입력, 순서대로 순위 기록, 위/아래 순위 수정, 마지막 기록 취소, 다음 라운드용 지난 순위, 인원별 브라우저 저장, 확인 후 초기화.
- 본문 큰 TICHU 이미지 타이포 제거. 상단과 하단 작은 로고, 카드 자산과 픽셀 NPC 유지.

## 새 파일

- src/components/GameSelector.tsx
- src/components/IndividualGuide.tsx
- src/data/gameSelection.ts
- src/data/gameRules.ts
- src/lib/gameSearch.ts
- src/lib/rankRecord.ts
- scripts/check-game-modes.cjs
- MODE-EXPANSION.md

## 수정 파일

- src/types/index.ts
- src/components/GuideApp.tsx
- src/components/CardGallery.tsx
- src/components/NPC.tsx
- src/app/api/chat/route.ts
- src/app/globals.css

빌드 실행으로 Next.js 생성 파일과 빌드 출력도 갱신됩니다. 기존 규칙 원본 rules.ts/fivePlayer.ts, 카드 원본·이미지, Learning.tsx 및 RuleExperiences.tsx는 이번 확장에서 수정하지 않았습니다.

## 검사 결과

- TypeScript: `tsc --noEmit --incremental false` 통과.
- 기존 check-five-rules.cjs와 check-rule-lessons.cjs 통과.
- check-game-modes.cjs: 허용/금지 조합, 저장값 복원, 기존 규칙 동일성, 5~12인 계급 수·고유성, 기록 무결성, 모드별 검색, API 18개 조합 및 기존 요청 호환 통과.
- `.next-verify`를 사용한 프로덕션 빌드 통과.
- 실제 브라우저: 4인 팀전, 5인 개인전, 6인 두 방식, 7~12인 전환과 각 계급·입력 수 확인.
- 실제 브라우저: 8인 이름 입력, 전체 순위 기록, 순위 교체와 계급 갱신, 새로고침 복원, 다음 라운드의 지난 순위 확인. 테스트 기록 초기화 완료.
- 카드 도감 56장, 특수 4장 필터, 참새 상세, 다음 카드 이동 확인.
- 12인 NPC의 카드 교환 질문에 미확정 규칙 안내와 관련 링크 응답 확인.
- 320/375/390/430/1280px 본문 가로 넘침 없음. 모바일 4개 인원 카드 2열, 정확한 인원 선택 3열 확인.
- 실제 휴대폰 하드웨어의 터치 동작이나 전체 화면 낭독기 검사는 수행하지 않았습니다.

## 공식 설명서 확인이 필요한 규칙

새 6~12인 개인전의 사용/제외 카드, 정확한 분배량, 중복 특수 카드 효과, 허용 조합과 비교, 폭탄, 첫 선·방향·패스·종료 조건, 순위별 자리, 교환 대상·방향·수량·첫 판 예외는 아직 미확정입니다. 기존 5인 규칙이나 팀전 규칙을 자동 적용하지 않습니다. 새 계급명은 공식 명칭이 아닌 수업용 예시입니다.

현재 개발 미리보기: http://localhost:3010/
