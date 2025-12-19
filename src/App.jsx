import React from 'react';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Volunteering from './components/Volunteering';
import Footer from './components/Footer';
import RockBackground from './components/RockBackground';

import ThankYouCar from './components/ThankYouCar';

function App() {
  return (
    <div className="app-container">
      <RockBackground />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Certifications />
      <Volunteering />
      <ThankYouCar />
      <Footer />
    </div>
  );
}

export default App;
