import Button from './Button';
import AnimatedSection, { Reveal } from './AnimatedSection';
import { ArchPattern } from './ArchitectureArt';

export default function CTASection({
  eyebrow = 'Consultation',
  title = 'Ready to talk through your legal needs?',
  text = 'Tell us what you are working on. We will help you understand where you stand and what to do next.',
}) {
  return (
    <section className="bg-ivory px-5 pb-20 sm:px-8 sm:pb-28">
      <AnimatedSection className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-navy px-6 py-16 text-center sm:px-16 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/25" />
        <ArchPattern className="pointer-events-none absolute -bottom-24 -left-20 w-80 opacity-60 sm:w-[26rem]" />
        <ArchPattern className="pointer-events-none absolute -bottom-24 -right-20 hidden w-80 opacity-60 sm:block sm:w-[26rem]" />
        <div className="relative mx-auto max-w-2xl">
          <Reveal as="p" className="eyebrow !text-gold">{eyebrow}</Reveal>
          <Reveal as="h2" className="mt-5 font-serif text-4xl !text-ivory sm:text-5xl">{title}</Reveal>
          <Reveal as="p" className="mt-6 text-base leading-relaxed text-ivory/70 sm:text-lg">{text}</Reveal>
          <Reveal className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <Button to="/contact">Book a Consultation</Button>
            <Button to="/contact" variant="outline">Get Legal Assistance</Button>
          </Reveal>
        </div>
      </AnimatedSection>
    </section>
  );
}
