import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Melhore.AI | Engenharia de Prompts de Elite para ChatGPT e Gemini",
  description: "Transforme comandos básicos em estratégias de alta performance. A plataforma definitiva para profissionais que buscam resultados reais com inteligência artificial.",
  keywords: ["prompt engineering", "engenharia de prompts", "chatgpt", "gemini", "inteligência artificial", "produtividade", "marketing digital"],
  authors: [{ name: "Melhore.AI Team" }],
  openGraph: {
    title: "Melhore.AI | Engenharia de Prompts de Elite",
    description: "Saia do básico. Gere prompts que extraem o máximo potencial da IA.",
    url: "https://melhore.ai",
    siteName: "Melhore.AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Melhore.AI - Engenharia de Prompts de Elite",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Melhore.AI | Engenharia de Prompts de Elite",
    description: "Transforme seus resultados com a melhor engenharia de prompts do Brasil.",
  },
  icons: {
    icon: "/icon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
