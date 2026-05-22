"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { Users, Plus, ArrowUp, MessageSquare } from "lucide-react"
import { getCommunity, joinCommunity, getMe } from "@/lib/api"

export default function CommunityPage() {
  const { slug } = useParams()
  const me = getMe()

  const { data, isLoading, mutate } = useSWR(
    slug ? `community-${slug}` : null,
    () => getCommunity(slug as string)
  )

  const [joinLoading, setJoinLoading] = useState(false)

  const community = data?.community ?? data
  const posts = data?.posts ?? []
  const isMember = data?.isMember ?? false
  const memberCount = data?.community?._count?.members ?? data?._count?.members ?? 0

  const handleJoin = async () => {
    if (!me) { window.location.href = '/login'; return }
    setJoinLoading(true)
    try {
      await joinCommunity(slug as string)
      // Sync localStorage so sidebar updates immediately
      const nextState = !isMember
      localStorage.setItem(`joined-c-${slug}`, nextState ? "true" : "false")
      mutate()
      // Notify sidebar to refresh
      window.dispatchEvent(new Event("sync-sidebar-spaces"))
    } catch (e) {
      console.error(e)
    } finally {
      setJoinLoading(false)
    }
  }

  if (isLoading) return (
    <div className="p-8 text-txt2 text-center animate-pulse">Loading community...</div>
  )

  if (!community) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold text-txt1 mb-2">Community not found</h2>
      <Link href="/communities" className="text-indigo text-sm hover:underline">Browse communities</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT: Posts */}
      <div className="md:col-span-2 space-y-4">

        {/* Banner */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-teal/10 text-teal border border-teal/20 rounded-xl flex items-center justify-center font-bold text-2xl uppercase">
            {String(slug).substring(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-txt1">c/{slug}</h1>
            <p className="text-xs text-txt2 mt-0.5">
              {community.description || `Welcome to c/${slug}`}
            </p>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center space-y-3">
            <div className="text-4xl">🚀</div>
            <h3 className="text-sm font-semibold text-txt1">No posts yet</h3>
            <p className="text-xs text-txt2">Be the first to post in this community!</p>
            <Link
              href={`/create?community=${slug}`}
              className="inline-flex items-center gap-1 bg-teal text-dark-bg px-4 py-2 rounded-lg text-xs font-bold mt-2"
            >
              <Plus size={13} /> Create Post
            </Link>
          </div>
        ) : (
          posts.map((post: any) => (
            <Link key={post.id} href={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-indigo/30 transition-all cursor-pointer">
                <div className="flex items-center gap-2 text-xs text-txt2 mb-2">
                  <span>by @{post.author?.username}</span>
                  <span>·</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-bold text-txt1 mb-2 hover:text-indigo transition-colors">
                  {post.title}
                </h3>
                {post.content && (
                  <p className="text-sm text-txt2 line-clamp-2 mb-3">{post.content}</p>
                )}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="text-xs bg-dark-border text-txt2 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-txt2 border-t border-dark-border/40 pt-3">
                  <span className="flex items-center gap-1">
                    <ArrowUp size={13} className="text-teal" />
                    {post._count?.votes ?? 0} votes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={13} />
                    {post._count?.comments ?? 0} comments
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* RIGHT: Sidebar */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-5 h-fit space-y-4">
        <h2 className="text-sm font-bold text-txt1">About c/{slug}</h2>
        <p className="text-xs text-txt2 leading-relaxed">
          {community.description || "A community for developers on DevSphere."}
        </p>

        <div className="flex items-center gap-2 text-xs text-txt1 font-medium py-2 border-y border-dark-border">
          <Users size={15} className="text-teal" />
          <span>{memberCount} members</span>
        </div>

        <button
          onClick={handleJoin}
          disabled={joinLoading}
          className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
            isMember
              ? "bg-teal/10 text-teal border border-teal/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
              : "bg-teal text-dark-bg hover:opacity-90 shadow-lg shadow-teal/20"
          }`}
        >
          {joinLoading ? "..." : isMember ? "✓ Joined" : "Join Community"}
        </button>

        <Link
          href={`/create?community=${slug}`}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold bg-dark-border text-txt1 hover:bg-dark-border/70 transition-colors"
        >
          <Plus size={13} /> Create Post
        </Link>
      </div>
    </div>
  )
}