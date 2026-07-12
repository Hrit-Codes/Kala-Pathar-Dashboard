// src/hooks/AuthSync.tsx
"use client";

import { useEffect } from "react";

interface AuthSyncProps {
    token: string | null;
}

export function AuthSync({ token }: AuthSyncProps) {
    useEffect(() => {
        if (token) {
            localStorage.setItem("access_token", token);
        } else {
            localStorage.removeItem("access_token");
        }
    }, [token]);

    return null; 
}