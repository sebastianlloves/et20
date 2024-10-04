/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental:{
    ppr: true
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/analisis-academico',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
