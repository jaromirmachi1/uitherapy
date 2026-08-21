import { AmbientBackground } from "@/components/AmbientBackground";
import { GradientWaves } from "@/components/GradientWaves";
import { InteractiveCursor } from "@/components/InteractiveCursor";
import { IntroLoader } from "@/components/IntroLoader";
import { SkipLink } from "@/components/SkipLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactSection } from "@/sections/ContactSection";
import { ProcessSection } from "@/sections/ProcessSection";
import { ProjectsSection } from "@/sections/ProjectsSection";
import { RingStatementSection } from "@/sections/RingStatementSection";

export default function Home() {
  return (
    <>
      <IntroLoader />
      <InteractiveCursor />
      <AmbientBackground />
      <div className="relative z-10">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex flex-col gap-6 py-6">
          <div className="px-6">
            <RingStatementSection />
          </div>

          <div className="relative">
            <div className="pointer-events-none sticky top-0 z-0 h-dvh overflow-hidden">
              <GradientWaves
                horizonColor="#e8e8e8"
                waveColor="#1f5eff"
                crestColor="#ffffff"
                speed={0.38}
                opacity={0.92}
                brightness={1.22}
                fogDepth={24}
                amplitude={3.1}
                detail="medium"
              />
            </div>
            <div className="relative z-1 -mt-[100dvh] flex flex-col gap-6">
              <ProcessSection />
              <div className="px-6">
                <ProjectsSection />
              </div>
            </div>
          </div>

          <div className="px-6">
            <ContactSection />
          </div>
        </main>
        <div className="px-6 pb-6">
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
