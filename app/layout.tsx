import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/contexts/ToastContext";
import CookieBanner from "@/components/CookieBanner";
import FeedbackButton from "@/components/FeedbackButton";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aiclub-bootcamp.com'),
  title: {
    default: 'AI Bootcamp | Master AI Tools & Techniques by Roman Slack',
    template: '%s | AI Bootcamp by Roman Slack'
  },
  description: 'Learn AI fundamentals through interactive modules and hands-on practice. Created by Roman Slack, AI Bootcamp offers structured pathways in prompt engineering, image generation, and advanced AI techniques. Join 60+ learners mastering artificial intelligence.',
  keywords: [
    'AI Bootcamp',
    'Roman Slack',
    'artificial intelligence training',
    'AI learning platform',
    'prompt engineering course',
    'AI image generation',
    'machine learning bootcamp',
    'AI education',
    'interactive AI courses',
    'AI certification',
    'learn AI online',
    'AI tutorials',
    'ChatGPT training',
    'Stable Diffusion course',
    'AI for beginners',
    'advanced AI techniques'
  ],
  authors: [
    { name: 'Roman Slack', url: 'https://www.aiclub-bootcamp.com' }
  ],
  creator: 'Roman Slack',
  publisher: 'AI Bootcamp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.aiclub-bootcamp.com',
    siteName: 'AI Bootcamp',
    title: 'AI Bootcamp | Master AI Tools & Techniques by Roman Slack',
    description: 'Interactive AI learning platform created by Roman Slack. Master prompt engineering, image generation, and advanced AI techniques through structured pathways and hands-on modules.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Bootcamp - Learn AI with Roman Slack',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Bootcamp | Master AI Tools by Roman Slack',
    description: 'Interactive AI learning platform. Master prompt engineering, image generation, and advanced AI techniques.',
    creator: '@romanslack',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  category: 'education',
  classification: 'Education & Learning',
  alternates: {
    canonical: 'https://www.aiclub-bootcamp.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <ToastProvider>
          {children}
          <CookieBanner />
          <FeedbackButton />
        </ToastProvider>
      </body>
    </html>
  );
}