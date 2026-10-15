/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  // Export estático: as capturas já saem no tamanho certo, sem otimização em servidor.
  images: { unoptimized: true }
};

export default nextConfig;
