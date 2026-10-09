import HeroSection from "@/components/home/HeroSection";
import EventSection from "@/components/home/EventSection";
import VisiMisiSection from "@/components/home/VisiMisiSection";
import LaunchingVideoSection from "@/components/home/LaunchingVideoSection";
import LeadersProfiles from "@/components/home/LeadersProfiles";
import AgendaTerkini from "@/components/home/AgendaTerkini";
import BeritaTerbaru from "@/components/home/BeritaTerbaru";
import CTASection from "@/components/home/CTASection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background">
      <HeroSection />
      <LaunchingVideoSection />
      <EventSection />
      <VisiMisiSection />
      <LeadersProfiles />
      <AgendaTerkini />
      <BeritaTerbaru />
      <CTASection />
    </div>
  );
}
