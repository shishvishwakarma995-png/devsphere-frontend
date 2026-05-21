"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Hash, Users, FileText } from "lucide-react"
import { search } from "@/lib/api"
import Link from "next/link"

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Debounce search — waits 300ms after typing stops
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults(null); setOpen(false); return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await search(query)
        setResults(data); setOpen(true)
      } catch {} finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const hasResults = results && (
    results.posts?.length || results.communities?.length || results.users?.length
  )

  return (
    <div className="relative flex-1 max-w-md" ref={ref}>
      <div className="flex items-center gap-2 bg-dark-elev border
                     border-dark-border rounded-lg h-9 px-3
                     focus-within:border-teal transition-colors">
        <Search size={13} className="text-txt3 shrink-0" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => hasResults && setOpen(true)}
          placeholder="Search posts, people, tags..."
          className="bg-transparent text-sm text-txt1
                     placeholder:text-txt3 outline-none flex-1"
        />
        {loading && (
          <div className="w-3 h-3 border border-teal border-t-transparent
                         rounded-full animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-11 left-0 right-0 z-50
                       bg-dark-card border border-dark-border
                       rounded-xl shadow-xl overflow-hidden">
          {!hasResults && (
            <p className="text-xs text-txt2 text-center py-4">
              No results for "{query}"
            </p>
          )}

          {/* Posts */}
          {results?.posts?.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] font-semibold text-txt3 uppercase
                            tracking-wider px-2 mb-1.5">Posts</p>
              {results.posts.map((p: any) => (
                <Link key={p.id} href={`/post/${p.id}`}
                  onClick={() => { setOpen(false); setQuery('') }}
                  className="flex items-start gap-2 px-3 py-2 rounded-lg
                             hover:bg-dark-elev transition-colors">
                  <FileText size={12} className="text-teal mt-0.5 shrink-0"/>
                  <div>
                    <p className="text-xs text-txt1 font-medium line-clamp-1">
                      {p.title}
                    </p>
                    <p className="text-[10px] text-txt3">
                      c/{p.community?.name} · @{p.author?.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Communities */}
          {results?.communities?.length > 0 && (
            <div className="p-2 border-t border-dark-border">
              <p className="text-[10px] font-semibold text-txt3 uppercase
                            tracking-wider px-2 mb-1.5">Communities</p>
              {results.communities.map((c: any) => (
                <Link key={c.id} href={`/c/${c.slug}`}
                  onClick={() => { setOpen(false); setQuery('') }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                             hover:bg-dark-elev transition-colors">
                  <Hash size={12} className="text-indigo shrink-0"/>
                  <div>
                    <p className="text-xs text-txt1 font-medium">c/{c.name}</p>
                    <p className="text-[10px] text-txt3">
                      {c._count?.members ?? 0} members
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Users */}
          {results?.users?.length > 0 && (
            <div className="p-2 border-t border-dark-border">
              <p className="text-[10px] font-semibold text-txt3 uppercase
                            tracking-wider px-2 mb-1.5">People</p>
              {results.users.map((u: any) => (
                <Link key={u.username} href={`/u/${u.username}`}
                  onClick={() => { setOpen(false); setQuery('') }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg
                             hover:bg-dark-elev transition-colors">
                  <div className="w-6 h-6 rounded-full bg-indigo flex items-center
                                justify-center text-[10px] font-bold text-white shrink-0">
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-txt1 font-medium">@{u.username}</p>
                    <p className="text-[10px] text-txt3 line-clamp-1">{u.headline}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}