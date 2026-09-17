import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { boot } from './main/boot.js';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Band from './components/Band.jsx';
import Work from './components/Work.jsx';
import About from './components/About.jsx';
import Process from './components/Process.jsx';
import Capabilities from './components/Capabilities.jsx';
import Services from './components/Services.jsx';
import Testimonials from './components/Testimonials.jsx';
import Faq from './components/Faq.jsx';
import Cta from './components/Cta.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const root = useRef(null);

  // Runs once the JSX below is in the DOM: wires up Lenis, ScrollTrigger,
  // every section's animations, the WebGL scenes and the intro. See main/boot.js.
  useGSAP(() => {
    boot();
  }, { scope: root });

  return (
    <div ref={root}>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Band />
        <Work />
        <About />
        <Process />
        <Capabilities />
        <Services />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
