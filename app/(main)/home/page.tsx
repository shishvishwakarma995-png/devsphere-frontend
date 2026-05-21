"use client"
import useSWR from "swr"
import { useState } from "react"
import { getPosts } from "@/lib/api"
import PostCard from "@/components/PostCard"
import { Hash, Loader2 } from "lucide-react"
import TrendingPanel from "@/components/TrendingPanel"
import { FeedSkeleton } from "@/components/SkeletonCard"

const TABS = ['🔥 Hot', '✦ New', '▲ Top', '◈ Rising']
const SORT = ['hot', 'new', 'top', 'rising']

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(0)

  
  const { data, isLoading, error, mutate } = useSWR(
    ['posts', SORT[activeTab]],
    () => getPosts(SORT[activeTab])
  )

  
  const handlePostDelete = (deletedId: string) => {
    mutate(
      data?.filter((p: any) => p.id !== deletedId),
      false 
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-dark-border mb-4">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-sm border-b-2 -mb-px transition-all
                ${activeTab === i
                  ? 'text-teal border-teal font-medium'
                  : 'text-txt2 border-transparent hover:text-teal'
                }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && <FeedSkeleton />}

        {/* Error */}
        {error && (
          <div className="text-center py-12 text-red-400 text-sm">
            Could not load posts. Is your backend running on port 4000?
          </div>
        )}

        {/* Posts Area */}
        <div className="flex flex-col gap-3">
          {data && data.length === 0 && (
            <div className="text-center py-16 text-txt2">
              No posts yet — be the first to post! 🚀
            </div>
          )}
          
          
          {data?.map((p: any) => (
            <PostCard key={p.id} post={p} onDelete={handlePostDelete} />
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