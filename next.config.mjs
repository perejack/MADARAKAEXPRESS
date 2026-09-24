/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Keep `npm run lint` strict, but don't fail production builds due to formatting/lint rules.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
