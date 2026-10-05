import React, { useEffect } from 'react';
import Navbar from '../../components/home/Navbar';
import HeroSection from '../../components/home/HeroSection';
import FeatureSplitSection from '../../components/home/FeatureSplitSection';
import WorkflowTabsSection from '../../components/home/WorkflowTabsSection';
import CapabilitiesSection from '../../components/home/CapabilitiesSection';
import FieldScenariosSection from '../../components/home/FieldScenariosSection';
import StepsSection from '../../components/home/StepsSection';
import TeamSection from '../../components/home/TeamSection';
import Footer from '../../components/home/Footer';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
      {/* Sol.it style Navbar */}
      <Navbar scrollToSection={scrollToSection} />

      {/* Main Container */}
      <main>
        {/* Section 1: Hero Section (Image 1) */}
        <HeroSection scrollToSection={scrollToSection} />

        {/* Section 2: Two Pillars & Proof Stats Banner (Image 2) */}
        <FeatureSplitSection scrollToSection={scrollToSection} />

        {/* Section 3: Indikator & Workflow Interactive Tabs (Image 3) */}
        <WorkflowTabsSection />

        {/* Section 4: 3-Column Core Capabilities & Bottom Callout (Image 4) */}
        <CapabilitiesSection />

        {/* Section 5: Real-world Field Scenarios & Diagrams (Image 5) */}
        <FieldScenariosSection />

        {/* Section 6: Cara Melapor & Hasil/Feedback Timeline */}
        <StepsSection />

        {/* Section 7: Identitas Tim & Sekolah */}
        <TeamSection />
      </main>

      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default HomePage;
