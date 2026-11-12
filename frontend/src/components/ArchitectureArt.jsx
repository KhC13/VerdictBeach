import { motion } from 'framer-motion';

/** Line-drawn, pillared facade — original vector artwork that draws itself in. */
const paths = [
  // pediment
  'M40 178 L240 74 L440 178 Z',
  'M74 168 L240 84 L406 168',
  // entablature
  'M40 178 H440 V206 H40 Z',
  'M40 192 H440',
  // base steps
  'M30 452 H450 V468 H30 Z',
  'M18 468 H462 V484 H18 Z',
  'M6 484 H474 V500 H6 Z',
  // scales of justice (in the pediment)
  'M240 112 V164',
  'M214 164 H266',
  'M212 124 H268',
  'M212 124 L200 146 H224 Z',
  'M268 124 L256 146 H280 Z',
];
const columnX = [62, 140, 218, 296, 374];
const columns = columnX.flatMap((x) => [
  `M${x - 4} 206 H${x + 44} V218 H${x - 4} Z`, // capital
  `M${x + 4} 218 V440 H${x + 36} V218`, // shaft
  `M${x + 14} 222 V436`, // flute
  `M${x + 26} 222 V436`, // flute
  `M${x - 4} 440 H${x + 44} V452 H${x - 4} Z`, // base
]);

export default function ArchitectureArt({ className = '' }) {
  const all = [...paths, ...columns];
  return (
    <svg viewBox="0 0 480 520" className={className} fill="none" role="img" aria-label="Line illustration of a pillared courthouse facade">
      <circle cx="240" cy="300" r="214" stroke="#B99A62" strokeOpacity=".14" />
      <circle cx="240" cy="300" r="172" stroke="#B99A62" strokeOpacity=".1" />
      {all.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="#B99A62"
          strokeWidth={i < 3 || i > 10 ? 1.4 : 1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: i > 10 && (i - 11) % 5 > 1 && (i - 11) % 5 < 4 ? 0.55 : 1 }}
          transition={{ duration: 1.6, delay: 0.5 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
}

/** Concentric arches pattern for supporting panels. */
export function ArchPattern({ className = '' }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const inset = i * 28;
        return (
          <motion.path
            key={i}
            d={`M${40 + inset} 400 V${200} A${160 - inset} ${160 - inset} 0 0 1 ${360 - inset} 200 V400`}
            stroke="#B99A62"
            strokeOpacity={0.55 - i * 0.07}
            strokeWidth="1.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </svg>
  );
}
