import { motion } from 'framer-motion';
import { ease } from './AnimatedSection';

export default function PageTransition({ children }) {
  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } }}
    >
      {children}
    </motion.main>
  );
}
