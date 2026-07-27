import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import WhatIDoSection from './sections/WhatIDoSection'
import ProjectsSection from './sections/ProjectsSection'

export default function App() {
  return (
    <main className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <WhatIDoSection />
      <ProjectsSection />
    </main>
  )
}
