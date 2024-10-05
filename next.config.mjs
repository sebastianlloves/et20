/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental:{
    ppr: 'incremental'
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
