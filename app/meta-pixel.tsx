"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function MetaPixelTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip the first render — the base script in <head> already fired PageView on initial load.
        // Only fire on subsequent client-side route changes (SPA navigation).
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "PageView");
        }
    }, [pathname, searchParams]);

    return null;
}

export default function MetaPixel() {
    return (
        <Suspense fallback={null}>
            <MetaPixelTracker />
        </Suspense>
    );
}
