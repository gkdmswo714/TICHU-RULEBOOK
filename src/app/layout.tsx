import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "TICHU — 함께하는 카드 게임 안내서",
  description:
    "첫 한 장부터 마지막 승부까지. 4·5·6인 티츄 규칙, 56장 카드 도감과 빠른 규칙 검색.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head><link rel="preload" href="/fonts/PretendardVariable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head>
      <body>
        <a className="skip-link" href="#home">
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
