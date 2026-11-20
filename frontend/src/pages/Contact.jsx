import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import PageHero from '../components/PageHero';
import ContactForm from '../components/ContactForm';
import AnimatedSection, { Reveal } from '../components/AnimatedSection';
import { company } from '../config/company';

// Contact details only appear once they are verified in config/company.js.
// Until then the page relies on the form, so no placeholder text reaches visitors.
function InfoRow({ icon: Icon, label, value, href }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.24em] text-ivory/70">{label}</p>
        {href ? (
          <a href={href} className="mt-1 block break-words text-[16px] text-ivory hover:text-gold-300">{value}</a>
        ) : (
          <p className="mt-1 break-words text-[16px] text-ivory">{value}</p>
        )}
      </div>
    </li>
  );
}

export default function Contact() {
  const { contact } = company;
  const rows = contact.verified
    ? [
        contact.email && { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
        contact.phone && { icon: Phone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
        contact.address && { icon: MapPin, label: 'Office', value: contact.address },
        contact.hours && { icon: Clock, label: 'Hours', value: contact.hours },
      ].filter(Boolean)
    : [];

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={<>Your next step starts with a <em className="text-gold">conversation.</em></>}
        text="Tell us what you need help with. We will review your enquiry and reply with the next step."
      />
      <section className="section-pad">
        <div className="container-vb grid gap-10 lg:grid-cols-12">
          <AnimatedSection className="lg:col-span-4">
            <Reveal className="rounded-3xl bg-navy p-8 sm:p-10 lg:sticky lg:top-28">
              <h2 className="font-serif text-3xl !text-ivory">Before you send</h2>
              <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-ivory/85">
                <li>You will receive a confirmation email with a reference number.</li>
                <li>Please don&rsquo;t include confidential documents or sensitive personal details until we have spoken.</li>
                <li>General information on this website is not legal advice.</li>
              </ul>
              {rows.length > 0 && (
                <ul className="mt-10 space-y-6 border-t border-ivory/15 pt-8">
                  {rows.map((r) => <InfoRow key={r.label} {...r} />)}
                </ul>
              )}
            </Reveal>
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-8">
            <Reveal className="rounded-3xl border border-navy/10 bg-white p-6 shadow-soft sm:p-12">
              <h2 className="font-serif text-3xl">Send an enquiry</h2>
              <p className="mb-8 mt-2 text-[16px] text-charcoal/80">Fields marked * are required.</p>
              <div className="relative">
                <ContactForm />
              </div>
            </Reveal>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
