import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProductCategories } from "@/components/ProductCategories";
import { CustomPrintCTA } from "@/components/CustomPrintCTA";
import { BrandMarquee } from "@/components/BrandMarquee";
import { InstagramReels } from "@/components/InstagramReels";
import { SEOContent } from "@/components/SEOContent";
import { SlideProvider } from "@/contexts/SlideContext";

export default function Home() {
  return (
    <SlideProvider>
      <Navbar />
      <main>
        <h1 className="sr-only">3D Printed Miniature Temple Models & Architectural Replicas | 3 Layered, Pimpri-Chinchwad</h1>
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
