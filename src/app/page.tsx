import { AmbientBackground } from "@/components/AmbientBackground";
import { IntroLoader } from "@/components/IntroLoader";
import { SkipLink } from "@/components/SkipLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CapabilitiesSection } from "@/sections/CapabilitiesSection";
import { ContactSection } from "@/sections/ContactSection";
import { EcommerceSection } from "@/sections/EcommerceSection";
import { HeroSection } from "@/sections/HeroSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { ProjectsSection } from "@/sections/ProjectsSection";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <AmbientBackground />
      <div className="relative z-10">
        <SkipLink />
        <SiteHeader />
        <main id="main">
          <HeroSection />
          <ProjectsSection />
          <CapabilitiesSection />
          <EcommerceSection />
          <ProcessSection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
