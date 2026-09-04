import type { Metadata, Viewport } from 'next';
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

import { AudioProvider } from '@/components/providers/AudioProvider';
import CustomCursor from '@/components/CustomCursor';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Intro from '@/components/Intro';
import SideRail from '@/components/SideRail';
import PageTransition from '@/components/PageTransition';
import SmoothScroll from '@/components/SmoothScroll';
import WhatsAppFab from '@/components/WhatsAppFab';
import { site } from '@/content/site';
import { wppMsg } from '@/lib/whatsapp';

/* Display serifada editorial — itálico nos nomes de produto. */
const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

/* Texto: sans humanista. */
const sans = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} — ${site.assinatura}`,
    template: `%s · ${site.nome}`,
  },
  description: site.descricao,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: site.nome,
    title: `${site.nome} — ${site.assinatura}`,
    description: site.descricao,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#354024',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      {/*
        `surface-bone` no body garante que os tokens de superfície existam
        mesmo fora de uma <Section> (header, drawer, elementos fixos).
      */}
      <body className="surface surface-bone font-sans antialiased">
        {/* O AudioProvider fica acima da transição de rota: o som não corta ao navegar. */}
        <AudioProvider>
          <SmoothScroll />
          <CustomCursor />
          <Intro />
          <SideRail />

          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <WhatsAppFab mensagem={wppMsg.geral} />
        </AudioProvider>
      </body>
    </html>
  );
}
