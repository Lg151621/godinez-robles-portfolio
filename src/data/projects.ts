export type Project = {
  id: string;
  name: string;
  client: string;
  category: string;
  year: string;
  description: string;
  technology: string[];
  image: string;
  imageAlt: string;
  previewTitle: string;
  previewSubtitle: string;
  liveUrl?: string;
  concept: boolean;
  notes: string;
};
// Illustrative studies, not client commissions. Replace these with verified projects.
export const projects: Project[] = [
  {
    id: 'solace',
    name: 'Solace',
    client: 'Self-initiated concept',
    category: 'Architecture & living',
    year: '2026',
    description:
      'An exploration of quiet spaces, considered typography, and a slower pace on the web.',
    technology: ['React', 'TypeScript', 'Tailwind CSS'],
    image: '/images/solace-house.png',
    imageAlt: 'A pale stone modernist house beside olive trees and a hazy coast',
    previewTitle: 'Room to be.',
    previewSubtitle: 'CONSIDERED SPACES. QUIETER LIVING.',
    concept: true,
    notes:
      'A visual study for an architecture website. Large photography gives the spaces room to speak, while restrained navigation keeps the focus on discovery. This is sample portfolio content, not a commissioned client website. No live site is attached.',
  },
  {
    id: 'daybreak',
    name: 'Daybreak',
    client: 'Self-initiated concept',
    category: 'Independent journal',
    year: '2026',
    description:
      'A photographic journal concept about finding something extraordinary in the everyday.',
    technology: ['React', 'TypeScript', 'Tailwind CSS'],
    image: '/images/dawn-sky.png',
    imageAlt: 'Sunlight reaching through a quiet bank of clouds',
    previewTitle: 'Look a little\ncloser.',
    previewSubtitle: 'A JOURNAL FOR THE CURIOUS.',
    concept: true,
    notes:
      'A visual study for an independent editorial journal. The composition pairs expressive type with immersive photography and a simple reading hierarchy. This is sample portfolio content, not a commissioned client website. No live site is attached.',
  },
];
