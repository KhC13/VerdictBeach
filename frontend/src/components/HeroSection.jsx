import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from './Button';
import ArchitectureArt from './ArchitectureArt';
import { ease } from './AnimatedSection';
import { services } from '../data/content';

const headline = [
  { t: 'Strategic' },
  { t: 'legal' },
  { t: 'counsel' },
  { t: 'for' },
  { t: 'ambitious', em: true },
  { t: 'founders' },
  { t: 'and' },
  { t: 'scaling', em: true },
  { t: 'businesses.' },
];

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={ref} className="grain relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-navy pb-12 pt-32 sm:pt-36">
      {/* Background: slow-moving glows + architectural grid lines */}
      <motion.div style={{ y: glowY }} aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] animate-drift rounded-full bg-gold/[0.12] blur-3xl" />
        <div className="absolute -bottom-52 -left-40 h-[460px] w-[460px] animate-drift rounded-full bg-[#2a4570]/40 blur-3xl [animation-delay:-7s]" />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        style={{ backgroundImage: 'linear-gradient(to right, rgba(245,241,232,.05) 1px, transparent 1px)', backgroundSize: '12.5% 100%' }}
      />

      <div className="container-vb relative grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <span className="gold-rule" aria-hidden="true" />
            <span className="eyebrow !text-gold">Legal services · Belvo Ventures Group</span>
          </motion.div>

          <h1 className="mt-7 font-serif text-[2.6rem] leading-[1.06] !text-ivory sm:text-6xl lg:text-[4.4rem]">
            {headline.map((w, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className={`inline-block ${w.em ? 'italic text-gold' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, ease, delay: 0.35 + i * 0.09 }}
                >
                  {w.t}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.05 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/70"
          >
            Clear legal advisory, airtight contracts, and proactive compliance—so you can build without friction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.2 }}
            className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
          >
            <Button to="/contact">Book a Consultation</Button>
            <Button to="/services" variant="outline">Explore Our Services</Button>
          </motion.div>
        </div>

        <motion.div style={{ y: artY }} className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="relative rounded-[2rem] border border-gold/25 bg-navy-800/60 p-6 sm:p-10">
            <ArchitectureArt className="h-auto w-full" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 1.5 }}
              className="absolute -bottom-6 left-4 right-4 sm:-left-8 sm:right-auto"
            >
              <div className="animate-drift rounded-2xl border border-gold/30 bg-navy px-6 py-4 shadow-lift">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">A vertical of</p>
                <p className="mt-1 font-serif text-lg text-ivory">Belvo Ventures Group</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="container-vb relative mt-20 hidden border-t border-ivory/10 pt-6 md:block"
      >
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-ivory/50">
          {services.map((s) => (
            <li key={s.id} className="flex items-center gap-8">
              {s.title}
              <span className="h-1 w-1 rounded-full bg-gold/60 last:hidden" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
