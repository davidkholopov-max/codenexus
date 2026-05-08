export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Greeting skeleton */}
        <div className="mb-10 space-y-2">
          <div className="h-8 w-64 rounded-xl bg-muted animate-pulse" />
          <div className="h-4 w-48 rounded-xl bg-muted animate-pulse" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-16 rounded bg-muted animate-pulse" />
                <div className="h-3 w-24 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 h-52 animate-pulse" />
            <div className="bg-card border border-border rounded-2xl p-6 h-48 animate-pulse" />
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 h-72 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
