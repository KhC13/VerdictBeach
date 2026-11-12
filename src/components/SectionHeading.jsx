import { Reveal } from './AnimatedSection';

/** Use inside an <AnimatedSection>. */
export default function SectionHeading({ eyebrow, title, text, align = 'left', dark = false, as: Tag = 'h2' }) {
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl`}>
      {eyebrow && (
        <Reveal className={`flex items-center gap-4 ${center ? 'justify-center' : ''}`}>
          <span className="gold-rule" aria-hidden="true" />
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal as={Tag} className={`mt-5 font-serif text-4xl leading-[1.12] sm:text-5xl ${dark ? '!text-ivory' : ''}`}>
        {title}
      </Reveal>
      {text && (
        <Reveal as="p" className={`mt-6 text-base leading-relaxed sm:text-lg ${dark ? 'text-ivory/70' : 'text-charcoal/80'}`}>
          {text}
        </Reveal>
      )}
    </div>
  );
}
