import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ledgerly — 3D Freelancer Invoicing & Expense Engine",
  description: "Next-generation financial operations for modern freelancers and creative studios. Create high-impact invoices, track expenses, and unlock effortless cashflow with bold 3D precision.",
  keywords: ["freelance invoicing", "expense tracker", "3D SaaS", "invoice generator", "creative studio billing"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable} dark`}>
      <body className="font-sans antialiased min-h-screen bg-[#040d0a] text-[#f3f4f6] bg-noise selection:bg-emerald-500 selection:text-black">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
