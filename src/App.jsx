import React from 'react';
import { ThemeProvider } from './components/ThemeContext';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Volunteering from './components/Volunteering';
import Footer from './components/Footer';
import RockBackground from './components/RockBackground';
import Navbar from './components/Navbar';
import ThankYouCar from './components/ThankYouCar';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container" style={{ position: 'relative', minHeight: '100vh' }}>
        <RockBackground />
        <Navbar />
        <div style={{ position: 'relative', zIndex: 1 }}>
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
      </div>
    </ThemeProvider>
  );
}

export default App;
