import { Reveal } from './Reveal';
const services = [
  {
    name: 'Website design',
    tags: 'STRATEGY / DIRECTION / DESIGN',
    description:
      'Clear structure, expressive visual design, and a considered experience. Business websites, portfolios, and landing pages shaped around your goals.',
  },
  {
    name: 'Web development',
    tags: 'RESPONSIVE / ACCESSIBLE / FAST',
    description:
      'Responsive websites built with maintainable code. Thoughtful interactions, accessible foundations, and layouts that work beautifully across devices.',
  },
  {
    name: 'Website redesigns',
    tags: 'RETHINK / REFINE / REBUILD',
    description:
      'A fresh perspective on what you already have. We look at what is working, find what is getting in the way, and give your website a clear way forward.',
  },
  {
    name: 'Care & maintenance',
    tags: 'SUPPORT / UPDATES / IMPROVEMENTS',
    description:
      'Ongoing technical care and considered improvements as your needs change. Keep your site current, dependable, and useful.',
  },
];
export function Services() {
  return (
    <section
      id="services"
      className="content-section services-section"
      aria-labelledby="services-title"
    >
      <div className="section-topline">
        <span className="eyebrow">04 / HOW WE CAN HELP</span>
      </div>
      <Reveal>
        <div className="section-heading">
          <h2 id="services-title">
            From first idea
            <br />
            to <em>what&apos;s next.</em>
          </h2>
          <p>
            A focused set of services.
            <br />
            Care in every detail.
          </p>
        </div>
      </Reveal>
      <div className="service-list">
        {services.map((service, i) => (
          <details key={service.name} className="service">
            <summary>
              <span className="eyebrow service-index">0{i + 1}</span>
              <h3>{service.name}</h3>
              <span className="eyebrow service-tags">{service.tags}</span>
              <span className="service-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{service.description}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
