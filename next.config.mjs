/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "carpenterbullet.in.net",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "**.wordpress.com",
      },
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_WP_URL: process.env.NEXT_PUBLIC_WP_URL,
    WC_KEY: process.env.WC_KEY,
    WC_SECRET: process.env.WC_SECRET,
  },
};

export default nextConfig;
