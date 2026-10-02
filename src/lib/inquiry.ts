export const projectTypes = [
  'New Website',
  'Website Redesign',
  'Landing Page',
  'Portfolio Website',
  'Business Website',
  'E-commerce',
  'Booking / Scheduling',
  'Website Maintenance',
  'Not Sure Yet',
] as const;
export const budgets = [
  'Under $1,000',
  '$1,000–$2,500',
  '$2,500–$5,000',
  '$5,000–$10,000',
  '$10,000+',
  'Not sure yet',
] as const;
export const timelines = [
  'As soon as possible',
  'Within 1 month',
  '1–2 months',
  '2–3 months',
  '3+ months',
  'Flexible',
] as const;
export type ProjectInquiry = {
  name: string;
  email: string;
  business: string;
  website: string;
  projectTypes: string[];
  goal: string;
  budget: string;
  timeline: string;
  details: string;
};
export type InquiryErrors = Partial<Record<keyof ProjectInquiry, string>>;
export function parseInquiry(value: unknown): { inquiry: ProjectInquiry; errors: InquiryErrors } {
  const data = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const text = (key: string) => (typeof data[key] === 'string' ? data[key].trim() : '');
  const inquiry: ProjectInquiry = {
    name: text('name'),
    email: text('email'),
    business: text('business'),
    website: text('website'),
    projectTypes: Array.isArray(data.projectTypes)
      ? [...new Set(data.projectTypes.filter((v): v is string => typeof v === 'string'))]
      : [],
    goal: text('goal'),
    budget: text('budget'),
    timeline: text('timeline'),
    details: text('details'),
  };
  const errors: InquiryErrors = {};
  if (!inquiry.name) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email))
    errors.email = 'Please enter a valid email address.';
  if (
    !inquiry.projectTypes.length ||
    inquiry.projectTypes.some((v) => !projectTypes.includes(v as (typeof projectTypes)[number]))
  )
    errors.projectTypes = 'Choose at least one project type.';
  if (!inquiry.goal) errors.goal = 'Tell us a little about what you want to build.';
  if (!budgets.includes(inquiry.budget as (typeof budgets)[number]))
    errors.budget = 'Choose an estimated budget. Not sure yet is welcome.';
  if (!timelines.includes(inquiry.timeline as (typeof timelines)[number]))
    errors.timeline = 'Choose a timeline. Flexible is welcome.';
  for (const [key, limit] of Object.entries({
    name: 100,
    email: 254,
    business: 150,
    website: 500,
    goal: 5000,
    details: 5000,
  })) {
    if (inquiry[key as keyof Omit<ProjectInquiry, 'projectTypes'>].length > limit)
      errors[key as keyof ProjectInquiry] = `Please keep this under ${limit} characters.`;
  }
  return { inquiry, errors };
}
