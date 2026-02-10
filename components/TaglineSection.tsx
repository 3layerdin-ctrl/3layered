"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function TaglineSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 px-6 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-4xl mx-auto text-center"
            >
                <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
                    You dream it. We 3D it.
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    Precision manufacturing meets creative vision. From concept to completion,
                    we transform your ideas into tangible reality with cutting-edge 3D printing
                    technology.
                </p>
            </motion.div>
        </section>
    );
}
