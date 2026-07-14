import HeroSection from "@/components/home/HeroSection";
import LeadersProfiles from "@/components/home/LeadersProfiles";
import VisiMisiSection from "@/components/home/VisiMisiSection";
import AgendaTerkini from "@/components/home/AgendaTerkini";
import BeritaTerbaru from "@/components/home/BeritaTerbaru";
import FadeInSection from "@/components/animations/FadeInSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background dark:bg-brand-darkBg transition-colors duration-300">
      <HeroSection />
      
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
