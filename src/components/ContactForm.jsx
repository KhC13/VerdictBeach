import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Send } from 'lucide-react';
import { serviceOptions, services } from '../data/content';
import { submitEnquiry } from '../lib/submitEnquiry';
import { ease } from './AnimatedSection';

const OTHER = 'Other';
const ROLE_OPTIONS = ['Startup Founder', 'Business Owner', 'Entrepreneur', 'Individual', 'Corporate Representative', 'Other'];
const empty = { name: '', companyName: '', email: '', phone: '', role: '', service: '', message: '' };

export function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your full name.';
  else if (v.name.trim().length < 2) e.name = 'Name looks too short.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.';
  else if (!/^\+?[0-9\s\-().]{7,20}$/.test(v.phone.trim()) || v.phone.replace(/\D/g, '').length < 7)
    e.phone = 'Please enter a valid phone number.';
  if (!v.role) e.role = 'Please tell us who you are.';
  if (!v.service) e.service = 'Please select the service you need.';
  if (!v.message.trim()) e.message = 'Please tell us a little about your enquiry.';
  else if (v.message.trim().length < 10) e.message = 'Please add a little more detail (at least 10 characters).';
  return e;
}

const inputCls = (err) =>
  `w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-charcoal placeholder:text-charcoal/40 transition-colors duration-200 focus:outline-none focus:ring-2 ${
    err ? 'border-red-700/60 focus:ring-red-700/20' : 'border-navy/15 focus:border-gold focus:ring-gold/30'
  }`;

function Field({ id, label, error, required = true, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-navy">
        {label}
        {required && <span className="text-gold-600" aria-hidden="true"> *</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 overflow-hidden pt-2 text-sm text-red-800"
          >
            <AlertCircle size={14} aria-hidden="true" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactForm() {
  const [params] = useSearchParams();
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const match = services.find((s) => s.id === params.get('service'));
    if (match) setValues((v) => ({ ...v, service: match.title }));
  }, [params]);

  const errors = validate(values);
  const show = (k) => (touched[k] ? errors[k] : undefined);

  const bind = (k) => ({
    id: k,
    name: k,
    value: values[k],
    onChange: (e) => setValues((v) => ({ ...v, [k]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    'aria-invalid': !!show(k),
    'aria-describedby': show(k) ? `${k}-error` : undefined,
    disabled: status === 'loading',
  });

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, role: true, service: true, message: true });
    const first = Object.keys(errors)[0];
    if (first) {
      formRef.current?.querySelector(`#${first}`)?.focus();
      return;
    }
    setStatus('loading');
    try {
      setResult(await submitEnquiry(values));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  function reset() {
    setValues(empty);
    setTouched({});
    setStatus('idle');
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <motion.div
            key="ok"
            role="status"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease } }}
            exit={{ opacity: 0 }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
          >
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15, stiffness: 260, damping: 16 }}>
              <CheckCircle2 size={56} strokeWidth={1.3} className="text-gold-600" aria-hidden="true" />
            </motion.span>
            <h3 className="mt-6 font-serif text-3xl">Thank you, {values.name.split(' ')[0]}.</h3>
            <p className="mt-3 max-w-md text-charcoal/80">
              Your enquiry about <strong className="font-medium">{values.service}</strong> has been captured on this page.
            </p>
            {result?.simulated && (
              <p className="mt-4 max-w-md rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-charcoal">
                Demo notice: this prototype has no backend, so nothing has been sent or stored.
              </p>
            )}
            <button type="button" onClick={reset} className="mt-8 border-b border-gold pb-1 text-sm font-medium text-navy hover:text-gold-600">
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Field id="name" label="Full name" error={show('name')}>
                <input type="text" autoComplete="name" placeholder="Your full name" className={inputCls(show('name'))} {...bind('name')} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="companyName" label="Business / Company Name" required={false} error={show('companyName')}>
                <input type="text" autoComplete="organization" placeholder="Your business or company name" className={inputCls(show('companyName'))} {...bind('companyName')} />
              </Field>
            </div>
            <Field id="email" label="Email address" error={show('email')}>
              <input type="email" autoComplete="email" placeholder="you@company.com" className={inputCls(show('email'))} {...bind('email')} />
            </Field>
            <Field id="phone" label="Phone number" error={show('phone')}>
              <input type="tel" autoComplete="tel" placeholder="+00 000 000 0000" className={inputCls(show('phone'))} {...bind('phone')} />
            </Field>
            <div className="sm:col-span-2">
              <Field id="role" label="I am a" error={show('role')}>
                <div className="relative">
                  <select className={`${inputCls(show('role'))} appearance-none pr-11 ${values.role ? '' : 'text-charcoal/40'}`} {...bind('role')}>
                    <option value="" disabled>Select an option</option>
                    {ROLE_OPTIONS.map((o) => (
                      <option key={o} value={o} className="text-charcoal">{o}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy/50" aria-hidden="true" />
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="service" label="Service required" error={show('service')}>
                <div className="relative">
                  <select className={`${inputCls(show('service'))} appearance-none pr-11 ${values.service ? '' : 'text-charcoal/40'}`} {...bind('service')}>
                    <option value="" disabled>Select a service</option>
                    {[...serviceOptions, OTHER].map((o) => (
                      <option key={o} value={o} className="text-charcoal">{o}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy/50" aria-hidden="true" />
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field id="message" label="Brief description" error={show('message')}>
                <textarea rows={5} placeholder="Share your requirements and we'll help you identify the next step." className={`${inputCls(show('message'))} resize-y`} {...bind('message')} />
              </Field>
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3 rounded-xl border border-red-800/30 bg-red-50 p-4 text-sm text-red-900 sm:col-span-2"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  Something went wrong while submitting your enquiry. Please check your details and try again.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-charcoal/60">Fields marked * are required.</p>
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={status === 'loading' ? undefined : { y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-navy px-9 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-navy-700 disabled:cursor-wait disabled:opacity-80"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  <>
                    Send Enquiry <Send size={16} aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
