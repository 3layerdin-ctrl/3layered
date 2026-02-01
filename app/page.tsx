import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductCategories } from "@/components/ProductCategories";
import { CustomPrintCTA } from "@/components/CustomPrintCTA";
import { BrandMarquee } from "@/components/BrandMarquee";
import { InstagramReels } from "@/components/InstagramReels";
import { SEOContent } from "@/components/SEOContent";
import { SlideProvider } from "@/contexts/SlideContext";
import { CouponNotification } from "@/components/CouponBanner";

export default function Home() {
  return (
    <SlideProvider>
      <Navbar />
      <CouponNotification />
      <main>
        <HeroSection />
        <ProductCategories />
        <SEOContent />
        <CustomPrintCTA />
        <BrandMarquee />
        <InstagramReels />
      </main>
    </SlideProvider>
  );
}
