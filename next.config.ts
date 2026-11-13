import type { NextConfig } from "next";

function getBackendUrl() {
  const url = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!url || !/^https?:\/\//i.test(url)) {
    return null;
  }

  return url.replace(/\/+$/, "");
}

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = getBackendUrl();

    if (!backendUrl) {
      return [];
    }

    // Mantém as chamadas da API no mesmo domínio do frontend.
    // Isso faz os cookies de sessão pertencerem ao domínio da Vercel,
    // permitindo que o proxy (src/proxy.ts) os leia.
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
