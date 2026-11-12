import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const variants = {
  primary: 'bg-gold text-navy hover:bg-gold-300',
  dark: 'bg-navy text-ivory hover:bg-navy-700',
  outline: 'border border-ivory/35 text-ivory hover:border-gold hover:text-gold-300',
  outlineDark: 'border border-navy/25 text-navy hover:border-gold-600 hover:text-gold-600',
};

const base =
  'group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-wide transition-colors duration-300';

/** Link-style button when `to` is given, otherwise a real <button>. */
export default function Button({ to, variant = 'primary', arrow = true, className = '', children, ...rest }) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />}
    </>
  );
  const motionProps = { whileHover: { y: -2 }, whileTap: { scale: 0.97 }, transition: { type: 'spring', stiffness: 400, damping: 24 } };

  if (to) {
    return (
      <motion.span className="inline-flex max-w-full" {...motionProps}>
        <Link to={to} className={classes} {...rest}>
          {inner}
        </Link>
      </motion.span>
    );
  }
  return (
    <motion.button className={classes} {...motionProps} {...rest}>
      {inner}
    </motion.button>
  );
}
