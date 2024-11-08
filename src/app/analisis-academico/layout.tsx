import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="h-[90dvh] px-1 sm:px-1.5 lg:px-4">{children}</div>
}

export default Layout
