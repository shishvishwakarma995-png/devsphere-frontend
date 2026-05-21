// No "use client" needed — pure CSS animation
export function PostSkeleton() {
  return (
    <div className="bg-dark-card border border-dark-border
                   rounded-xl p-4 animate-pulse">
      {/* Meta line */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-3 w-20 bg-dark-elev rounded-full"/>
        <div className="h-3 w-3 bg-dark-elev rounded-full"/>
        <div className="h-3 w-24 bg-dark-elev rounded-full"/>
      </div>
      {/* Title */}
      <div className="h-4 bg-dark-elev rounded-lg w-4/5 mb-2"/>
      <div className="h-4 bg-dark-elev rounded-lg w-3/5 mb-4"/>
      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-dark-elev rounded-md"/>
        <div className="h-5 w-20 bg-dark-elev rounded-md"/>
        <div className="h-5 w-14 bg-dark-elev rounded-md"/>
      </div>
      {/* Actions */}
      <div className="flex gap-2">
        <div className="h-7 w-24 bg-dark-elev rounded-lg"/>
        <div className="h-7 w-20 bg-dark-elev rounded-lg"/>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-pulse">
      {/* Cover */}
      <div className="h-32 bg-dark-elev rounded-2xl mb-4"/>
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-dark-elev border-4
                        border-dark-card"/>
          <div className="h-9 w-28 bg-dark-elev rounded-lg"/>
        </div>
        <div className="h-5 w-40 bg-dark-elev rounded-lg mb-2"/>
        <div className="h-3 w-24 bg-dark-elev rounded-full mb-3"/>
        <div className="h-3 w-full bg-dark-elev rounded-full mb-2"/>
        <div className="h-3 w-3/4 bg-dark-elev rounded-full"/>
      </div>
    </div>
  )
}

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(4)].map((_,i) => <PostSkeleton key={i}/>)}
    </div>
  )
}