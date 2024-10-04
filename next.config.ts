/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
