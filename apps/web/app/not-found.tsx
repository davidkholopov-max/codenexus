import Link from 'next/link'
import { Code2 } from 'lucide-react'

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Code2 className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-6xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        This page doesn't exist or has been moved.
      </p>
      <Link
        href="/en"
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
