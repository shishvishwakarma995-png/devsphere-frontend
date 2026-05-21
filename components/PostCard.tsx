"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUp, ArrowDown, MessageSquare, Share2, Trash2 } from "lucide-react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { votePost, toggleBookmark, deletePost, getMe } from "@/lib/api"

export default function PostCard({ post, onDelete }: { post: any, onDelete?: (id: string) => void }) {
  const voteCount = post._count?.votes ?? post.voteCount ?? 0
  const commentCount = post._count?.comments ?? post.commentCount ?? 0
  const [votes, setVotes] = useState(voteCount)
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null)
  const [voting, setVoting] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [bLoading, setBLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    // Check if logged-in user is the post author
    const me = getMe()
    if (me && post.author?.username === me.username) {
      setIsOwner(true)
    }
  }, [post.author?.username])

  const handleVote = async (type: 'UP' | 'DOWN') => {
    const token = localStorage.getItem('token')
    if (!token) { alert('Login to vote!'); return }
    if (voting) return
    setVoting(true)
    try {
      const res = await votePost(post.id, type)
      if (res.action === 'removed') {
        setVotes((v: number) => type === 'UP' ? v - 1 : v + 1)
        setUserVote(null)
      } else if (res.action === 'added') {
        setVotes((v: number) => type === 'UP' ? v + 1 : v - 1)
        setUserVote(type)
      } else {
        setVotes((v: number) => type === 'UP' ? v + 2 : v - 2)
        setUserVote(type)
      }
    } catch { } finally { setVoting(false) }
  }

  const handleBookmark = async () => {
    const token = localStorage.getItem('token')
    if (!token) { alert('Login to bookmark!'); return }
    setBLoading(true)
    try {
      const res = await toggleBookmark(post.id)
      setBookmarked(res.bookmarked)
    } catch { } finally { setBLoading(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    try {
      await deletePost(post.id)
      // Tell parent to remove this card from the list
      if (onDelete) onDelete(post.id)
    } catch {
      alert('Failed to delete post')
    } finally { setDeleting(false) }
  }

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4
                   hover:border-teal/30 transition-all group">

      {/* Top meta */}
      <div className="flex items-center gap-2 mb-2 text-xs text-txt3">
        <Link href={`/c/${post.community?.slug}`}
          className="text-teal font-semibold hover:underline">
          c/{post.community?.name}
        </Link>
        <span>·</span>
        <span>by @{post.author?.username}</span>
        <span>·</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>

        {/* Delete button — only for post author */}
        {isOwner && (
          <button onClick={handleDelete} disabled={deleting}
            title="Delete post"
            className="ml-auto flex items-center gap-1 text-txt3
                       hover:text-red-400 transition-colors text-[10px]
                       disabled:opacity-50">
            <Trash2 size={11} />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      {/* Title */}
      <Link href={`/post/${post.id}`}>
        <h2 className="text-txt1 font-medium text-sm leading-snug mb-2
                      group-hover:text-teal transition-colors">
          {post.title}
        </h2>
      </Link>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-3">
        {post.tags?.map((tag: string) => (
          <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}
            className="text-[10px] px-2 py-0.5 rounded-md
                       bg-teal/10 text-teal border border-teal/20
                       hover:bg-teal hover:text-dark-bg transition-all">
            #{tag}
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Vote */}
        <div className="flex items-center bg-dark-elev border border-dark-border
                       rounded-lg overflow-hidden">
          <button onClick={() => handleVote('UP')} disabled={voting}
            className={`px-2.5 py-1.5 transition-colors
              ${userVote === 'UP' ? 'text-teal' : 'text-txt2 hover:text-teal'}`}>
            <ArrowUp size={13} />
          </button>
          <span className="text-xs font-bold px-1"
            style={{ color: votes > 0 ? '#2DD4BF' : votes < 0 ? '#f87171' : '#5D7A9A' }}>
            {votes}
          </span>
          <button onClick={() => handleVote('DOWN')} disabled={voting}
            className={`px-2.5 py-1.5 transition-colors
              ${userVote === 'DOWN' ? 'text-red-400' : 'text-txt2 hover:text-red-400'}`}>
            <ArrowDown size={13} />
          </button>
        </div>

        {/* Comments */}
        <Link href={`/post/${post.id}`}
          className="flex items-center gap-1.5 text-xs text-txt2 px-3 py-1.5
                     rounded-lg bg-dark-elev border border-dark-border
                     hover:text-teal hover:border-teal/30 transition-all">
          <MessageSquare size={12} /> {commentCount}
        </Link>

        {/* Share */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`)
            alert('Link copied!')
          }}
          className="flex items-center gap-1.5 text-xs text-txt2 px-3 py-1.5
                     rounded-lg bg-dark-elev border border-dark-border
                     hover:text-teal hover:border-teal/30 transition-all">
          <Share2 size={12} /> Share
        </button>

        {/* Bookmark */}
        <button onClick={handleBookmark} disabled={bLoading}
          title={bookmarked ? "Remove bookmark" : "Save post"}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
                      bg-dark-elev border transition-all ml-auto
                      ${bookmarked
                        ? 'text-teal border-teal/40'
                        : 'text-txt2 border-dark-border hover:text-teal hover:border-teal/30'
                      }`}>
          {bookmarked ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
        </button>
      </div>
    </div>
  )
}