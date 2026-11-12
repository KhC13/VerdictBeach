import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import ArchitectureArt from '../components/ArchitectureArt';
import AnimatedSection, { Reveal } from '../components/AnimatedSection';
import { audiences, businessSupport } from '../data/content';

export default function ForBusinesses() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <>
      <PageHero
        eyebrow="For businesses"
        title={<>Build your business. <em className="text-gold">Not your legal headaches.</em></>}
        text="From setting up your first venture to managing contracts, compliance and business relationships, get structured legal support at every stage of your growth."
      />

      {/* Audiences */}
      <section className="section-pad">
        <div className="container-vb">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Who we support"
              title="Legal support that understands your business."
              text="Every business faces different legal challenges. Whether you're validating an idea, establishing a company or expanding operations, our support is designed around your business stage and requirements."
            />
          </AnimatedSection>
          <AnimatedSection stagger={0.1} className="mt-14 grid gap-6 sm:grid-cols-2">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.title}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group flex h-full gap-6 rounded-2xl border border-navy/10 bg-white/70 p-8 shadow-soft transition-[border-color,box-shadow] duration-500 hover:border-gold/60 hover:shadow-lift"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold-600 transition-colors duration-500 group-hover:bg-navy group-hover:text-gold">
                      <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl">{a.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-charcoal/80">{a.text}</p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </AnimatedSection>
        </div>
      </section>

      <section className="section-pad bg-ivory-200/50">
        <div className="container-vb">
          <AnimatedSection>
            <SectionHeading
              eyebrow="Solutions for every stage of business"
              title="Support that moves with your company"
            />
          </AnimatedSection>
          <AnimatedSection stagger={0.12} className="mt-14 grid gap-6 lg:grid-cols-2">
            {[
              {
                stage: '01 — Starting Up',
                label: 'Idea to incorporation',
                items: [
                  'Choosing an appropriate business structure',
                  'Company and LLP incorporation assistance',
                  "Founders' agreements and ownership clarity",
                  'Initial business documentation',
                  'DPIIT Startup Recognition application assistance, where eligible',
                ],
              },
              {
                stage: '02 — Building & Operating',
                label: 'Day-to-day business',
                items: [
                  'Client and vendor agreements',
                  'Employment and consultancy contracts',
                  'Non-Disclosure Agreements (NDAs)',
                  'Terms of Service and business policies',
                  'Intellectual property and trademark support',
                ],
              },
              {
                stage: '03 — Staying Compliant',
                label: 'Ongoing compliance',
                items: [
                  'Applicable annual filing support',
                  'GST and tax compliance coordination',
                  'Labour and employment compliance assistance',
                  'Business licences and regulatory documentation',
                  'Compliance calendars and record management',
                ],
              },
              {
                stage: '04 — Scaling & Expanding',
                label: 'Growth to expansion',
                items: [
                  'Investment and funding documentation support',
                  'Shareholder and equity-related agreements',
                  'Due diligence preparation',
                  'Strategic partnership agreements',
                  'Corporate restructuring and expansion assistance',
                ],
              },
            ].map(({ stage, label, items }) => (
              <Reveal key={stage} className="rounded-3xl border border-navy/10 bg-white/80 p-8 shadow-soft">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold-600">{stage}</p>
                <h3 className="mt-4 font-serif text-2xl text-navy">{label}</h3>
                <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-charcoal/75">
                  {items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* How we help — parallax panel */}
      <section ref={ref} className="section-pad relative overflow-hidden bg-navy">
        <div className="container-vb grid items-center gap-14 lg:grid-cols-12">
          <AnimatedSection className="lg:col-span-7">
            <SectionHeading
              dark
              eyebrow="How we can help"
              title="Documentation, agreements and compliance — handled with care."
              text="Our support focuses on the three areas where clear legal groundwork matters most to a business."
            />
            <div className="mt-12 space-y-8">
              {businessSupport.map((b) => {
                const Icon = b.icon;
                return (
                  <Reveal key={b.title} className="flex gap-5 border-t border-gold/25 pt-6">
                    <Icon size={26} strokeWidth={1.4} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                    <div>
                      <h3 className="font-serif text-2xl !text-ivory">{b.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ivory/65">{b.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </AnimatedSection>
          <motion.div style={{ y }} className="hidden lg:col-span-5 lg:block">
            <ArchitectureArt className="mx-auto w-full max-w-sm opacity-90" />
          </motion.div>
        </div>
      </section>

      {/* Prominent CTA */}
      <section className="section-pad">
        <AnimatedSection className="container-vb text-center">
          <SectionHeading align="center" eyebrow="Next step" title="Put the right legal foundations in place." text="Tell us about your business and what you need. We will take it from there." />
          <Reveal className="mt-10 flex justify-center">
            <Button to="/contact" className="!min-h-[60px] !px-10 !text-base">Get Legal Assistance</Button>
          </Reveal>
        </AnimatedSection>
      </section>

      <CTASection eyebrow="Prefer to talk first?" title="Book a consultation for your business." />
    </>
  );
}
