import { Arrow } from './Arrow';
export function Footer() {
  return (
    <footer className="footer">
      <a href="#top" className="footer-brand">
        godinez <em>&</em> robles
      </a>
      <p>Independent minds. Intentional work.</p>
      <a href="#top" className="back-top">
        Back to top <Arrow diagonal />
      </a>
      <span className="footer-copyright">© {new Date().getFullYear()} Godinez & Robles</span>
    </footer>
  );
}
