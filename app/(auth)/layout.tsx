"use client"

import { useEffect, useState } from "react";

export default function PageLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div className="mx-8 lg:mx-0">
            {children}
        </div>
    )
}
