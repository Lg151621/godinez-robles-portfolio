import Image from 'next/image';
import { site } from '@/data/site';
import { Arrow } from './Arrow';
export function Footer() {
  return (
    <footer className="footer">
      <a href="#top" className="footer-brand">
        <Image
          src="/brand/vitanova-logo.svg"
          alt={site.name}
          width={270}
          height={32}
          unoptimized
          className="brand-logo"
        />
      </a>
      <p>Independent minds. Intentional work.</p>
      <a href="#top" className="back-top">
        Back to top <Arrow diagonal />
      </a>
      <span className="footer-copyright">
        © {new Date().getFullYear()} {site.name}
      </span>
    </footer>
  );
}
