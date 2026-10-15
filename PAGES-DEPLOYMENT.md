# GitHub Pages 배포 안내

공개 사이트: https://gkdmswo714.github.io/TICHU-RULEBOOK/

현재 공개 사이트는 `tichu-pages-source.zip` 안의 프로젝트를 빌드합니다. 저장소 루트의 기존 src와 package.json은 이전 서버 실행용 버전입니다. 루트 파일만 수정하면 공개 사이트에 반영되지 않습니다.

수정하려면 최신 ZIP을 풀고 그 안의 package.json이 있는 폴더를 VS Code에서 여세요. Node.js 22에서 `npm ci`, `npm run dev`로 미리보기합니다. 수정 후 node_modules, .next, out, .git, .env 파일을 제외하고 프로젝트 내용물을 다시 tichu-pages-source.zip으로 압축하여 저장소 루트에 교체 커밋하세요. ZIP 최상위에 package.json이 있어야 합니다.

`.github/workflows/pages.yml`이 main 커밋마다 ZIP을 풀고 규칙 검사, 프로덕션 빌드, GitHub Pages 배포를 실행합니다. Settings → Pages → Source는 GitHub Actions입니다. Actions의 Deploy Tichu Rulebook에서 성공 여부를 확인하세요.

Pages 버전에서는 FAQ를 브라우저에서 처리하므로 Vercel 계정과 API 키가 필요 없습니다. 생성형 AI는 연결되어 있지 않습니다. 첫 방문 인원 선택과 재방문 선택 저장을 유지합니다.

검증: 정적 빌드, 자연어 규칙 검색 27개, 인원별 규칙 및 FAQ 입력 검증 통과.
