/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'prisma'],
    outputFileTracingIncludes: {
      '/api/*/': [
        './node_modules/*/.wasm',
        './node_modules/*/.proto',
        './node_modules/tesseract.js-core/**/*',
        './node_modules/tesseract.js/**/*',
        './eng.traineddata',
        './ind.traineddata',
      ],
    },
  },
  // Add headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Cookie',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'tesseract.js': 'commonjs tesseract.js',
      });
    }

    // Handle WASM files
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // Copy WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    return config;
  },
  // If using custom server, add this
  serverRuntimeConfig: {
    maxRequestSize: '50mb',
  },
};

export default nextConfig;
