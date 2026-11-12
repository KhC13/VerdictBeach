import PageHero from '../components/PageHero';
import ServiceCard from '../components/ServiceCard';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import AnimatedSection, { Reveal } from '../components/AnimatedSection';
import { services } from '../data/content';

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Legal solutions. <em className="text-gold">Built around your needs.</em></>}
        text="Whether you're starting a business, entering an agreement or managing ongoing legal requirements, Verdict Beach provides structured legal assistance for every important step."
      />
      <section className="section-pad">
        <div className="container-vb">
          <AnimatedSection stagger={0.09} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
            <Reveal className="flex flex-col justify-center rounded-2xl bg-navy p-8 sm:col-span-2 lg:col-span-1">
              <h3 className="font-serif text-2xl !text-ivory">Not sure which service fits?</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ivory/70">
                Describe your situation and we will help you work out the right place to begin.
              </p>
              <div className="mt-6">
                <Button to="/contact">Book a Consultation</Button>
              </div>
            </Reveal>
          </AnimatedSection>
        </div>
      </section>
      <CTASection title="Tell us what you need help with." />
    </>
  );
}
