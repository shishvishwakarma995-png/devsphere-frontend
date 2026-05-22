"use client"
import useSWR from "swr"
import Link from "next/link"
import { Users, Plus, Search } from "lucide-react"
import { getCommunities } from "@/lib/api"
import { useState } from "react"

export default function CommunitiesDirectoryPage() {
  const [search, setSearch] = useState("")
  const { data: communities, isLoading } = useSWR("communities", getCommunities)

  const filtered = communities?.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  if (isLoading) return (
    <div className="p-8 text-txt2 text-center animate-pulse">Scanning DevSphere ecosystem...</div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-txt1">Explore Communities</h1>
          <p className="text-xs text-txt2 mt-1">
            {communities?.length ?? 0} communities on DevSphere
          </p>
        </div>
        <Link
          href="/communities/create"
          className="flex items-center gap-1 bg-indigo text-white px-4 py-2 text-xs font-semibold rounded-lg hover:bg-indigo/90 transition-colors"
        >
          <Plus size={14} /> Create Space
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt2" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search communities..."
          className="w-full bg-dark-card border border-dark-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-txt1 placeholder:text-txt2 outline-none focus:border-indigo/50 transition-colors"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-txt2 text-sm">
          No communities found{search ? ` for "${search}"` : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c: any) => (
            <div
              key={c.id}
              className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col justify-between hover:border-indigo/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-indigo/10 text-indigo rounded-lg flex items-center justify-center font-bold text-sm border border-indigo/20">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <Link
                    href={`/c/${c.slug}`}
                    className="font-bold text-txt1 hover:text-indigo transition-colors text-base"
                  >
                    c/{c.slug}
                  </Link>
                </div>
                <p className="text-xs text-txt2 line-clamp-2 leading-relaxed">
                  {c.description || "No description yet."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-dark-border/40">
                <span className="flex items-center gap-1 text-xs text-txt2 font-mono">
                  <Users size={13} className="text-teal" />
                  {c._count?.members ?? 0} members
                </span>
                <Link
                  href={`/c/${c.slug}`}
                  className="text-xs bg-dark-border text-txt1 hover:bg-indigo hover:text-white px-3 py-1.5 rounded-md font-medium transition-all"
                >
                  View Space →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}