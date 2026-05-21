"use client"
import useSWR from "swr"
import { useState } from "react"
import { getPosts } from "@/lib/api"
import PostCard from "@/components/PostCard"
import TrendingPanel from "@/components/TrendingPanel"
import { TrendingUp, Loader2 } from "lucide-react"
import { FeedSkeleton } from "@/components/SkeletonCard"

const FILTERS = [
  { label: '🔥 Today', days: 1 },
  { label: '📅 This Week', days: 7 },
  { label: '🏆 All Time', days: 365 },
]

export default function TrendingPage() {
  const [active, setActive] = useState(0)

  const { data: posts, isLoading } = useSWR(
    ['trending', active],
    () => getPosts('top')
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">

      {/* Main content */}
      <div className="flex-1 min-w-0">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20
                          flex items-center justify-center">
            <TrendingUp size={18} className="text-teal" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-txt1">Trending Posts</h1>
            <p className="text-xs text-txt2">Most popular posts on DevSphere</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border-b border-dark-border mb-4">
          {FILTERS.map((f, i) => (
            <button key={f.label} onClick={() => setActive(i)}
              className={`px-4 py-2 text-sm border-b-2 -mb-px transition-all
                ${active === i
                  ? 'text-teal border-teal font-medium'
                  : 'text-txt2 border-transparent hover:text-teal'
                }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <FeedSkeleton />}

        {/* Posts */}
        <div className="flex flex-col gap-3">
          {posts?.length === 0 && !isLoading && (
            <p className="text-center py-12 text-txt2 text-sm">
              No trending posts yet — start posting! 🚀
            </p>
          )}
          {posts?.map((p: any, i: number) => (
            <div key={p.id} className="flex gap-3 items-start">
              {/* Rank number */}
              <div className="w-8 shrink-0 text-center pt-4">
                <span className={`text-lg font-bold
                  ${i === 0 ? 'text-teal' :
                    i === 1 ? 'text-indigo-soft' :
                      i === 2 ? 'text-txt2' : 'text-txt3'}`}>
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <PostCard post={p} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden xl:block w-56 shrink-0">
        <TrendingPanel />
      </div>
    </div>
  )
}