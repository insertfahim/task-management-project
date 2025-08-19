"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="task-management-theme"
        >
            <div suppressHydrationWarning>
                {mounted ? (
                    children
                ) : (
                    <div style={{ visibility: "hidden" }}>{children}</div>
                )}
            </div>
        </NextThemesProvider>
    );
}
