import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   // transpilePackages: ["@buidlerlabs/hashgraph-react-wallets", "uuid", "wagmi"],
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "ipfs.io",
            port: "",
            pathname: "/**",
         },
      ],
   },
};

export default nextConfig;
