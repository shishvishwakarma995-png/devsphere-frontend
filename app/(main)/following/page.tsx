"use client"
import useSWR from "swr"
import Link from "next/link"
import PostCard from "@/components/PostCard"
import TrendingPanel from "@/components/TrendingPanel"
import { Users, Loader2, UserPlus } from "lucide-react"
import { FeedSkeleton } from "@/components/SkeletonCard"

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

const fetchFollowingFeed = async () => {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}/api/feed/following`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  return res.json()
}

export default function FollowingPage() {
  const { data: posts, isLoading } = useSWR(
    'following-feed', fetchFollowingFeed
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex gap-6">
      <div className="flex-1 min-w-0">

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo/10 border border-indigo/20
                        flex items-center justify-center">
            <Users size={18} className="text-indigo-soft"/>
          </div>
          <div>
            <h1 className="text-lg font-bold text-txt1">Following</h1>
            <p className="text-xs text-txt2">Posts from people you follow</p>
          </div>
        </div>

        {isLoading && <FeedSkeleton />}

        {/* Empty state */}
        {!isLoading && posts?.length === 0 && (
          <div className="text-center py-16 bg-dark-card border border-dark-border
                         rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo/10 border border-indigo/20
                          flex items-center justify-center mx-auto mb-4">
              <UserPlus size={28} className="text-indigo-soft"/>
            </div>
            <h3 className="text-txt1 font-semibold mb-2">
              Your following feed is empty
            </h3>
            <p className="text-txt2 text-sm mb-5 max-w-xs mx-auto">
              Follow developers to see their posts here
            </p>
            <Link href="/communities"
              className="px-5 py-2.5 rounded-xl bg-teal text-dark-bg
                         font-semibold text-sm hover:bg-teal-dark transition-colors">
              Discover Communities
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {posts?.map((p: any) => <PostCard key={p.id} post={p}/>)}
        </div>
      </div>

      <div className="hidden xl:block w-56 shrink-0">
        <TrendingPanel />
      </div>
    </div>
  )
}