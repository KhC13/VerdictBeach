import { motion } from 'framer-motion';
import { ease } from './AnimatedSection';

/** Shared header band for inner pages. */
export default function PageHero({ eyebrow, title, text }) {
  const backgrounds = {
  "About us": "/images/backgrounds/02_blurred_glass_meeting_room.jpg",
  "Services": "/images/backgrounds/05_legal_desk_interior.jpg",
  "For businesses": "/images/backgrounds/04_glass_conference_room.jpg",
  "Contact us": "/images/backgrounds/03_city_skyline_sunset.jpg",
};
  return (
    <section className="grain relative isolate overflow-hidden bg-navy pb-20 pt-40 sm:pb-28 sm:pt-48">

  {/* Background image */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-cover bg-center"
    style={{
     backgroundImage: `url('${backgrounds[eyebrow]}')`,
    }}
  />

  {/* Dark overlay */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-navy/65"
  />

  {/* Keep your existing PageHero content below */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 justify-around md:flex">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="h-full w-px origin-top bg-gradient-to-b from-gold/0 via-gold/25 to-gold/0"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.4, delay: 0.3 + i * 0.12, ease }}
          />
        ))}
      </div>
      <div className="absolute -left-32 top-10 h-96 w-96 animate-drift rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
      <div className="container-vb relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <span className="gold-rule" aria-hidden="true" />
          <span className="eyebrow !text-gold">{eyebrow}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
          className="mt-6 max-w-3xl font-serif text-5xl leading-[1.08] !text-ivory sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory/70"
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
}
