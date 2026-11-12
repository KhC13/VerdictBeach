import { Mail, MapPin, Phone } from 'lucide-react';
import PageHero from '../components/PageHero';
import ContactForm from '../components/ContactForm';
import AnimatedSection, { Reveal } from '../components/AnimatedSection';
import { company } from '../config/company';

function InfoRow({ icon: Icon, label, value, href }) {
  const { verified } = company.contact;
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/50">{label}</p>
        {verified && href ? (
          <a href={href} className="mt-1 block break-words text-ivory hover:text-gold-300">{value}</a>
        ) : (
          <p className="mt-1 break-words text-ivory">{value}</p>
        )}
        {!verified && (
          <span className="mt-1.5 inline-block rounded-full border border-gold/40 px-2 py-0.5 text-[9px] uppercase tracking-widest text-gold">
            Placeholder — to be verified
          </span>
        )}
      </div>
    </li>
  );
}

export default function Contact() {
  const { contact } = company;
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={<>Your next step starts with a <em className="text-gold">conversation.</em></>}
        text="Have a legal question, a business requirement or need help navigating documentation? We are here to understand your needs and help you find the right direction."
      />
      <section className="section-pad">
        <div className="container-vb grid gap-10 lg:grid-cols-12">
          <AnimatedSection className="lg:col-span-4">
            <Reveal className="rounded-3xl bg-navy p-8 sm:p-10 lg:sticky lg:top-28">
              <h2 className="font-serif text-3xl !text-ivory">Get in touch</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ivory/65">
                Tell us a little about what you need. Our team will review your enquiry and get back to you.
              </p>
              <ul className="mt-9 space-y-7">
                <InfoRow icon={Mail} label="Email us" value={contact.email} href={`mailto:${contact.email}`} />
                <InfoRow icon={Phone} label="Call us" value={contact.phone} href={`tel:${contact.phone}`} />
                <InfoRow icon={MapPin} label="Our location" value={contact.address} />
                <InfoRow icon={Mail} label="Working hours" value={contact.hours} />
              </ul>
            </Reveal>
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-8">
            <Reveal className="rounded-3xl border border-navy/10 bg-white/80 p-6 shadow-soft sm:p-12">
              <h2 className="font-serif text-3xl">Send an enquiry</h2>
              <p className="mb-8 mt-2 text-charcoal/70">All fields are required.</p>
              <ContactForm />
            </Reveal>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
