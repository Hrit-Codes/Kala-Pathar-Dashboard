import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/src/lib/query-provider";

export const metadata: Metadata = {
  title: {
    default: "Kala Pathar Expeditions Admin Dashboard",
    template: "%s | Kala Pathar Expeditions Admin",
  },
  description:
    "Internal admin dashboard for managing Kala Pathar Expeditions packages, itineraries, campaigns, inquiries, and content.",
  applicationName: "Kala Pathar Expeditions Admin Dashboard",
  icons: {
    icon: [
      {
        url: "/Logo.png",
        type: "image/png",
      },
    ],
    apple: "/Logo.png",
  },
  robots: {
    index: false, // Meaning don't show this page in search results,
    follow: false, // Meaning don't follow links from this page
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>
                    {children}
                    <Toaster position="top-center" richColors />
                </QueryProvider>
            </body>
        </html>
    );
}
