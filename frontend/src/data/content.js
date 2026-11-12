import { Scale, FileText, Handshake, Rocket, ShieldCheck, UserRound, Lightbulb, Building2 } from 'lucide-react';

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/for-businesses', label: 'For Businesses' },
  { to: '/contact', label: 'Contact Us' },
];

export const services = [
  {
    id: 'legal-assistance',
    icon: Scale,
    title: 'Legal Assistance',
    description:
      'Practical guidance on the legal questions that matter to you, explained plainly so you can act with confidence.',
  },
  {
    id: 'business-documentation',
    icon: FileText,
    title: 'Business Documentation',
    description:
      'Accurate, well-organised documentation prepared and reviewed to support the way your business operates.',
  },
  {
    id: 'agreements-contracts',
    icon: Handshake,
    title: 'Agreements and Contracts',
    description:
      'Clear agreements drafted and reviewed to define expectations, allocate responsibility and protect your interests.',
  },
  {
    id: 'startup-legal-support',
    icon: Rocket,
    title: 'Startup Legal Support',
    description:
      'Legal foundations for new ventures, from early structuring questions to the paperwork that supports growth.',
  },
  {
    id: 'compliance-services',
    icon: ShieldCheck,
    title: 'Compliance Services',
    description:
      'Help understanding and meeting the regulatory requirements that apply to your business, and keeping on top of them.',
  },
];

export const reasons = [
  { n: '01', title: 'Clarity first', text: 'Plain language over legal jargon. You understand what you are signing and why.' },
  { n: '02', title: 'Business-minded', text: 'Legal support shaped around commercial goals, not around process for its own sake.' },
  { n: '03', title: 'Considered detail', text: 'Careful attention to documents, terms and requirements before they become problems.' },
  { n: '04', title: 'Approachable', text: 'A straightforward first conversation, with a clear understanding of what you need.' },
];

export const audiences = [
  { icon: Rocket, title: 'Startups', text: 'Put the right legal groundwork in place from the start, without slowing the build.' },
  { icon: UserRound, title: 'Founders', text: 'Clear agreements and documentation between you, your co-founders and your partners.' },
  { icon: Lightbulb, title: 'Entrepreneurs', text: 'Practical support as you launch, formalise and take on new commercial relationships.' },
  { icon: Building2, title: 'Established companies', text: 'Dependable help with contracts, documentation and ongoing compliance obligations.' },
];

export const businessSupport = [
  { icon: FileText, title: 'Legal documentation', text: 'Preparation and review of the documents your business relies on every day.' },
  { icon: Handshake, title: 'Agreements', text: 'Contracts that set out terms clearly and reduce room for misunderstanding.' },
  { icon: ShieldCheck, title: 'Compliance requirements', text: 'Support in understanding what applies to you and meeting those requirements.' },
];

export const values = [
  { title: 'Integrity', text: 'Honest, straightforward advice, including when it is not what you hoped to hear.' },
  { title: 'Clarity', text: 'Complex legal matters explained in language that supports good decisions.' },
  { title: 'Diligence', text: 'Careful, thorough work on every document and every question.' },
  { title: 'Accessibility', text: 'Legal support that feels approachable rather than intimidating.' },
];

export const serviceOptions = services.map((s) => s.title);
