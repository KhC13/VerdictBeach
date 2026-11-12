import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Logo from './Logo';
import Button from './Button';
import AnimatedSection, { Reveal } from './AnimatedSection';
import { navLinks, services } from '../data/content';
import { company } from '../config/company';

export default function Footer() {
  const { contact } = company;
  const tag = !contact.verified && (
    <span className="ml-2 rounded-full border border-gold/40 px-2 py-0.5 text-[9px] uppercase tracking-widest text-gold">Placeholder</span>
  );

  return (
    <footer className="relative overflow-hidden bg-navy text-ivory/75">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[22vw] font-semibold uppercase leading-none tracking-tight text-ivory/[0.025]"
      >
        Verdict
      </div>

      <AnimatedSection className="container-vb relative pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-relaxed">
              {company.tagline} Verdict Beach is the legal services vertical of {company.parent}.
            </p>
            <div className="mt-8">
              <Button to="/contact">Book a Consultation</Button>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2">
            <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] !text-gold">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-2">
            <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] !text-gold">Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to={`/contact?service=${s.id}`} className="transition-colors hover:text-gold-300">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] !text-gold">Contact</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="break-words">
                {contact.verified ? <a href={`mailto:${contact.email}`} className="hover:text-gold-300">{contact.email}</a> : contact.email}
                {tag}
              </li>
              <li>
                {contact.verified ? <a href={`tel:${contact.phone}`} className="hover:text-gold-300">{contact.phone}</a> : contact.phone}
                {tag}
              </li>
              <li>{contact.address}</li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ivory/10 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p>© {new Date().getFullYear()} Verdict Beach · A {company.parent} vertical.</p>
            <p className="max-w-xl text-ivory/50">
              Information on this website is general in nature and does not constitute legal advice.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 self-start text-ivory/75 transition-colors hover:text-gold-300 sm:self-auto"
          >
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </AnimatedSection>
    </footer>
  );
}
