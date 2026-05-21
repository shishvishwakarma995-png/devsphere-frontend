"use client"
import { useState, use } from "react"
import useSWR from "swr"
import { getPost, createComment } from "@/lib/api"
import PostCard from "@/components/PostCard"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PostDetailPage({ params }: PageProps) {
  const { id } = use(params)
  
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch Post data
  const { data: post, error, mutate } = useSWR(`/api/posts/${id}`, () => getPost(id))

  // Comment Submit Handler
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await createComment(id, commentText)
      setCommentText("")
      mutate() // Instant UI update via SWR refresh
    } catch (err) {
      console.error("Comment submit layout breakdown:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="inline-block bg-red-950/30 border border-red-500/30 rounded-xl px-6 py-4 text-red-400 text-sm font-medium shadow-lg shadow-red-950/20">
          ⚠️there is no post
        
        </div>
      </div>
    )
  }
  
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="flex items-center justify-center gap-3 text-teal font-medium tracking-wide">
          <div className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full animate-spin"></div>
          Loading dynamic threads...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 antialiased selection:bg-teal/30">
      
      {/* Back Navigation Link */}
      <div className="mb-6">
        <button 
          onClick={() => window.history.back()} 
          className="group text-xs text-txt2 hover:text-teal font-medium transition-all flex items-center gap-1.5"
        >
          <span className="inline-block transform group-hover:-translate-x-1 transition-transform">←</span> 
          Back to feed
        </button>
      </div>

      {/* Main Post Thread Component */}
      <div className="mb-8 shadow-xl shadow-black/10">
        <PostCard post={post} />
      </div>

      {/* Comment Section Segment */}
      <div className="mt-8 border-t border-dark-border/60 pt-8">
        
        {/* Discussion Header with Counter pill */}
        <div className="flex items-center gap-2.5 mb-6">
          <h3 className="text-base font-semibold tracking-tight text-txt">
            Discussion
          </h3>
          <span className="bg-dark-border text-teal text-xs font-semibold px-2.5 py-0.5 rounded-full border border-dark-border/80">
            {post.comments?.length || 0}
          </span>
        </div>

        {/* Premium Styled Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8 group">
          <div className="relative bg-dark-bg border border-dark-border rounded-xl transition-all duration-300 focus-within:border-teal/60 focus-within:shadow-[0_0_12px_rgba(20,184,166,0.08)] overflow-hidden">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts on this tech? Share insights..."
              className="w-full bg-transparent p-4 text-sm text-txt placeholder-txt2/50 focus:outline-none resize-none h-28 leading-relaxed"
            />
            
            {/* Dynamic Button Footer Area Inside Box */}
            <div className="flex justify-end items-center px-4 py-3 bg-dark-card/30 border-t border-dark-border/40">
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="bg-teal hover:bg-teal-hover disabled:opacity-30 disabled:hover:bg-teal text-dark-bg px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-md shadow-teal/10 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 border-2 border-dark-bg border-t-transparent rounded-full animate-spin"></span>
                    Sending...
                  </span>
                ) : "POST COMMENT"}
              </button>
            </div>
          </div>
        </form>

        {/* Render Refined Comments Stack */}
        <div className="space-y-3.5">
          {post.comments && post.comments.length === 0 ? (
            <div className="text-center py-10 bg-dark-card/20 border border-dashed border-dark-border rounded-xl text-xs text-txt2 tracking-wide">
              No comments yet. Be the first to drop a hot take! 💬
            </div>
          ) : (
            post.comments?.map((comment: any) => (
              <div 
                key={comment.id} 
                className="bg-dark-card border border-dark-border/70 p-4 rounded-xl transition-all hover:border-dark-border hover:shadow-md hover:shadow-black/5"
              >
                {/* Comment Metadata Meta Row */}
                <div className="flex justify-between items-center text-xs mb-2.5">
                  <div className="flex items-center gap-1.5">
                    {/* User Avatar Circle Fallback */}
                    <div className="w-5 h-5 rounded-full bg-teal/10 border border-teal/20 text-[10px] text-teal flex items-center justify-center font-bold">
                      {comment.author?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span className="font-semibold text-teal hover:underline cursor-pointer">
                      @{comment.author?.username || 'anonymous'}
                    </span>
                  </div>
                  <span className="text-txt2/70 text-[11px]">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                {/* Real Comment Text Body */}
                <p className="text-sm text-txt leading-relaxed pl-6">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}