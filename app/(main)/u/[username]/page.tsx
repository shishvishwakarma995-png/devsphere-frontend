"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { getUser, getMe, followUser } from "@/lib/api"
import { UserPlus, UserCheck } from "lucide-react"

export default function ProfilePage() {
  const { username } = useParams()
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts")
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followerCount, setFollowerCount] = useState<number | null>(null)

  const me = getMe()

  const { data: user, isLoading } = useSWR(
    username ? `user-${username}` : null,
    () => getUser(username as string),
    {
      onSuccess: (data) => {
        setFollowerCount(data._count?.followers ?? 0)
        if (data.isFollowing !== undefined) setFollowing(data.isFollowing)
      }
    }
  )

  const isOwnProfile = me?.username === username

  const handleFollow = async () => {
    if (!me) { window.location.href = '/login'; return }
    setFollowLoading(true)
    try {
      await followUser(username as string)
      setFollowing(f => !f)
      setFollowerCount(c => (c ?? 0) + (following ? -1 : 1))
    } catch (e) {
      console.error(e)
    } finally {
      setFollowLoading(false)
    }
  }

  if (isLoading) return (
    <div className="flex justify-center py-20 text-txt2 animate-pulse">Loading DevSphere Profile...</div>
  )

  if (!user) return (
    <div className="flex justify-center py-20 text-txt2">
      <div className="text-center">
        <h2 className="text-xl font-bold text-txt1 mb-2">User Not Found</h2>
        <p className="text-sm text-txt2 mb-4">The developer @{username} hasn't joined DevSphere yet.</p>
        <Link href="/home" className="text-indigo hover:underline text-sm">Return Home</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Profile Info Card */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 relative overflow-hidden">
          {/* Accent Header Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo to-teal"></div>
          
          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-24 h-24 rounded-full bg-indigo border-4 border-dark-border flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4">
              {user.username?.[0]?.toUpperCase()}
            </div>
            
            <h1 className="text-xl font-bold text-txt1">@{user.username}</h1>
            {user.name && <p className="text-txt2 text-sm font-medium">{user.name}</p>}
            {user.headline && (
              <p className="text-teal text-xs font-mono bg-teal/10 px-2.5 py-1 rounded-full mt-2">
                {user.headline}
              </p>
            )}
          </div>

          <p className="text-txt2 text-sm my-4 text-center italic">
            {user.bio || "No bio added yet."}
          </p>

          {/* Social Stats */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-dark-border text-center text-xs text-txt2">
            <div>
              <span className="block font-bold text-txt1 text-sm">{user._count?.posts ?? 0}</span>
              Posts
            </div>
            <div>
              <span className="block font-bold text-txt1 text-sm">
                {followerCount ?? user._count?.followers ?? 0}
              </span>
              Followers
            </div>
            <div>
              <span className="block font-bold text-txt1 text-sm">{user._count?.following ?? 0}</span>
              Following
            </div>
          </div>

          {/* Follow / Edit Button */}
          {isOwnProfile ? (
            <Link
              href={`/u/${user.username}/settings`}
              className="block w-full mt-4 text-center text-xs font-semibold bg-dark-border text-txt1 hover:bg-dark-border/80 px-4 py-2.5 rounded-lg transition-colors"
            >
              Edit Profile & Settings
            </Link>
          ) : (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                following
                  ? "bg-dark-border text-txt2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 border border-dark-border"
                  : "bg-teal text-dark-bg hover:bg-teal-dark shadow-lg shadow-teal/20"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {following
                ? <><UserCheck size={13} /> Following</>
                : <><UserPlus size={13} /> Follow</>
              }
            </button>
          )}
        </div>
        
        {/* Tech Stack Widget */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-txt1 mb-3">Verified Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {user.skills?.map((skill: string) => (
              <span key={skill} className="text-xs bg-dark-border text-txt2 px-2.5 py-1 rounded-md">
                {skill}
              </span>
            )) || (
              <p className="text-xs text-txt2 italic">No skills listed yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Tabs */}
      <div className="md:col-span-2 space-y-4">
        {/* Tab Controls */}
        <div className="flex border-b border-dark-border bg-dark-card rounded-t-xl p-1">
          <button 
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "posts" 
                ? "bg-dark-border text-txt1 font-semibold shadow-sm" 
                : "text-txt2 hover:text-txt1"
            }`}
          >
            Posts ({user.posts?.length ?? 0})
          </button>
          <button 
            onClick={() => setActiveTab("comments")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "comments" 
                ? "bg-dark-border text-txt1 font-semibold shadow-sm" 
                : "text-txt2 hover:text-txt1"
            }`}
          >
            Comments ({user.comments?.length ?? 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-3">
          {activeTab === "posts" ? (
            user.posts && user.posts.length > 0 ? (
              user.posts.map((post: any) => (
                <div key={post.id} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-dark-border/80 transition-colors">
                  <span className="text-xs text-txt2 font-mono">Posted in c/{post.community?.slug || "general"}</span>
                  <h3 className="text-base font-bold text-txt1 mt-1 hover:text-indigo cursor-pointer">{post.title}</h3>
                  <p className="text-sm text-txt2 mt-2 line-clamp-2">{post.content}</p>
                </div>
              ))
            ) : (
              <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center text-txt2 text-sm">
                This user hasn't posted anything yet.
              </div>
            )
          ) : (
            user.comments && user.comments.length > 0 ? (
              user.comments.map((comment: any) => (
                <div key={comment.id} className="bg-dark-card border border-dark-border rounded-xl p-4">
                  <p className="text-xs text-txt2">Replied to a post</p>
                  <p className="text-sm text-txt1 mt-1.5">{comment.content}</p>
                  <span className="text-xs text-txt2 block mt-2 font-mono">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center text-txt2 text-sm">
                This user hasn't written any comments yet.
              </div>
            )
          )}
        </div>
      </div>

    </div>
  )
}