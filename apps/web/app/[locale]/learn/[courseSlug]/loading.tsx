export default function LearnLoading() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex flex-col w-72 border-r border-border bg-card h-screen sticky top-0 p-4 gap-3">
        <div className="h-6 w-3/4 rounded-lg bg-muted animate-pulse mb-2" />
        <div className="h-4 w-1/2 rounded bg-muted animate-pulse mb-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-4 rounded bg-muted animate-pulse" style={{ width: `${55 + (i % 3) * 15}%` }} />
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-6 sm:p-10 max-w-3xl mx-auto w-full">
        {/* Badge + title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
          <div className="h-4 w-14 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-9 w-2/3 rounded-xl bg-muted animate-pulse mb-8" />

        {/* Content block */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 rounded bg-muted animate-pulse"
              style={{ width: `${70 + (i % 4) * 8}%` }}
            />
          ))}
        </div>

        {/* Code editor skeleton */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="h-10 bg-card border-b border-border flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/40" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
              <div className="w-3 h-3 rounded-full bg-green-500/40" />
            </div>
            <div className="h-3 w-16 rounded bg-muted animate-pulse ml-2" />
          </div>
          <div className="bg-[hsl(240,21%,10%)] h-48 p-4 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-3 rounded bg-white/5 animate-pulse"
                style={{ width: `${30 + (i % 5) * 12}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
