import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholders locais; nenhuma origem remota por enquanto.
    formats: ['image/avif', 'image/webp'],
  },
  // O caminho do projeto tem espaços e acentos (Google Drive), então o alias
  // "@/" é declarado explicitamente em vez de depender só do tsconfig.
  webpack: (config) => {
    config.resolve.alias['@'] = raiz;
    return config;
  },
  turbopack: {
    root: raiz,
    resolveAlias: { '@/*': './*' },
  },
};

export default nextConfig;
