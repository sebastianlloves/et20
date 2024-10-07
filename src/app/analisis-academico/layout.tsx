// import MarcaTemporal from '@/components/ui/marca-temporal'
import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-1.5 lg:px-4">
      {/* <MarcaTemporal /> */}
      {children}
    </div>
  )
}

export default Layout
