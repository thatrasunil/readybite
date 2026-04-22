import type { Metadata } from "next";
import "./globals.css";
import { Navbar, SplashScreen } from "@/components";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "ReadyBite | Smart Dining Supply Chain",
  description: "Eliminate restaurant waiting time with our smart table booking and food pre-order platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SplashScreen />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
