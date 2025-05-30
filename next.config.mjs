/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js'],
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
};

export default nextConfig;
