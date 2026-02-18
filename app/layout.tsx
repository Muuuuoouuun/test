import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scalable Academy OS',
  description: 'Standardized growth platform for modern private academies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
