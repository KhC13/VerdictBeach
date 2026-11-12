import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { revealItem } from './AnimatedSection';

/** Use inside an <AnimatedSection>. */
export default function ServiceCard({ service, index }) {
  const Icon = service.icon;
  return (
    <motion.article
      variants={revealItem}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white/70 p-8 shadow-soft transition-[box-shadow,border-color] duration-500 hover:border-gold/60 hover:shadow-lift"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
      />
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold-600 transition-all duration-500 group-hover:rotate-[8deg] group-hover:border-navy group-hover:bg-navy group-hover:text-gold">
          <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="font-serif text-2xl text-navy/20 transition-colors duration-500 group-hover:text-gold">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-8 font-serif text-2xl">{service.title}</h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-charcoal/80">{service.description}</p>
      <Link
        to={`/contact?service=${service.id}`}
        className="mt-8 inline-flex items-center gap-2 self-start border-b border-gold/60 pb-1 text-sm font-medium text-navy transition-colors hover:border-navy hover:text-gold-600"
      >
        Enquire about this service
        <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </motion.article>
  );
}
