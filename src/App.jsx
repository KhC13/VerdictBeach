import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ForBusinesses from './pages/ForBusinesses';
import Contact from './pages/Contact';

const wrap = (el) => <PageTransition>{el}</PageTransition>;

export default function App() {
  const location = useLocation();
  return (
    // reducedMotion="user" disables transform/layout animations for users who prefer reduced motion
    <MotionConfig reducedMotion="user">
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={wrap(<Home />)} />
          <Route path="/about" element={wrap(<About />)} />
          <Route path="/services" element={wrap(<Services />)} />
          <Route path="/for-businesses" element={wrap(<ForBusinesses />)} />
          <Route path="/contact" element={wrap(<Contact />)} />
          <Route path="*" element={wrap(<Home />)} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  );
}
