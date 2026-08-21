import { AmbientBackground } from "@/components/AmbientBackground";
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
          <ProcessSection />
          <div className="flex flex-col gap-6 px-6">
            <ProjectsSection />
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
