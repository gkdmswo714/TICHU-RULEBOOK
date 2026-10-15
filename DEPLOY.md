# GitHub / Vercel 배포

ZIP을 풀고 package.json이 있는 폴더의 내용을 GitHub 저장소에 올리세요. ZIP 자체를 저장소에 올리는 것으로는 배포되지 않습니다.
Vercel에서 저장소를 Import하고 Next.js 자동 감지를 사용하세요. package.json이 있는 경로를 Root Directory로 선택합니다.
Build Command: npm run build
Install Command: npm ci
별도의 API 키는 필요 없습니다. /api/chat이 있으므로 정적 GitHub Pages용 빌드는 아닙니다.

이번 앱 수정은 GuideApp.tsx와 GameSelector.tsx 두 파일뿐입니다.
첫 방문에는 기존 인원 선택창을 자동 표시합니다. 제목은 “몇 명이서 게임하나요?”입니다.
선택 완료 시 tichu-selection-complete=true를 localStorage에 저장하고 홈으로 이동합니다.
재방문 자동 표시를 생략하며 기존 변경 버튼과 모든 인원/방식 선택은 유지합니다.
기존 선택 값만 있고 완료 표시가 없는 방문자에게도 한 번 표시됩니다.
타입 검사와 프로덕션 빌드는 준비 복사본에서 통과했습니다. 브라우저 첫 방문/재방문 동작 검증은 미완료입니다.
원래 작업 폴더와 localhost 사이트는 수정되지 않았습니다. 이 ZIP이 이번 수정본입니다.
