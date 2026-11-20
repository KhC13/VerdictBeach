import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Mail, Paperclip, Send, X } from 'lucide-react';
import { serviceOptions, services } from '../data/content';
import { submitEnquiry } from '../lib/submitEnquiry';
import { ease } from './AnimatedSection';

const OTHER = 'Other';
const ROLE_OPTIONS = ['Startup Founder', 'Business Owner', 'Entrepreneur', 'Individual', 'Corporate Representative', 'Other'];
const MAX_FILES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const EMPTY = { name: '', companyName: '', email: '', phone: '', role: '', service: '', message: '', website: '' };

export function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your full name.';
  else if (v.name.trim().length < 2) e.name = 'Please enter at least 2 characters.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address, e.g. name@company.com.';
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.';
  else if (!/^\+?[0-9\s\-().]{7,20}$/.test(v.phone.trim()) || v.phone.replace(/\D/g, '').length < 7)
    e.phone = 'Please enter a valid phone number.';
  if (!v.role) e.role = 'Please tell us who you are.';
  if (!v.service) e.service = 'Please choose the service you need.';
  if (!v.message.trim()) e.message = 'Please tell us a little about your enquiry.';
  else if (v.message.trim().length < 10) e.message = 'Please add a little more detail (at least 10 characters).';
  return e;
}

const inputCls = (err) =>
  `w-full rounded-xl border bg-white px-4 py-3.5 text-[16px] text-charcoal placeholder:text-charcoal/50 transition-colors duration-200 focus:outline-none focus:ring-2 ${
    err ? 'border-red-800/70 focus:ring-red-800/20' : 'border-navy/20 focus:border-gold focus:ring-gold/30'
  }`;

function Field({ id, label, error, required = true, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-navy">
        {label}
        {required ? <span className="text-gold-600" aria-hidden="true"> *</span> : <span className="font-normal text-charcoal/70"> (optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-charcoal/70">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 overflow-hidden pt-2 text-sm text-red-900"
          >
            <AlertCircle size={14} aria-hidden="true" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectWrap({ children }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy/60" aria-hidden="true" />
    </div>
  );
}

export default function ContactForm() {
  const [params] = useSearchParams();
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    service: services.find((s) => s.id === params.get('service'))?.title ?? '',
  }));
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [formError, setFormError] = useState('');
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const errors = validate(values);
  const fieldError = (k) => (touched[k] || serverErrors[k] ? errors[k] || serverErrors[k] : undefined);

  const bind = (k) => ({
    id: k,
    name: k,
    value: values[k],
    onChange: (e) => {
      setValues((v) => ({ ...v, [k]: e.target.value }));
      if (serverErrors[k]) setServerErrors((s) => ({ ...s, [k]: undefined }));
    },
    onBlur: () => setTouched((t) => ({ ...t, [k]: true })),
    'aria-invalid': !!fieldError(k),
    'aria-describedby': fieldError(k) ? `${k}-error` : undefined,
    disabled: status === 'loading',
  });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length + files.length > MAX_FILES) {
      setFileError(`You can attach up to ${MAX_FILES} files.`);
    } else if (selected.some((f) => f.size > MAX_BYTES)) {
      const big = selected.find((f) => f.size > MAX_BYTES);
      setFileError(`"${big.name}" is over the 10 MB limit.`);
    } else {
      setFileError('');
      setFiles((prev) => [...prev, ...selected]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => setFiles((prev) => prev.filter((_, i) => i !== index));

  async function onSubmit(e) {
    e.preventDefault();
    setFormError('');
    setServerErrors({});
    setTouched({ name: true, email: true, phone: true, role: true, service: true, message: true });
    const first = Object.keys(validate(values))[0];
    if (first) {
      formRef.current?.querySelector(`#${first}`)?.focus();
      return;
    }
    setStatus('loading');
    try {
      const data = await submitEnquiry({ ...values, files });
      setSubmitted({ name: values.name, email: values.email, service: values.service });
      setResult(data);
      setStatus('success');
    } catch (err) {
      setServerErrors(err.fieldErrors || {});
      setFormError(
        err.status === 429
          ? err.message
          : err.fieldErrors && Object.keys(err.fieldErrors).length
            ? 'Please check the highlighted fields.'
            : err.status
              ? 'Something went wrong on our side. Please try again in a moment.'
              : 'We could not reach our server. Check your connection and try again.'
      );
      setStatus('error');
    }
  }

  function reset() {
    setValues({ ...EMPTY, service: '' });
    setFiles([]);
    setFileError('');
    setTouched({});
    setServerErrors({});
    setFormError('');
    setStatus('idle');
    setResult(null);
    setSubmitted(null);
  }

  if (status === 'success' && submitted) {
    const reference = result?.id ? String(result.id).slice(-8).toUpperCase() : null;
    return (
      <motion.div
        key="ok"
        role="status"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease } }}
        className="flex flex-col py-6"
      >
        <CheckCircle2 size={48} strokeWidth={1.3} className="text-gold-600" aria-hidden="true" />
        <h3 className="mt-6 font-serif text-3xl">Thank you, {submitted.name.split(' ')[0]}.</h3>
        <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-charcoal/85">
          We have received your enquiry about <strong className="font-medium">{submitted.service}</strong>.
          {reference && (
            <>
              {' '}Your reference is <span className="font-mono font-medium text-navy">{reference}</span>.
            </>
          )}
        </p>

        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-navy/10 bg-white p-5">
          <Mail size={20} className="mt-0.5 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed text-charcoal/85">
            A confirmation has been sent to <strong className="font-medium">{submitted.email}</strong>. If it does not arrive within a few minutes, check your spam folder.
          </p>
        </div>

        <ol className="mt-8 space-y-3 text-[15px] text-charcoal/85">
          <li><span className="font-medium text-navy">1.</span> Our team reviews your enquiry.</li>
          <li><span className="font-medium text-navy">2.</span> We reply using the email or phone number you provided.</li>
          <li><span className="font-medium text-navy">3.</span> We agree the next step with you.</li>
        </ol>

        <button type="button" onClick={reset} className="mt-10 self-start border-b border-gold pb-1 text-sm font-medium text-navy hover:text-gold-600">
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      {/* Honeypot: hidden from people and screen readers. Bots tend to fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website (leave blank)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))} />
      </div>

      <div className="sm:col-span-2">
        <Field id="name" label="Full name" error={fieldError('name')}>
          <input type="text" autoComplete="name" placeholder="Jane Doe" className={inputCls(fieldError('name'))} {...bind('name')} />
        </Field>
      </div>
      <Field id="email" label="Email address" error={fieldError('email')} hint="We'll send your confirmation here.">
        <input type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" className={inputCls(fieldError('email'))} {...bind('email')} />
      </Field>
      <Field id="phone" label="Phone number" error={fieldError('phone')}>
        <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 00000 00000" className={inputCls(fieldError('phone'))} {...bind('phone')} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="companyName" label="Company or business name" required={false} error={fieldError('companyName')}>
          <input type="text" autoComplete="organization" placeholder="Your company, if you have one" className={inputCls(fieldError('companyName'))} {...bind('companyName')} />
        </Field>
      </div>
      <Field id="role" label="I am a" error={fieldError('role')}>
        <SelectWrap>
          <select className={`${inputCls(fieldError('role'))} appearance-none pr-11 ${values.role ? '' : 'text-charcoal/60'}`} {...bind('role')}>
            <option value="" disabled>Select one</option>
            {ROLE_OPTIONS.map((o) => (
              <option key={o} value={o} className="text-charcoal">{o}</option>
            ))}
          </select>
        </SelectWrap>
      </Field>
      <Field id="service" label="Service I need" error={fieldError('service')}>
        <SelectWrap>
          <select className={`${inputCls(fieldError('service'))} appearance-none pr-11 ${values.service ? '' : 'text-charcoal/60'}`} {...bind('service')}>
            <option value="" disabled>Select one</option>
            {[...serviceOptions, OTHER].map((o) => (
              <option key={o} value={o} className="text-charcoal">{o}</option>
            ))}
          </select>
        </SelectWrap>
      </Field>
      <div className="sm:col-span-2">
        <Field id="message" label="Tell us about your enquiry" error={fieldError('message')} hint="A few sentences is enough. Please don't include confidential documents yet; you can attach them below after we speak.">
          <textarea rows={5} placeholder="What are you working on, and where would you like help?" className={`${inputCls(fieldError('message'))} resize-y`} {...bind('message')} />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <span className="mb-2 block text-sm font-medium text-navy">
          Attach documents <span className="font-normal text-charcoal/70">(optional)</span>
        </span>
        <div className="rounded-xl border border-dashed border-navy/25 bg-cream/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor="file-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-navy/5 px-4 py-2 text-sm font-medium text-navy hover:bg-navy/10">
              <Paperclip size={16} className="text-gold-600" aria-hidden="true" />
              Choose files ({files.length}/{MAX_FILES})
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.rtf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="sr-only"
                disabled={status === 'loading' || files.length >= MAX_FILES}
              />
            </label>
            <span className="text-xs text-charcoal/70">PDF, Word, text or image. Up to 10 MB each.</span>
          </div>
          {fileError && (
            <p role="alert" className="mt-2 flex items-center gap-1 text-xs text-red-900"><AlertCircle size={12} aria-hidden="true" /> {fileError}</p>
          )}
          {files.length > 0 && (
            <ul className="mt-3 space-y-1.5 border-t border-navy/10 pt-3">
              {files.map((file, idx) => (
                <li key={`${file.name}-${idx}`} className="flex items-center justify-between gap-3 rounded-md border border-navy/10 bg-white px-3 py-2 text-xs text-charcoal">
                  <span className="min-w-0 truncate font-mono">{file.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-charcoal/70">{(file.size / 1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => removeFile(idx)} className="rounded p-1 text-charcoal/60 hover:text-red-900" aria-label={`Remove ${file.name}`}>
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AnimatePresence>
        {status === 'error' && formError && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-xl border border-red-800/30 bg-red-50 p-4 text-sm text-red-900 sm:col-span-2"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            {formError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-charcoal/75">
          Fields marked * are required. Sending an enquiry does not create a lawyer–client relationship.
        </p>
        <motion.button
          type="submit"
          disabled={status === 'loading'}
          whileHover={status === 'loading' ? undefined : { y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-navy px-9 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-navy-700 disabled:cursor-wait disabled:opacity-80"
        >
          {status === 'loading' ? (
            <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…</>
          ) : (
            <>Send enquiry <Send size={16} aria-hidden="true" /></>
          )}
        </motion.button>
      </div>
    </form>
  );
}
