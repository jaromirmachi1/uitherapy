import { InteractiveCursor } from "@/components/InteractiveCursor";
import { SiteBackground } from "@/components/SiteBackground";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InteractiveCursor />
      <SiteBackground />
      <div className="relative z-10">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex flex-col gap-3 py-3 sm:gap-6 sm:py-6">
          {children}
        </main>
        <div className="px-2.5 pb-20 sm:px-6 sm:pb-6">
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
