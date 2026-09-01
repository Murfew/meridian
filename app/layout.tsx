import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Meridian",
  description: "Scheduling and booking, made simple.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body>
        {/*
          THESIS: Refuses generic default-shadcn chrome; the accent is earned
          on primary actions and links, never decorative.
          OWN-WORLD: Dark-first near-black neutral ground, Geist type, one
          indigo accent (oklch 0.585 0.233 277), thin borders over shadows,
          0.625rem radius throughout.
          STORY: A solo provider lands on a centered card, sees the one
          required action immediately, and completes it with no visual
          noise competing for attention.
          FIRST VIEWPORT: Full-height centered flex, one bordered card
          (420-600px), vertical field stack, one primary button, one
          secondary link.
          FORM: Restrained neutral+accent, standing exit (Vercel/Linear
          canon), pinned by explicit user brief, not rolled.
          FINISH: unreviewed and undocumented is unfinished; this build ends
          with the finish review, the verdict, DESIGN.md, and every shipping
          raster carrying its provenance.
        */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
