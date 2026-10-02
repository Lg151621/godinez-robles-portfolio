import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { site } from '@/data/site';
import 'lenis/dist/lenis.css';
import './globals.css';
import { ProjectInquiryProvider } from '@/components/ProjectInquiry';
import { MotionProvider } from '@/components/motion/MotionProvider';

const sans = localFont({
  src: '../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2',
  variable: '--font-sans-face',
  display: 'swap',
});
const display = localFont({
  src: '../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2',
  variable: '--font-display-face',
  display: 'swap',
});
const serif = localFont({
  src: '../../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2',
  variable: '--font-serif-face',
  display: 'swap',
});
export const metadata: Metadata = {
  title: `${site.name} — Built with purpose.`,
  description: site.description,
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${serif.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MotionProvider>
          <ProjectInquiryProvider>{children}</ProjectInquiryProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
