"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FormSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    delay?: number;
}

export function FormSection({ title, description, children, delay = 0 }: FormSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className="mb-12"
        >
            <div className="mb-6 border-b border-border pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
                {description && <p className="text-gray-400">{description}</p>}
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </motion.div>
    );
}
