/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects () {
    return [
      {
        source: '/',
        destination: '/analisis-academico',
        permanent: true
      }]
  }
}

export default nextConfig
