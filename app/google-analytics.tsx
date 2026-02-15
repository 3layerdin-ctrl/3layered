"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function GoogleAnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).gtag) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
            (window as any).gtag("config", "G-FSFPSVJX1N", {
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}

export default function GoogleAnalytics() {
    return (
        <Suspense fallback={null}>
            <GoogleAnalyticsTracker />
        </Suspense>
    );
}
