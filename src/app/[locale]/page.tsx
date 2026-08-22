import { SiteBackground } from "@/components/SiteBackground";
import { InteractiveCursor } from "@/components/InteractiveCursor";
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
      <InteractiveCursor />
      <SiteBackground />
      <div className="relative z-10">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex flex-col gap-3 py-3 sm:gap-6 sm:py-6">
          <div className="px-2.5 sm:px-6">
            <RingStatementSection />
          </div>
          <ProcessSection />
          <div className="px-2.5 sm:px-6">
            <ProjectsSection />
          </div>
          <div className="px-2.5 sm:px-6">
            <ContactSection />
          </div>
        </main>
        <div className="px-2.5 pb-20 sm:px-6 sm:pb-6">
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
