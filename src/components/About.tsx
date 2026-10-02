import { site } from '@/data/site';
import { Reveal } from './Reveal';
export function About() {
  return (
    <section id="about" className="content-section about-section" aria-labelledby="about-title">
      <div className="section-topline">
        <span className="eyebrow">02 / THE PEOPLE BEHIND THE PIXELS</span>
        <span className="eyebrow">SMALL BY DESIGN</span>
      </div>
      <Reveal>
        <div className="about-heading">
          <h2 id="about-title">
            Two perspectives.
            <br />
            <em>One shared purpose.</em>
          </h2>
          <p>
            We&apos;re Leonardo and Sevastian. Two independent web developers who believe the best
            websites begin with a conversation.
            <br />
            <br />
            From the first idea to the final detail, you work directly with the people making it
            happen.
          </p>
        </div>
      </Reveal>
      <div className="founders">
        {site.founders.map((founder, i) => (
          <Reveal key={founder.name} className="founder">
            <span className="eyebrow">0{i + 1} / CO-FOUNDER</span>
            <h3>
              {founder.name.split(' ')[0]}
              <br />
              <span>{founder.name.split(' ').slice(1).join(' ')}</span>
            </h3>
            <div className="founder-bottom">
              <span>{founder.role}</span>
              <span className="founder-monogram" aria-hidden="true">
                {founder.initials}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
