import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { jaJP } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "シュウカン - 習慣トラッキングアプリ",
    template: "%s | シュウカン",
  },
  description:
    "シュウカンは、毎日の習慣を簡単に記録・分析できる日本発の習慣トラッキングアプリです。ストリーク追跡、統計分析、テンプレートで習慣化をサポート。",
  keywords: [
    "習慣トラッカー",
    "習慣化",
    "習慣管理",
    "ルーティン",
    "生産性",
    "習慣アプリ",
    "シュウカン",
  ],
  openGraph: {
    title: "シュウカン - 習慣トラッキングアプリ",
    description:
      "毎日の小さな積み重ねが、大きな変化を生む。シュウカンで習慣を見える化しよう。",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "シュウカン - 習慣トラッキングアプリ",
    description:
      "毎日の小さな積み重ねが、大きな変化を生む。シュウカンで習慣を見える化しよう。",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja" className={notoSansJP.variable}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "シュウカン",
                description:
                  "毎日の習慣を簡単に記録・分析できる日本発の習慣トラッキングアプリ",
                applicationCategory: "ProductivityApplication",
                operatingSystem: "Web",
                inLanguage: "ja",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "JPY",
                },
              }),
            }}
          />
        </head>
        <body className="font-sans antialiased">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
