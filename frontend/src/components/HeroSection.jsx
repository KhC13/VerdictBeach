import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Button from './Button';
import { ease } from './AnimatedSection';
import { heroSlides } from '../data/heroSlides';

const headline = [
  { t: 'Legal' },
  { t: 'counsel' },
  { t: 'built' },
  { t: 'for' },
  { t: 'ambitious', em: true },
  { t: 'businesses.' },
];

const INTERVAL = 6500;

export default function HeroSection() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Auto-rotate the background; the timer restarts whenever the slide changes (incl. manual clicks).
  useEffect(() => {
    if (reduce) return undefined;
    const id = setTimeout(() => setIndex((i) => (i + 1) % heroSlides.length), INTERVAL);
    return () => clearTimeout(id);
  }, [index, reduce]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-navy pb-24 pt-32 sm:pt-36">
      {/* Rotating background images (crossfade + slow zoom) */}
      <motion.div style={{ y: bgY }} aria-hidden="true" className="absolute -inset-y-16 inset-x-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover"
            style={{ backgroundImage: `url(${heroSlides[index].src})`, backgroundPosition: heroSlides[index].position }}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.12 }}
            animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 1.6 }, scale: { duration: (INTERVAL + 1600) / 1000, ease: 'linear' } } }}
            exit={{ opacity: 0, transition: { duration: 1.6 } }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Readability overlays: navy wash + left-to-right fade behind the text */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy/40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent sm:via-navy/50" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy to-transparent" />

      <div className="container-vb relative">
        <div className="max-w-3xl">
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
            className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/75"
          >
            Verdict Beach offers clear, dependable legal support — from documentation and agreements to compliance — so
            you can build and operate with confidence.
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
      </div>

      {/* Slide indicators + parent badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="container-vb absolute inset-x-0 bottom-8 flex items-end justify-between gap-6"
      >
        <div className="flex items-center gap-3" role="group" aria-label="Background image">
          {heroSlides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show background ${i + 1} of ${heroSlides.length}`}
              aria-current={i === index}
              className="group flex h-8 items-center"
            >
              <span className="relative block h-px w-10 overflow-hidden bg-ivory/30 transition-all group-hover:bg-ivory/60 sm:w-14">
                {i === index && (
                  <motion.span
                    key={`p-${index}`}
                    className="absolute inset-y-0 left-0 w-full origin-left bg-gold"
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="hidden rounded-2xl border border-gold/30 bg-navy/80 px-6 py-4 backdrop-blur-sm sm:block">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">A vertical of</p>
          <p className="mt-1 font-serif text-lg text-ivory">Belvo Ventures Group</p>
        </div>
      </motion.div>
    </section>
  );
}
