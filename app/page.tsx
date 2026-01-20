import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductCategories } from "@/components/ProductCategories";
import { CustomPrintCTA } from "@/components/CustomPrintCTA";
import { BrandMarquee } from "@/components/BrandMarquee";
import { InstagramReels } from "@/components/InstagramReels";
import { SEOContent } from "@/components/SEOContent";
import { SlideProvider } from "@/contexts/SlideContext";
import { HomePrebookPopupWrapper } from "@/components/HomePrebookPopupWrapper";

export default function Home() {
  return (
    <SlideProvider>
      <Navbar />
      <main>
        <HeroSection />
        <ProductCategories />
        <SEOContent />
        <CustomPrintCTA />
        <BrandMarquee />
        <InstagramReels />

        {/* Prebook Popup - Shows after 3 seconds */}
        <HomePrebookPopupWrapper />
      </main>
    </SlideProvider>
  );
}
