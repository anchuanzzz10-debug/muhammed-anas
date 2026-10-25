import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { location, services, site } from "@/content/site";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // Only used for small labels, so it shouldn't compete with critical resources.
  preload: false,
});

const localKeywords = [
  "digital marketer in Kanhangad",
  "digital marketing Kanhangad",
  "digital marketing Kasaragod",
  "digital marketing services Kerala",
  "performance marketing Kasaragod",
  "social media marketing Kanhangad",
  "Meta ads Kasaragod",
  "Google ads Kanhangad",
  "SEO Kanhangad",
  "SEO services Kasaragod",
  "web development Kanhangad",
  "website design Kasaragod",
  "custom software development Kasaragod",
  "branding Kanhangad",
  "video editing Kasaragod",
];

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [site.name, site.jobTitle, ...localKeywords, ...services.map((s) => s.title)],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.shareTitle,
    description: site.shareDescription,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image", title: site.shareTitle, description: site.shareDescription },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: {
    ...(site.googleSiteVerification ? { google: site.googleSiteVerification } : {}),
    ...(site.bingSiteVerification ? { other: { "msvalidate.01": site.bingSiteVerification } } : {}),
  },
  other: {
    "geo.region": location.regionCode,
    "geo.placename": `${location.label}, ${location.region}`,
  },
  category: "marketing",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Applies the saved/system theme before paint to avoid a flash.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.language}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
