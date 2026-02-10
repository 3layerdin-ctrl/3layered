"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useSlide } from "@/contexts/SlideContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";

import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

export function Navbar() {
    const { isScrolled } = useScrollPosition();
    const [navbarOpacity, setNavbarOpacity] = useState(0);
    const { scrollY } = useScroll();
    const { isDarkSlide } = useSlide();
    const { cart, openCart } = useCart();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const isProductsPage = pathname === '/products';

    // Sync navbar opacity with logo animation - both trigger at 50px scroll
    useEffect(() => {
        const unsubscribe = scrollY.on('change', (latest) => {
            if (latest > 50) {
                setNavbarOpacity(1);
            } else if (latest <= 10) {
                setNavbarOpacity(0);
            }
        });

        return () => unsubscribe();
    }, [scrollY]);

    // Determine navbar background color
    const getNavbarBg = () => {
        if (isScrolled) return "bg-white shadow-md";
        // Transparent background on all pages when not scrolled
        return "bg-transparent";
    };

    // Determine text color based on navbar background for proper contrast
    const getTextColor = () => {
        // When scrolled, navbar is white, so use black text
        if (isScrolled) return "text-black";
        // Use slide darkness for dynamic text color on all pages
        return isDarkSlide ? "text-white" : "text-black";
    };

    const textColor = getTextColor();

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMenuOpen ? 'z-[100]' : 'z-50'} ${getNavbarBg()}`}
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
            initial={{ height: "5rem" }}
            animate={{
                height: isScrolled ? "4rem" : "5rem",
                boxShadow: isScrolled ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
            transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
            }}
        >
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                {/* Left Nav Items */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium hover:opacity-60 transition-all duration-300"
                            style={{ color: textColor === "text-white" ? "white" : "black" }}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Logo space reserved - actual logo rendered by LogoController */}
                <div className="absolute left-1/2 -translate-x-1/2 opacity-0 pointer-events-none">
                    {/* TODO: Replace with actual logo image with alt="3 Layered Premium 3D Printing Logo - Miniature Temples & Architectural Models" */}
                    Logo placeholder
                </div>

                {/* Right Side - CTA & Icons */}
                <div className="flex items-center gap-4">
                    <a
                        href="/custom-print"
                        className={`hidden sm:block px-6 py-2 text-sm font-medium transition-all duration-300 ${textColor === "text-white" ? "text-white" : "text-black"
                            }`}
                        style={{
                            borderColor: textColor === "text-white" ? "white" : "black",
                            borderWidth: '1px',
                            borderStyle: 'solid'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = textColor === "text-white" ? "white" : "black";
                            e.currentTarget.style.color = textColor === "text-black" ? "white" : "black";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = textColor === "text-white" ? "white" : "black";
                        }}
                    >
                        Custom Print
                    </a>
                    <button
                        className="p-3 hover:opacity-60 transition-all duration-300 relative min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Shopping cart"
                        onClick={openCart}
                    >
                        <ShoppingCart className="w-6 h-6" style={{ color: textColor === "text-white" ? "white" : "black" }} />
                        {cart.totalItems > 0 && (
                            <span
                                className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                                style={{
                                    backgroundColor: textColor === "text-white" ? "white" : "black",
                                    color: textColor === "text-white" ? "black" : "white"
                                }}
                            >
                                {cart.totalItems > 9 ? '9+' : cart.totalItems}
                            </span>
                        )}
                    </button>

                </div>

                {/* Mobile Menu Button - 48x48px touch target */}
                <button
                    className="md:hidden p-3 min-w-[48px] min-h-[48px] flex flex-col items-center justify-center"
                    aria-label="Menu"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="w-6 h-0.5 mb-1.5 transition-all duration-300" style={{
                        backgroundColor: textColor === "text-white" ? "white" : "black",
                        transform: isMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none'
                    }}></div>
                    <div className="w-6 h-0.5 mb-1.5 transition-all duration-300" style={{
                        backgroundColor: textColor === "text-white" ? "white" : "black",
                        opacity: isMenuOpen ? 0 : 1
                    }}></div>
                    <div className="w-6 h-0.5 transition-all duration-300" style={{
                        backgroundColor: textColor === "text-white" ? "white" : "black",
                        transform: isMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'
                    }}></div>
                </button>
            </div>

            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[105] md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Panel - Better mobile spacing */}
                    <motion.div
                        className="fixed top-20 right-0 bottom-0 w-80 bg-white shadow-xl z-[110] md:hidden overflow-y-auto"
                        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <nav className="flex flex-col p-6 gap-2">
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-lg font-medium text-black hover:opacity-60 transition-all py-4 min-h-[48px] flex items-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <hr className="my-2" />
                            <a
                                href="/custom-print"
                                className="text-lg font-medium text-black hover:opacity-60 transition-all py-4 min-h-[48px] flex items-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Custom Print
                            </a>
                        </nav>
                    </motion.div>
                </>
            )}
        </motion.header>
    );
}
