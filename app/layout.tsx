import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pointme - Service Booking Platform",
  description: "Book and manage services on the go",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pointme"
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-4 md:gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 fixed top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-4 text-sm">
                  <div className="flex gap-3 items-center font-semibold">
                    <Link href={"/"}>Pointme</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    <ThemeSwitcher />
                  </div>
                </div>
              </nav>
              <div className="w-full max-w-5xl pt-16 px-3">
                {children}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
