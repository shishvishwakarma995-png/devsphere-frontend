"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCommunity } from "@/lib/api"
import { Hash, Loader2 } from "lucide-react"

export default function CreateCommunityPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    set('name', name)
    set('slug', name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.slug) return setError('Name and slug are required')
    setLoading(true)
    try {
      await createCommunity(form)
      router.push(`/c/${form.slug}`)
    } catch (e: any) {
      setError('Community name already taken. Try another.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20
                        flex items-center justify-center">
          <Hash size={18} className="text-teal" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-txt1">Create Community</h1>
          <p className="text-xs text-txt2">Build a space for your topic</p>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs text-txt2 mb-1.5 block font-medium">
            Community Name *
          </label>
          <input
            value={form.name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. React Developers"
            className="w-full bg-dark-elev border border-dark-border text-txt1
                       rounded-lg px-3 py-2.5 text-sm placeholder:text-txt3
                       outline-none focus:border-teal transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-txt2 mb-1.5 block font-medium">
            Slug (URL) *
          </label>
          <div className="flex items-center bg-dark-elev border border-dark-border
                          rounded-lg overflow-hidden focus-within:border-teal transition-colors">
            <span className="text-txt3 text-sm px-3 border-r border-dark-border">c/</span>
            <input
              value={form.slug}
              onChange={e => set('slug', e.target.value)}
              placeholder="react-developers"
              className="flex-1 bg-transparent text-txt1 px-3 py-2.5 text-sm
                         placeholder:text-txt3 outline-none"
            />
          </div>
          <p className="text-[10px] text-txt3 mt-1">
            URL: devsphere.com/c/{form.slug || 'your-slug'}
          </p>
        </div>

        <div>
          <label className="text-xs text-txt2 mb-1.5 block font-medium">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="What is this community about?"
            rows={3}
            className="w-full bg-dark-elev border border-dark-border text-txt1
                       rounded-lg px-3 py-2.5 text-sm placeholder:text-txt3
                       outline-none focus:border-teal transition-colors resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full py-2.5 rounded-xl bg-teal text-dark-bg font-semibold
                     text-sm hover:bg-teal-dark transition-colors
                     disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={14} className="animate-spin"/> Creating...</> : 'Create Community'}
        </button>
      </div>
    </div>
  )
}