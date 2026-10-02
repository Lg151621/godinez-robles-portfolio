import Image from 'next/image';
import { projects } from '@/data/projects';
import { Arrow } from './Arrow';
import { Reveal } from './Reveal';
import { RevealImage } from './motion/RevealImage';
import { ProjectSequence } from './motion/ProjectSequence';
export function ProjectShowcase() {
  return (
    <section id="work" className="content-section work-section" aria-labelledby="work-title">
      <Reveal>
        <div className="section-topline">
          <span className="eyebrow">01 / SELECTED EXPLORATIONS</span>
          <span className="eyebrow">DESIGN WITH DIRECTION</span>
        </div>
        <div className="section-heading">
          <h2 id="work-title">
            A little of
            <br />
            what&apos;s <em>possible.</em>
          </h2>
          <p>
            Thoughtful design. Solid foundations.
            <br />A feeling that stays with you.
            <span className="sample-note">Illustrative concepts. Client work coming soon.</span>
          </p>
        </div>
      </Reveal>
      <ProjectSequence>
        {projects.map((project, index) => (
          <article key={project.id} className={`project project-${project.id}`}>
            <div className="project-presentation">
              <div className="project-art" aria-label={`${project.name} concept website preview`}>
                <div className="project-scroll-image">
                  <RevealImage>
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes={
                        index === 0
                          ? '(max-width: 760px) 100vw, 90vw'
                          : '(max-width: 760px) 100vw, 65vw'
                      }
                      className="project-photo"
                    />
                  </RevealImage>
                </div>
                <div className="project-art-shade" />
                <div className="preview-nav" aria-hidden="true">
                  <span className="preview-brand">{project.name.toLowerCase()}</span>
                  <span>
                    {index === 0
                      ? 'Spaces / Our approach / Inquire'
                      : 'Stories / Places / Perspective'}
                  </span>
                </div>
                <div className="preview-heading" aria-hidden="true">
                  <span className="eyebrow">{project.previewSubtitle}</span>
                  <span className="preview-title">{project.previewTitle}</span>
                </div>
                <div className="preview-bottom" aria-hidden="true">
                  <span>
                    {index === 0
                      ? 'A different way of being at home.'
                      : 'Small stories. Wide horizons.'}
                  </span>
                  <span>
                    EXPLORE <Arrow />
                  </span>
                </div>
                <span className="concept-stamp">DESIGN CONCEPT</span>
              </div>
              <div className="project-info">
                <span className="project-number">0{index + 1}</span>
                <div className="project-title">
                  <h3>{project.name}</h3>
                  <p>{project.category}</p>
                </div>
                <div className="project-meta">
                  <span>{project.client}</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
            <details className="project-details">
              <summary>
                <span>About this concept</span>
                <Arrow diagonal />
              </summary>
              <div>
                <p>{project.notes}</p>
                <ul aria-label="Technologies">
                  {project.technology.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                {project.liveUrl ? (
                  <a
                    className="inline-link"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit live website <Arrow diagonal />
                  </a>
                ) : null}
              </div>
            </details>
          </article>
        ))}
      </ProjectSequence>
    </section>
  );
}
