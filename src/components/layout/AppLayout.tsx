import { type ReactNode } from 'react'

// This component defines the overall layout of the application, including a header (navbar), main content area, and footer. It uses Tailwind CSS for styling and ensures that the main content area takes up the remaining vertical space between the header and footer.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">Navbar</header>
      <main className="flex-1 p-6">{children}</main>
      <footer className="p-4 border-t text-sm text-center">
      &copy; Twinstar Animation 2026. All rights reserved.
      </footer>
    </div>
  )
}