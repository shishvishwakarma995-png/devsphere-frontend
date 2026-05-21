"use client"
import useSWR from "swr"
import Link from "next/link"
import { Hash, TrendingUp } from "lucide-react"

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
const fetchTrending = () =>
  fetch(`${BASE}/api/trending/tags`).then(r => r.json())

export default function TrendingPanel() {
  const { data: tags } = useSWR('trending-tags', fetchTrending, {
    refreshInterval: 60000 // refresh every 60 seconds
  })

  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4">
      <h3 className="text-xs font-semibold text-txt2 uppercase
                    tracking-wider mb-3 flex items-center gap-2">
        <TrendingUp size={11} className="text-teal"/>
        Trending Today
      </h3>

      {!tags && (
        <div className="space-y-2">
          {[...Array(5)].map((_,i) => (
            <div key={i}
              className="h-5 bg-dark-elev rounded animate-pulse"/>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {tags?.map((t: any, i: number) => (
          <Link key={t.tag}
            href={`/tag/${encodeURIComponent(t.tag)}`}
            className="flex items-center gap-2 hover:text-teal
                       transition-colors group">
            <span className="text-xs text-txt3 w-4 font-bold">{i+1}</span>
            <Hash size={10} className="text-teal/50 group-hover:text-teal
                                       transition-colors"/>
            <span className="text-xs text-txt1 flex-1 group-hover:text-teal
                            transition-colors font-medium">{t.tag}</span>
            <span className="text-[10px] text-txt3">{t.count} posts</span>
          </Link>
        ))}
        {tags?.length === 0 && (
          <p className="text-xs text-txt3 text-center py-2">
            No trending tags yet
          </p>
        )}
      </div>
    </div>
  )
}