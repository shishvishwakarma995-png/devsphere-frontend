"use client"
import useSWR from "swr"
import Link from "next/link"
import PostCard from "@/components/PostCard"
import { getBookmarks } from "@/lib/api"
import { Bookmark, Loader2 } from "lucide-react"
import { FeedSkeleton } from "@/components/SkeletonCard"

export default function SavedPage() {
  const { data: posts, isLoading } = useSWR('bookmarks', getBookmarks)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20
                      flex items-center justify-center">
          <Bookmark size={18} className="text-teal" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-txt1">Saved Posts</h1>
          <p className="text-xs text-txt2">
            {posts?.length ?? 0} posts saved
          </p>
        </div>
      </div>
      {isLoading && <FeedSkeleton />}

      {/* Empty state */}
      {!isLoading && posts?.length === 0 && (
        <div className="text-center py-16 bg-dark-card border
                       border-dark-border rounded-2xl">
          <Bookmark size={36} className="text-teal/30 mx-auto mb-4" />
          <h3 className="text-txt1 font-semibold mb-2">
            No saved posts yet
          </h3>
          <p className="text-txt2 text-sm mb-5">
            Click the bookmark icon on any post to save it
          </p>
          <Link href="/home"
            className="px-5 py-2.5 rounded-xl bg-teal text-dark-bg
                       font-semibold text-sm hover:bg-teal-dark transition-colors">
            Browse Posts
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {posts?.map((p: any) => <PostCard key={p.id} post={p} />)}
      </div>
    </div>
  )
}