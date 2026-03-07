import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BestSellers } from "@/components/BestSellers";
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
      <main className="bg-[#FAF7F2]">
        <h1 className="sr-only">3D Printed Miniature Temple Models & Architectural Replicas | 3 Layered, Pimpri-Chinchwad</h1>
        <HeroSection />
        <BestSellers />
        <ProductCategories />
        <SEOContent />
        
        {/* Spacing adjustments for premium breathing room */}
        <div className="h-12 md:h-24 bg-[#FAF7F2]" />
        <CustomPrintCTA />
        
        <div className="h-12 md:h-24 bg-[#FAF7F2]" />
        <BrandMarquee />
        
        <div className="h-12 md:h-24 bg-[#FAF7F2]" />
        <InstagramReels />
      </main>
    </SlideProvider>
  );
}
