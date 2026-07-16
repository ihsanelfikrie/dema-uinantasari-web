import HeroSection from "@/components/home/HeroSection";
import LaunchingVideoSection from "@/components/home/LaunchingVideoSection";
import LeadersProfiles from "@/components/home/LeadersProfiles";
import VisiMisiSection from "@/components/home/VisiMisiSection";
import AgendaTerkini from "@/components/home/AgendaTerkini";
import BeritaTerbaru from "@/components/home/BeritaTerbaru";
import FadeInSection from "@/components/animations/FadeInSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background dark:bg-brand-dark-bg transition-colors duration-300">
      <HeroSection />
      
      <FadeInSection>
        <LaunchingVideoSection />
      </FadeInSection>

      <FadeInSection>
        <LeadersProfiles />
      </FadeInSection>
      
      <FadeInSection>
        <VisiMisiSection />
      </FadeInSection>
      
      <FadeInSection>
        <AgendaTerkini />
      </FadeInSection>
      
      <FadeInSection>
        <BeritaTerbaru />
      </FadeInSection>
    </div>
  );
}
