"use client"
import { useState } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { getCommunities, createPost } from "@/lib/api"
import { Send, X, Plus } from "lucide-react"

export default function CreatePostPage() {
  const router = useRouter()
  const { data: communities } = useSWR('communities', getCommunities)

  const [form, setForm] = useState({
    title: '', content: '', communityId: '', type: 'text', tags: [] as string[]
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addTag = () => {
    if (tagInput.trim() && form.tags.length < 5) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (i: number) =>
    setForm(f => ({ ...f, tags: f.tags.filter((_, idx) => idx !== i) }))

  const handleSubmit = async () => {
    if (!form.title || !form.communityId) {
      setError('Title and community are required'); return
    }
    try {
      setLoading(true)
      await createPost(form)
      router.push('/')
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-txt1 mb-6">Create Post</h1>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        {/* Post type tabs */}
        <div className="flex gap-2">
          {['text', 'code', 'link'].map(t => (
            <button key={t} onClick={() => set('type', t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                ${form.type === t
                  ? 'bg-teal text-dark-bg'
                  : 'bg-dark-elev text-txt2 hover:text-teal border border-dark-border'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Community picker */}
        <div>
          <label className="text-xs text-txt2 mb-1.5 block">Community *</label>
          <select onChange={e => set('communityId', e.target.value)}
            className="w-full bg-dark-elev border border-dark-border text-txt1
                       rounded-lg px-3 py-2.5 text-sm outline-none
                       focus:border-teal transition-colors">
            <option value="">Select a community</option>
            {communities?.map((c: any) => (
              <option key={c.id} value={c.id}>c/{c.name}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs text-txt2 mb-1.5 block">Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="What's on your mind?" maxLength={200}
            className="w-full bg-dark-elev border border-dark-border text-txt1
                       rounded-lg px-3 py-2.5 text-sm placeholder:text-txt3
                       outline-none focus:border-teal transition-colors" />
        </div>

        {/* Content */}
        <div>
          <label className="text-xs text-txt2 mb-1.5 block">Content</label>
          <textarea value={form.content} onChange={e => set('content', e.target.value)}
            placeholder="Share your thoughts, code, or links..." rows={5}
            className="w-full bg-dark-elev border border-dark-border text-txt1
                       rounded-lg px-3 py-2.5 text-sm placeholder:text-txt3
                       outline-none focus:border-teal transition-colors resize-none" />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs text-txt2 mb-1.5 block">Tags (max 5)</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {form.tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1 text-xs px-2 py-1
                                     bg-teal-glow text-teal border border-teal-border
                                     rounded-md">
                {tag}
                <button onClick={() => removeTag(i)}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder="Add tag..."
              className="flex-1 bg-dark-elev border border-dark-border text-txt1
                         rounded-lg px-3 py-2 text-sm placeholder:text-txt3
                         outline-none focus:border-teal transition-colors" />
            <button onClick={addTag}
              className="px-3 py-2 bg-dark-elev border border-dark-border
                         text-teal rounded-lg hover:border-teal transition-colors">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5
                     rounded-lg bg-teal text-dark-bg font-semibold text-sm
                     hover:bg-teal-dark transition-colors disabled:opacity-50">
          {loading ? 'Posting...' : <><Send size={14} /> Publish Post</>}
        </button>
      </div>
    </div>
  )
}