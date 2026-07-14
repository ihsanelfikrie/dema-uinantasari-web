import HeroSection from "@/components/home/HeroSection";
import PilarSection from "@/components/home/PilarSection";
import BeritaTerbaru from "@/components/home/BeritaTerbaru";
import CTASection from "@/components/home/CTASection";
import FadeInSection from "@/components/animations/FadeInSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background">
      <HeroSection />
      <PilarSection />
      <FadeInSection>
        <BeritaTerbaru />
      </FadeInSection>
      <FadeInSection>
        <CTASection />
      </FadeInSection>
    </div>
  );
}
