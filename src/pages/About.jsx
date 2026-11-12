import { ArrowRight, Compass, Target } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import CTASection from '../components/CTASection';
import AnimatedSection, { Reveal } from '../components/AnimatedSection';
import { LogoMark } from '../components/Logo';
import { values } from '../data/content';

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={<>Built to bring <em className="text-gold">institutional-grade legal clarity</em> to high-growth ventures.</>}
        text="Established in [Founding Year] as the dedicated legal practice of Belvo Ventures Group, Verdict Beach was built to bring structured legal support to founders and businesses without traditional law firm friction."
      />

      {/* Introduction + positioning */}
      <section className="section-pad">
        <div className="container-vb grid items-center gap-16 lg:grid-cols-12">
          <AnimatedSection className="lg:col-span-6">
            <SectionHeading
              eyebrow="Who we are"
              title="Legal counsel for ambitious founders and scaling businesses."
              text="Verdict Beach advises startups, founders, and established enterprises at every critical inflection point. Our approach combines rigorous commercial thinking with transparent advice and rapid execution."
            />
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-6">
            <Reveal className="rounded-3xl border border-navy/10 bg-white/70 p-8 shadow-soft sm:p-10">
              <p className="eyebrow">Brand positioning</p>
              <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-2xl border border-navy/15 p-6 text-center">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-charcoal/60">Parent group</p>
                  <p className="mt-2 font-serif text-xl">Belvo Ventures Group</p>
                </div>
                <ArrowRight className="mx-auto rotate-90 text-gold-600 sm:rotate-0" aria-hidden="true" />
                <div className="flex flex-1 flex-col items-center rounded-2xl bg-navy p-6 text-center">
                  <LogoMark size={34} />
                  <p className="mt-3 font-serif text-xl text-ivory">Verdict Beach</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-gold">Legal services</p>
                </div>
              </div>
              <p className="mt-8 text-[15px] leading-relaxed text-charcoal/80">
                Verdict Beach sets itself apart through transparent fixed-fee mandates, rapid commercial turnaround, and deep venture-ecosystem fluency.
              </p>
            </Reveal>
          </AnimatedSection>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="section-pad bg-navy">
        <div className="container-vb">
          <AnimatedSection>
            <SectionHeading dark align="center" eyebrow="Direction" title="Our vision and mission" />
          </AnimatedSection>
          <AnimatedSection stagger={0.15} className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              { icon: Compass, t: 'Our Vision', d: 'To be the most trusted legal counsel for visionary founders and enterprises as they incorporate, scale, and lead their markets.' },
              { icon: Target, t: 'Our Mission', d: 'To deliver rigorous, commercially astute, and transparent legal representation across corporate governance, contracting, and regulatory compliance.' },
            ].map(({ icon: Icon, t, d }) => (
              <Reveal key={t} className="group rounded-3xl border border-gold/25 p-8 transition-colors duration-500 hover:border-gold hover:bg-navy-800 sm:p-12">
                <Icon size={30} strokeWidth={1.3} className="text-gold" aria-hidden="true" />
                <h3 className="mt-6 font-serif text-3xl !text-ivory">{t}</h3>
                <p className="mt-4 text-lg leading-relaxed text-ivory/70">{d}</p>
              </Reveal>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad">
        <div className="container-vb">
          <AnimatedSection>
            <SectionHeading eyebrow="Core values" title="The principles behind our work" />
          </AnimatedSection>
          <AnimatedSection stagger={0.1} className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} className="border-t border-navy/20 pt-6 transition-colors hover:border-gold">
                <span className="font-serif text-4xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-serif text-2xl">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-charcoal/80">{v.text}</p>
              </Reveal>
            ))}
          </AnimatedSection>
        </div>
      </section>

      <CTASection title="Let's start with a conversation." />
    </>
  );
}
