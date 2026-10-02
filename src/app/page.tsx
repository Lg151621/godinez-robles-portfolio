import { Hero } from '@/components/Hero';
import { ProjectShowcase } from '@/components/ProjectShowcase';
import { About } from '@/components/About';
import { Principles } from '@/components/Principles';
import { Services } from '@/components/Services';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
export default function Home() {
  return (
    <main id="main" className="site-shell">
      <Hero />
      <ProjectShowcase />
      <About />
      <Principles />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
