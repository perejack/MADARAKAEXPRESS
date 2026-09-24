import { Info } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-950 text-xs sm:text-sm px-4 py-2.5 relative z-[60]">
      <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0 text-amber-700" aria-hidden />
        <p>
          <span className="font-semibold">{siteConfig.businessName}</span> — {siteConfig.shortDisclaimer}
        </p>
      </div>
    </div>
  );
}
