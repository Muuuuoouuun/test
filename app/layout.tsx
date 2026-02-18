import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Academy OS — Keynote Landing',
  description: 'A minimal premium landing page for scalable private academies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
