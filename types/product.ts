// Product Page Type Definitions
// Premium Miniature Temples — Three Layered

// ============================================
// Core Image & Media Types
// ============================================

export interface Image {
  id: string;
  url: string;
  alt: string;
  order: number;
  caption?: string;
}

export interface GalleryImage extends Image {
  isHero: boolean; // Primary image
  thumbnail?: string;
}

// ============================================
// Pricing & Currency
// ============================================

export interface Price {
  amount: number;
  compareAtPrice?: number; // Original price before discount
  currency: 'USD' | 'INR' | 'EUR' | 'GBP';
  displayFormat: string; // e.g., "₹{amount}" or "${amount}"
}

// ============================================
// SEO & Metadata
// ============================================

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogType?: string;
  structuredData?: Record<string, unknown>; // JSON-LD
}

// ============================================
// Section 1: Hero Section
// ============================================

export interface Badge {
  enabled: boolean;
  text: string;
  variant: 'premium' | 'exclusive' | 'limited' | 'hand-finished' | 'prebook' | 'led';
}

export interface CTA {
  primaryLabel: string;
  primaryAction: 'buy' | 'customize' | 'inquire';
  secondaryLabel?: string;
  secondaryAction?: string;
}

export interface HeroSection {
  productName: string;
  tagline: string; // Emotional hook
  badge: Badge;
  price: Price;
  cta: CTA;
  gallery: GalleryImage[];
}

// ============================================
// Section 2: Story / Inspiration
// ============================================

export interface Quote {
  enabled: boolean;
  text: string;
  attribution?: string;
}

export interface StorySection {
  enabled: boolean;
  title: string;
  paragraphs: string[];
  quote: Quote;
  image?: Image;
}

// ============================================
// Section 3: Craftsmanship & Materials
// ============================================

export interface Material {
  name: string; // e.g., "Premium Resin", "Architectural PLA"
  description: string;
  properties: string[]; // e.g., ["UV-resistant", "Eco-friendly"]
}

export interface Finish {
  type: string; // e.g., "Matte Black", "Stone Texture"
  description: string;
  handFinished: boolean;
}

export interface Process {
  method: string; // e.g., "SLA 3D Printing + Hand Finishing"
  description: string;
  steps?: string[];
}

export interface Care {
  durability: string;
  instructions: string[];
}

export interface CraftsmanshipSection {
  material: Material;
  finish: Finish;
  process: Process;
  care: Care;
}

// ============================================
// Section 4: Specifications
// ============================================

export interface Dimension {
  value: number;
  unit: 'cm' | 'in' | 'mm';
}

export interface Dimensions {
  height: Dimension;
  width: Dimension;
  depth: Dimension;
  displayUnits: 'metric' | 'imperial' | 'both';
}

export interface Weight {
  value: number;
  unit: 'g' | 'kg' | 'oz' | 'lb';
}

export interface Scale {
  ratio: string; // e.g., "1:200"
  description: string;
}

export interface Comparison {
  enabled: boolean;
  text: string; // e.g., "Size of a coffee mug"
  imageUrl?: string;
}

export interface SpecificationsSection {
  dimensions: Dimensions;
  weight: Weight;
  scale?: Scale;
  comparison?: Comparison;
  additionalSpecs?: Array<{ label: string; value: string }>;
}

// ============================================
// Section 5: Customization Options
// ============================================

export interface CustomizationVariant {
  id: string;
  name: string; // e.g., "Large (20cm)"
  priceModifier: number; // Positive or negative
  available: boolean;
  leadTime?: string; // e.g., "Ships in 2 weeks"
  imageUrl?: string;
}

export interface CustomizationOption {
  id: string;
  type: 'size' | 'finish' | 'engraving' | 'material' | 'custom';
  label: string; // e.g., "Size Selection"
  required: boolean;
  variants: CustomizationVariant[];
}

export interface CustomRequest {
  enabled: boolean;
  ctaLabel: string;
  formUrl?: string;
}

export interface CustomizationSection {
  enabled: boolean;
  options: CustomizationOption[];
  customRequest: CustomRequest;
}

// ============================================
// Section 6: Use Cases
// ============================================

export interface UseCase {
  id: string;
  title: string; // e.g., "Executive Desk Centerpiece"
  description: string;
  imageUrl: string;
  order: number;
}

export interface UseCasesSection {
  enabled: boolean;
  title?: string;
  cases: UseCase[];
  displayStyle: 'grid' | 'carousel' | 'stacked';
}

// ============================================
// Section 7: Trust & Assurance
// ============================================

export interface Production {
  type: 'made-to-order' | 'in-stock' | 'limited-batch';
  leadTime: {
    min: number;
    max: number;
    unit: 'days' | 'weeks';
    description: string;
  };
}

export interface Shipping {
  description: string;
  methods?: string[];
  freeShippingThreshold?: number;
}

export interface Returns {
  policy: string;
  linkUrl?: string;
}

export interface Guarantee {
  icon: string;
  text: string;
}

export interface AssuranceSection {
  production: Production;
  shipping: Shipping;
  returns: Returns;
  guarantees: Guarantee[];
}

// ============================================
// Section 8: Customer Reviews
// ============================================

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5; // Star rating
  date: string; // ISO date string
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface ReviewsSection {
  enabled: boolean;
  averageRating: number; // Calculated from reviews
  totalReviews: number;
  reviews: Review[];
}

// ============================================
// Section 9: Frequently Asked Questions
// ============================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface FAQSection {
  enabled: boolean;
  title?: string;
  items: FAQItem[];
}

// ============================================
// Section 10: Related Products
// ============================================

export interface RelatedProduct {
  productId: string;
  order?: number;
}

export interface RelatedProductsSection {
  enabled: boolean;
  title: string;
  selectionType: 'manual' | 'automatic-category' | 'automatic-similar';
  products: RelatedProduct[];
  displayLimit: number;
  layout: 'carousel' | 'grid';
}

// ============================================
// Main Product Page Interface
// ============================================

export interface ProductPage {
  id: string;
  slug: string; // URL-friendly identifier
  categoryId: string;
  status: 'draft' | 'published' | 'archived';
  isPrebook?: boolean; // Flag for prebook-only products

  // SEO
  seo: SEOMetadata;

  // All Sections
  hero: HeroSection;
  story: StorySection | null;
  craftsmanship: CraftsmanshipSection;
  specifications: SpecificationsSection;
  customization: CustomizationSection | null;
  useCases: UseCasesSection | null;
  assurance: AssuranceSection;
  reviews: ReviewsSection | null;
  faqs: FAQSection | null;
  relatedProducts: RelatedProductsSection;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Category Interface
// ============================================

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  extendedDescription?: string; // Optional extended description for expanded displays
  imageUrl: string;
  productIds: string[];

  // SEO metadata fields
  metaTitle?: string; // SEO-optimized title for category page
  metaDescription?: string; // SEO-optimized meta description
  metaKeywords?: string[]; // Target keywords for category

  // Admin-controllable fields
  displayOnHomepage: boolean; // Toggle visibility on homepage
  displayOrder: number; // Control order of appearance
  status: 'active' | 'inactive' | 'draft'; // Category status
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Simplified Product Interface (for listings)
// ============================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  isFeatured: boolean;
  inStock: boolean;
  status: 'draft' | 'published' | 'archived';
  isPrebook?: boolean;
}
