import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
            },
        ],
    },
    turbopack: {
        // Use absolute path explicitly
        root: "C:\\Users\\amaty\\Documents\\MERN\\Kala-Pathar-Dashboard",
    },
};

export default nextConfig;