import { RevealText } from './motion/RevealText';
import { timing } from '@/lib/motion';
const principles = [
  {
    word: 'PURPOSE',
    qualifier: 'over decoration.',
    description:
      'A beautiful website should do something meaningful. We begin with what your business needs to accomplish.',
  },
  {
    word: 'CLARITY',
    qualifier: 'over complexity.',
    description:
      'Every decision should make the experience easier. We keep what matters and question everything else.',
  },
  {
    word: 'PEOPLE',
    qualifier: 'before technology.',
    description:
      'The best tools serve the people using them. We value honest conversations, thoughtful choices, and careful craft.',
  },
];
export function Principles() {
  return (
    <section id="principles" className="principles-section" aria-labelledby="principles-title">
      <div className="section-topline">
        <span id="principles-title" className="eyebrow">
          03 / WHAT WE BELIEVE
        </span>
        <span className="eyebrow">A FEW THINGS WE WON&apos;T COMPROMISE</span>
      </div>
      {principles.map((principle, index) => (
        <div key={principle.word} className="principle">
          <div className="principle-heading">
            <span className="principle-index eyebrow">0{index + 1}</span>
            <h2>
              <span>
                <RevealText>{principle.word}</RevealText>
              </span>
              <em>
                <RevealText delay={timing.stagger}>{principle.qualifier}</RevealText>
              </em>
            </h2>
          </div>
          <p>{principle.description}</p>
        </div>
      ))}
      <div className="principles-footnote">
        <span aria-hidden="true">✳</span>
        <p>
          Good work starts with a reason.
          <br />
          Everything else follows.
        </p>
      </div>
    </section>
  );
}
