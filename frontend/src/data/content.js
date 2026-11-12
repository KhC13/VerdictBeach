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
      'General legal guidance and issue assessment. Assistance in understanding legal procedures and support in identifying appropriate next steps.',
  },
  {
    id: 'business-documentation',
    icon: FileText,
    title: 'Business Documentation',
    description:
      'Business registration documentation support, drafting and review coordination for business documents, and foundational business paperwork.',
  },
  {
    id: 'agreements-contracts',
    icon: Handshake,
    title: 'Agreements & Contracts',
    description:
      'Non-Disclosure Agreements (NDAs), service and consultancy agreements, partnership and vendor agreements, and employment or freelancer agreements.',
  },
  {
    id: 'startup-legal-support',
    icon: Rocket,
    title: 'Startup Legal Support',
    description:
      'Founder and co-founder agreements, startup structuring assistance, equity and ownership documentation support, and early-stage legal foundation.',
  },
  {
    id: 'compliance-support',
    icon: ShieldCheck,
    title: 'Compliance & Regulatory Support',
    description:
      'Business compliance assistance, documentation and filing coordination, regulatory requirement tracking, and ongoing compliance support.',
  },
  {
    id: 'business-legal-advisory',
    icon: Building2,
    title: 'Business Legal Advisory',
    description:
      'Legal requirement assessment, contractual and operational risk identification, assistance with business legal decisions, and referrals or coordination with relevant legal professionals where required.',
  },
];

export const reasons = [
  { n: '01', title: 'Clarity first', text: 'Plain language over legal jargon. You understand what you are signing and why.' },
  { n: '02', title: 'Business-minded', text: 'Legal support shaped around commercial goals, not around process for its own sake.' },
  { n: '03', title: 'Considered detail', text: 'Careful attention to documents, terms and requirements before they become problems.' },
  { n: '04', title: 'Approachable', text: 'A straightforward first conversation, with a clear understanding of what you need.' },
];

export const audiences = [
  { icon: Rocket, title: 'Startups', text: 'Build the right legal foundation before your business scales.' },
  { icon: UserRound, title: 'Founders', text: 'Protect your stake, your governance rights, and your operating structure from the start.' },
  { icon: Lightbulb, title: 'SMEs & Enterprises', text: 'Organise contracts, documentation and ongoing compliance with practical, dependable support.' },
  { icon: Building2, title: 'Growing Businesses', text: 'Prepare for partnerships, expansion and changing business needs with clear legal structures in place.' },
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
