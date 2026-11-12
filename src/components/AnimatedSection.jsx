import { motion } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

/**
 * Scroll-triggered container. Children wrapped in <Reveal> are staggered in
 * once the section enters the viewport.
 */
export default function AnimatedSection({ as = 'div', stagger = 0.1, delay = 0, className = '', children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Reveal({ as = 'div', className = '', children, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp variants={item} className={className} {...rest}>
      {children}
    </Comp>
  );
}

export { item as revealItem };
