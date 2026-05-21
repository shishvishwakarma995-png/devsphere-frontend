"use client"
import { useState } from "react"
import useSWR from "swr"
import { getComments, addComment } from "@/lib/api"
import { Send, Loader2 } from "lucide-react"

export default function CommentsSection({ postId }: { postId: string }) {
  const { data: comments, mutate, isLoading } = useSWR(
    `comments-${postId}`,
    () => getComments(postId)
  )
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!text.trim()) return
    const token = localStorage.getItem('token')
    if (!token) { alert('Login to comment!'); return }
    setSubmitting(true)
    try {
      await addComment(postId, text)
      setText('')
      mutate() // refresh comments
    } catch (e) { alert('Failed to post comment') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-txt1 mb-4 flex items-center gap-2">
        💬 Comments
        <span className="text-xs text-txt3 font-normal">
          ({comments?.length ?? 0})
        </span>
      </h3>

      {/* Comment input */}
      <div className="bg-dark-elev border border-dark-border rounded-xl
                     p-3 mb-5 focus-within:border-teal transition-colors">
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Share your thoughts..." rows={3}
          className="w-full bg-transparent text-txt1 text-sm placeholder:text-txt3
                     outline-none resize-none" />
        <div className="flex justify-end mt-2">
          <button onClick={submit} disabled={submitting || !text.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg
                       bg-teal text-dark-bg text-xs font-semibold
                       hover:bg-teal-dark transition-colors disabled:opacity-40">
            {submitting
              ? <Loader2 size={12} className="animate-spin"/>
              : <Send size={12}/>}
            Comment
          </button>
        </div>
      </div>

      {/* Comments list */}
      {isLoading && <div className="text-center py-6 text-txt2"><Loader2 size={16} className="animate-spin inline"/></div>}
      <div className="flex flex-col gap-3">
        {comments?.map((c: any) => (
          <div key={c.id}
            className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-indigo flex items-center
                            justify-center text-[10px] font-bold text-white">
                {c.author?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-medium text-teal">
                @{c.author?.username}
              </span>
              <span className="text-xs text-txt3">·</span>
              <span className="text-xs text-txt3">
                {new Date(c.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-txt1 leading-relaxed">{c.content}</p>
          </div>
        ))}
        {comments?.length === 0 && (
          <p className="text-center text-txt2 text-sm py-6">
            No comments yet — be the first!
          </p>
        )}
      </div>
    </div>
  )
}