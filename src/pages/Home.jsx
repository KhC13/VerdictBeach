import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import AnimatedSection, { Reveal } from '../components/AnimatedSection';
import { ArchPattern } from '../components/ArchitectureArt';
import { services, reasons, audiences } from '../data/content';

export default function Home() {
  return (
    <>
      <HeroSection />

      {/* 1. Brand introduction */}
      <section className="section-pad">
        <div className="container-vb grid items-center gap-14 lg:grid-cols-12">
          <AnimatedSection className="lg:col-span-7">
            <SectionHeading
              eyebrow="Brand introduction"
              title={<>Verdict Beach serves as the <em className="text-gold-600">specialized legal advisory arm</em> of Belvo Ventures Group.</>}
              text="Delivering rigorous, business-oriented counsel across corporate governance, commercial contracting, and regulatory compliance."
            />
            <Reveal className="mt-10">
              <Link to="/about" className="group inline-flex items-center gap-2 border-b border-gold pb-1 text-sm font-medium text-navy hover:text-gold-600">
                Learn more about us <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Reveal>
          </AnimatedSection>

          <AnimatedSection className="grid gap-px overflow-hidden rounded-2xl border border-navy/10 bg-navy/10 lg:col-span-5">
            {[
              ['Legal Advisory', 'Decisive guidance on day-to-day commercial and strategic legal questions.'],
              ['Corporate Documentation', 'Precision drafting and organisation for your core company records.'],
              ['Commercial Agreements', 'Custom contracts built to protect your equity, IP, and commercial leverage.'],
            ].map(([t, d]) => (
              <Reveal key={t} className="bg-ivory p-7 transition-colors duration-300 hover:bg-white">
                <h3 className="font-serif text-xl">{t}</h3>
                <p className="mt-1.5 text-[15px] text-charcoal/75">{d}</p>
              </Reveal>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* 2. Services overview */}
      <section className="section-pad bg-ivory-200/60">
        <div className="container-vb">
          <AnimatedSection className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Core practice areas"
              title="Six service categories designed for growing businesses"
              text="From compliance and contracts to startup foundations and legal advisory, each service is built around the legal needs that matter most to forward-moving businesses."
            />
            <Reveal>
              <Button to="/services" variant="outlineDark">View all services</Button>
            </Reveal>
          </AnimatedSection>
          <AnimatedSection stagger={0.09} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
            <Reveal className="flex flex-col justify-center rounded-2xl border border-dashed border-gold/60 p-8 sm:col-span-2 lg:col-span-1">
              <h3 className="font-serif text-2xl">Not sure what you need?</h3>
              <p className="mt-3 text-[15px] text-charcoal/80">Start with a conversation and we will help you identify the right support.</p>
              <div className="mt-6"><Button to="/contact" variant="dark">Book a Consultation</Button></div>
            </Reveal>
          </AnimatedSection>
        </div>
      </section>

      {/* 3. Why choose */}
      <section className="section-pad relative overflow-hidden bg-navy">
        <ArchPattern className="pointer-events-none absolute -right-24 top-10 hidden w-[28rem] opacity-40 lg:block" />
        <div className="container-vb relative grid gap-14 lg:grid-cols-12">
          <AnimatedSection className="lg:col-span-5">
            <SectionHeading dark eyebrow="Why choose Verdict Beach" title="Law made straightforward, without losing the detail." />
          </AnimatedSection>
          <AnimatedSection stagger={0.12} className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
            {reasons.map((r) => (
              <Reveal key={r.n} className="group border-t border-gold/30 pt-6 transition-colors hover:border-gold">
                <span className="font-serif text-3xl text-gold">{r.n}</span>
                <h3 className="mt-3 font-serif text-2xl !text-ivory">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ivory/65">{r.text}</p>
              </Reveal>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* 4. For Businesses preview */}
      <section className="section-pad">
        <div className="container-vb grid items-center gap-14 lg:grid-cols-2">
          <AnimatedSection>
            <SectionHeading
              eyebrow="For businesses"
              title="Build your business. Not your legal headaches."
              text="From setting up your first venture to managing contracts, compliance and business relationships, get structured legal support at every stage of your growth."
            />
            <Reveal className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button to="/contact" variant="dark">Get Legal Assistance</Button>
              <Button to="/for-businesses" variant="outlineDark">For Businesses</Button>
            </Reveal>
          </AnimatedSection>
          <AnimatedSection stagger={0.09} className="grid gap-4 sm:grid-cols-2">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.title}>
                  <motion.div whileHover={{ y: -6 }} className="h-full rounded-2xl border border-navy/10 bg-white/70 p-6 shadow-soft transition-colors hover:border-gold/60">
                    <Icon size={24} strokeWidth={1.5} className="text-gold-600" aria-hidden="true" />
                    <h3 className="mt-5 font-serif text-xl">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{a.text}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </AnimatedSection>
        </div>
      </section>

      {/* 5. Consultation CTA */}
      <CTASection />
    </>
  );
}
